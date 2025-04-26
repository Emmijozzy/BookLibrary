using BookLibrary.Server.Application.Interface;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.Net;

namespace BookLibrary.Server.Infrastructure.Services
{
    public class FileUploadService : IFileUploadService
    {
        private readonly Cloudinary _cloudinary;
        private readonly IConfiguration _configuration;
        private readonly string _cloudName;
        private readonly string _apiKey;
        private readonly string _apiSecret;

        public FileUploadService(IConfiguration configuration)
        {
            _configuration = configuration;

            // Get Cloudinary configuration
            _cloudName = _configuration["CloudinarySettings:CloudName"];
            _apiKey = _configuration["CloudinarySettings:ApiKey"];
            _apiSecret = _configuration["CloudinarySettings:ApiSecret"];

            // Validate configuration
            if (string.IsNullOrEmpty(_cloudName) || string.IsNullOrEmpty(_apiKey) || string.IsNullOrEmpty(_apiSecret))
            {
                throw new InvalidOperationException("Cloudinary configuration is missing or incomplete. Please check your appsettings.json file.");
            }

            // Initialize Cloudinary
            var account = new Account(_cloudName, _apiKey, _apiSecret);
            _cloudinary = new Cloudinary(account);
        }

        public async Task<string> UploadFileAsync(IFormFile file, string folder)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is required", nameof(file));

            await using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                Folder = folder,
                File = new FileDescription(file.FileName, stream)
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.StatusCode != HttpStatusCode.OK)
                throw new Exception($"Cloudinary upload failed: {uploadResult.Error?.Message}");

            Console.WriteLine("File uploaded to Cloudinary: " + uploadResult.SecureUrl.ToString());
            return uploadResult.SecureUrl.ToString();
        }

        public async Task<string> GetSignedUrlAsync(string url)
        {
            if (string.IsNullOrEmpty(url))
                return url;

            try
            {
                // Extract the public ID from the URL
                string publicId = ExtractPublicIdFromUrl(url);

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
                var queryString = $"api_key={_apiKey}×tamp={timestamp}&signature={signature}";

                // Set the query string (overwriting any existing query)
                uriBuilder.Query = queryString;

                return uriBuilder.Uri.ToString();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error generating signed URL: {ex.Message}");
                return url; // Return the original URL if there's an error
            }
        }

        public async Task<string> GetFileUrlAsync(Guid id, string type)
        {
            // This method would typically query your database to get the file URL
            // For this example, we'll return a placeholder
            throw new NotImplementedException("This method needs to be implemented to retrieve file URLs from your database");
        }

        private string ExtractPublicIdFromUrl(string url)
        {
            try
            {
                // Parse the URL
                var uri = new Uri(url);

                // Split the path segments
                var segments = uri.AbsolutePath.TrimStart('/').Split('/');

                // For PDFs, the format is typically: /[resource_type]/[delivery_type]/v[version]/[public_id].[extension]
                // For example: /raw/upload/v1234567890/folder/file.pdf

                // Skip resource_type and delivery_type
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
                    return remainingPath.Substring(0, remainingPath.Length - extension.Length);
                }

                return remainingPath;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error extracting public ID: {ex.Message}");
                // Return the original URL as a fallback
                return url;
            }
        }


        public async Task<byte[]> FetchCloudinaryFileAsync(string url)
        {
            if (string.IsNullOrEmpty(url))
                throw new ArgumentNullException(nameof(url), "URL cannot be null or empty");

            try
            {
                // For PDFs, we need to use a different approach since they're stored as "raw" files in Cloudinary
                bool isPdf = url.Contains(".pdf", StringComparison.OrdinalIgnoreCase);

                if (isPdf)
                {
                    // For PDFs, we'll use the Cloudinary API directly
                    // Extract the public ID from the URL
                    string publicId = ExtractPublicIdFromUrl(url);

                    // Use Cloudinary's GetResourceAsync method to get the file
                    var getResourceParams = new GetResourceParams(publicId)
                    {
                        ResourceType = ResourceType.Raw
                    };

                    var resource = await _cloudinary.GetResourceAsync(getResourceParams);

                    // Download the file from the secure URL
                    using (var httpClient = new HttpClient())
                    {
                        return await httpClient.GetByteArrayAsync(resource.SecureUrl);
                    }
                }
                else
                {
                    // For images, we can use the signed URL approach
                    string signedUrl = await GetSignedUrlAsync(url);

                    using (var httpClient = new HttpClient())
                    {
                        // Add API key and secret to the request headers
                        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString();
                        var signature = _cloudinary.Api.SignParameters(
                            new Dictionary<string, object> { { "timestamp", timestamp } }
                        );

                        httpClient.DefaultRequestHeaders.Add("X-Cloudinary-API-Key", _apiKey);
                        httpClient.DefaultRequestHeaders.Add("X-Cloudinary-API-Secret", _apiSecret);

                        return await httpClient.GetByteArrayAsync(signedUrl);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching file from Cloudinary: {ex.Message}");
                throw new HttpRequestException($"Failed to fetch file from Cloudinary: {ex.Message}", ex);
            }
        }


        //private string GenerateSignature(string publicId, int timestamp)
        //{
        //    var apiSecret = configuration["Cloudinary:ApiSecret"];
        //    var stringToSign = $"public_id={publicId}×tamp={timestamp}{apiSecret}";

        //    using (var sha1 = System.Security.Cryptography.SHA1.Create())
        //    {
        //        var hash = sha1.ComputeHash(System.Text.Encoding.UTF8.GetBytes(stringToSign));
        //        return BitConverter.ToString(hash).Replace("-", "").ToLower();
        //    }
        //}
    }
}
