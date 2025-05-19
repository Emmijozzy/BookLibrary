using BookLibrary.Server.Application.Common;
using BookLibrary.Server.Application.Exceptions;
using BookLibrary.Server.Application.Interface;
using BookLibrary.Server.Domain.Entities;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Net;

namespace BookLibrary.Server.Infrastructure.Services
{
    public class FileUploadService : IFileUploadService
    {
        private readonly Cloudinary _cloudinary;
        private readonly ILogger<FileUploadService> _logger;
        private readonly IGenericRepository<Book> _bookRepository;
        private readonly string[] _validImageExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp" };

        public FileUploadService(IConfiguration configuration, ILogger<FileUploadService> logger, IGenericRepository<Book> bookRepository)
        {
            _logger = logger;
            _bookRepository = bookRepository;

            // Get Cloudinary configuration
            var cloudName = configuration["CloudinarySettings:CloudName"];
            var apiKey = configuration["CloudinarySettings:ApiKey"];
            var apiSecret = configuration["CloudinarySettings:ApiSecret"];

            // Validate configuration
            if (string.IsNullOrEmpty(cloudName) || string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiSecret))
            {
                throw new InvalidOperationException("Cloudinary configuration is missing or incomplete. Please check your appsettings.json file.");
            }

            // Initialize Cloudinary
            var account = new Account(cloudName, apiKey, apiSecret);
            _cloudinary = new Cloudinary(account);
        }

        public async Task<string> UploadFileAsync(IFormFile file, string folder)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is required", nameof(file));

            try
            {
                await using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    Folder = folder,
                    File = new FileDescription(file.FileName, stream)
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.StatusCode != HttpStatusCode.OK)
                    throw new Exception($"Cloudinary upload failed: {uploadResult.Error?.Message}");

                _logger.LogInformation("File uploaded to Cloudinary: {Url}", uploadResult.SecureUrl.ToString());
                return uploadResult.SecureUrl.ToString();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading file to Cloudinary");
                throw;
            }
        }

        public async Task<string> GetSignedUrlAsync(string url)
        {
            if (string.IsNullOrEmpty(url))
                return url;

            try
            {
                // Extract the public ID from the URL
                string publicId = ExtractPublicIdFromUrl(url);
                
                // Get API key from Cloudinary instance
                var apiKey = _cloudinary.Api.Account.ApiKey;
                
                // Generate timestamp (valid for 1 hour)
                var timestamp = DateTimeOffset.UtcNow.AddHours(1).ToUnixTimeSeconds().ToString();

                // Create parameters for signing
                var parameters = new Dictionary<string, object>
                {
                    { "public_id", publicId },
                    { "timestamp", timestamp }
                };

                // Generate signature
                var signature = _cloudinary.Api.SignParameters(parameters);

                // Parse the original URL
                var uri = new Uri(url);
                var uriBuilder = new UriBuilder(uri);

                // Create a new query string with our parameters
                var queryString = $"api_key={apiKey}&timestamp={timestamp}&signature={signature}";

                // Set the query string (overwriting any existing query)
                uriBuilder.Query = queryString;

                return uriBuilder.Uri.ToString();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating signed URL");
                return url; // Return the original URL if there's an error
            }
        }

        public async Task<bool> DeleteFileAsync(string url)
        {
            if (string.IsNullOrEmpty(url))
                throw new ArgumentNullException(nameof(url), "URL to delete file cannot be null or empty");

            try
            {
                // Extract the public ID from the URL
                string publicId = ExtractPublicIdFromUrl(url);
                _logger.LogInformation($"Attempting to delete file with extracted public ID: {publicId}");

                // Determine if it's an Image or raw file like PDF
                bool isPdf = url.Contains(".pdf", StringComparison.OrdinalIgnoreCase);
                var resourceType = isPdf ? ResourceType.Raw : ResourceType.Image;

                // Use Cloudinary's DestroyAsync method to delete the file
                var deleteParams = new DeletionParams(publicId)
                {
                    ResourceType = resourceType
                };

                // Execute the deletion
                var result = await _cloudinary.DestroyAsync(deleteParams);
                _logger.LogInformation($"Cloudinary delete response - Result: {result.Result}, Status: {result.StatusCode}");

                if (result.StatusCode != HttpStatusCode.OK)
                    throw new Exception($"Cloudinary delete failed: {result.Error?.Message}");

                return result.Result == "ok";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting file from Cloudinary");
                throw;
            }
        }

        private string ExtractPublicIdFromUrl(string url)
        {
            try
            {
                // Parse the URL
                var uri = new Uri(url);

                // Split the path segments
                var segments = uri.AbsolutePath.TrimStart('/').Split('/');

                // Find the index of the version segment (starts with 'v' followed by numbers)
                int versionIndex = -1;
                for (int i = 0; i < segments.Length; i++)
                {
                    if (segments[i].StartsWith("v") && segments[i].Length > 1 &&
                        segments[i].Substring(1).All(char.IsDigit))
                    {
                        versionIndex = i;
                        break;
                    }
                }

                // If we found a version segment, the public ID starts after it
                if (versionIndex >= 0 && versionIndex < segments.Length - 1)
                {
                    var publicIdSegments = segments.Skip(versionIndex + 1).ToArray();
                    string publicId = string.Join("/", publicIdSegments);

                    // Remove file extension if present
                    if (publicId.Contains("."))
                    {
                        string extension = Path.GetExtension(publicId);
                        publicId = publicId.Substring(0, publicId.Length - extension.Length);
                    }

                    _logger.LogInformation($"Extracted public ID: {publicId} from URL: {url}");
                    return publicId;
                }

                // Fallback: use the original extraction method
                var remainingPath = string.Join("/", segments.Skip(2));

                // Remove version number if present (v1234567890/)
                if (remainingPath.StartsWith("v") && remainingPath.Contains("/"))
                {
                    remainingPath = remainingPath.Substring(remainingPath.IndexOf('/') + 1);
                }

                // Remove file extension
                if (remainingPath.Contains("."))
                {
                    string extension = Path.GetExtension(remainingPath);
                    remainingPath = remainingPath.Substring(0, remainingPath.Length - extension.Length);
                }

                _logger.LogInformation($"Extracted public ID (fallback method): {remainingPath} from URL: {url}");
                return remainingPath;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error extracting public ID from URL: {url}");
                // Return just the URL as a fallback
                return url;
            }
        }

        public async Task<ServiceResult<string>> UploadFile(IFormFile file, string folder)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("No file uploaded");

            // Validate file type based on folder
            string extension = Path.GetExtension(file.FileName).ToLower();
            
            if (folder.Contains("images") && !IsValidImageExtension(extension))
            {
                throw new ArgumentException($"Invalid image file type. Allowed types: {string.Join(", ", _validImageExtensions)}");
            }
            else if (folder.Contains("pdfs") && extension != ".pdf")
            {
                throw new ArgumentException("Invalid file type. Only PDF files are allowed.");
            }

            // Upload the file to Cloudinary
            string url = await UploadFileAsync(file, folder);
            _logger.LogInformation("File uploaded successfully: {Url}", url);

            return ServiceResult<string>.Success(url, "File uploaded successfully");
        }

        public async Task<ServiceResult<string>> GetFileUrl(Guid id, string type = "pdf")
        {
            _logger.LogInformation("Getting file URL for book ID: {Id}, type: {Type}", id, type);

            if (id == Guid.Empty)
                throw new ArgumentException("Invalid book ID");

            // Get the book to find the file URL
            var bookResult = await _bookRepository.GetByIdAsync(id);

            if (!bookResult.IsSuccess || bookResult.Result == null)
                throw new NotFoundException("Book not found", typeof(Book));

            // Get the appropriate URL based on the type
            string fileUrl = type.ToLower() == "pdf" ? bookResult.Result.PdfUrl : bookResult.Result.ImageUrl;
            
            if (string.IsNullOrEmpty(fileUrl))
                throw new NotFoundException($"{type.ToUpper()} file not found for this book", typeof(Book));

            // Generate a signed URL
            string signedUrl = await GetSignedUrlAsync(fileUrl);
            _logger.LogInformation("Generated signed URL: {Url}", signedUrl);

            return ServiceResult<string>.Success(signedUrl, "File URL generated successfully");
        }

        private bool IsValidImageExtension(string extension)
        {
            return _validImageExtensions.Contains(extension);
        }

        //public async Task<byte[]> FetchCloudinaryFileAsync(string url)
        //{
        //    if (string.IsNullOrEmpty(url))
        //        throw new ArgumentNullException(nameof(url), "URL cannot be null or empty");

        //    try
        //    {
        //        // For PDFs, we need to use a different approach since they're stored as "raw" files in Cloudinary
        //        bool isPdf = url.Contains(".pdf", StringComparison.OrdinalIgnoreCase);

        //        if (isPdf)
        //        {
        //            // For PDFs, we'll use the Cloudinary API directly
        //            // Extract the public ID from the URL
        //            string publicId = ExtractPublicIdFromUrl(url);

        //            // Use Cloudinary's GetResourceAsync method to get the file
        //            var getResourceParams = new GetResourceParams(publicId)
        //            {
        //                ResourceType = ResourceType.Raw
        //            };

        //            var resource = await _cloudinary.GetResourceAsync(getResourceParams);

        //            // Download the file from the secure URL
        //            using (var httpClient = new HttpClient())
        //            {
        //                return await httpClient.GetByteArrayAsync(resource.SecureUrl);
        //            }
        //        }
        //        else
        //        {
        //            // For images, we can use the signed URL approach
        //            string signedUrl = await GetSignedUrlAsync(url);

        //            using (var httpClient = new HttpClient())
        //            {
        //                // Add API key and secret to the request headers
        //                var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString();
        //                var signature = _cloudinary.Api.SignParameters(
        //                    new Dictionary<string, object> { { "timestamp", timestamp } }
        //                );

        //                httpClient.DefaultRequestHeaders.Add("X-Cloudinary-API-Key", _apiKey);
        //                httpClient.DefaultRequestHeaders.Add("X-Cloudinary-API-Secret", _apiSecret);

        //                return await httpClient.GetByteArrayAsync(signedUrl);
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine($"Error fetching file from Cloudinary: {ex.Message}");
        //        throw new HttpRequestException($"Failed to fetch file from Cloudinary: {ex.Message}", ex);
        //    }
        //}
    }
}