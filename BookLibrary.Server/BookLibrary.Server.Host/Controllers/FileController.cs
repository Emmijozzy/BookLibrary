using BookLibrary.Server.Application.Interface;
using BookLibrary.Server.Application.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookLibrary.Server.Host.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileController : ControllerBase
    {
        private readonly IFileUploadService _fileService;
        private readonly ILogger<FileController> _logger;

        public FileController(
            IFileUploadService fileService,
            ILogger<FileController> logger)
        {
            _fileService = fileService;
            _logger = logger;
        }

        [HttpPost("upload")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> UploadFile(IFormFile file, [FromQuery] string folder)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            try
            {
                _logger.LogInformation("Uploading file: {FileName} to folder: {Folder}", file.FileName, folder);

                // Validate file type based on folder
                string extension = Path.GetExtension(file.FileName).ToLower();
                if (folder.Contains("images") && !IsValidImageExtension(extension))
                {
                    return BadRequest("Invalid image file type. Allowed types: jpg, jpeg, png, gif, bmp, webp");
                }
                else if (folder.Contains("pdfs") && extension != ".pdf")
                {
                    return BadRequest("Invalid file type. Only PDF files are allowed.");
                }

                // Upload the file to Cloudinary
                string url = await _fileService.UploadFileAsync(file, folder);

                _logger.LogInformation("File uploaded successfully: {Url}", url);

                return Ok(new { url });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading file");
                return StatusCode(500, "An error occurred while uploading the file");
            }
        }

        [HttpGet("proxy/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> ProxyFile(Guid id, [FromQuery] string type = "pdf")
        {
            try
            {
                _logger.LogInformation("Proxying file for book ID: {Id}, type: {Type}", id, type);

                if (id == Guid.Empty)
                {
                    _logger.LogWarning("Invalid book ID provided");
                    return BadRequest("Invalid book ID");
                }

                // Get the book to find the file URL
                var bookService = HttpContext.RequestServices.GetRequiredService<IBookService>();
                var bookResult = await bookService.GetById(id, includeProperties: null);

                if (!bookResult.IsSuccess || bookResult.Result == null)
                {
                    _logger.LogWarning("Book not found for ID: {Id}", id);
                    return NotFound("Book not found");
                }

                // Get the appropriate URL based on the type
                string fileUrl = null;
                if (type.ToLower() == "pdf")
                {
                    fileUrl = bookResult.Result.PdfUrl;
                    _logger.LogInformation("PDF URL for book {Id}: {Url}", id, fileUrl);
                }
                else
                {
                    fileUrl = bookResult.Result.ImageUrl;
                    _logger.LogInformation("Image URL for book {Id}: {Url}", id, fileUrl);
                }

                if (string.IsNullOrEmpty(fileUrl))
                {
                    _logger.LogWarning("File URL not found for book ID: {Id}, type: {Type}", id, type);
                    return NotFound($"{type} not found for this book");
                }

                // Generate a signed URL
                string signedUrl = await _fileService.GetSignedUrlAsync(fileUrl);
                _logger.LogInformation("Generated signed URL: {Url}", signedUrl);

                // Redirect to the signed URL
                return Redirect(signedUrl);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error proxying file for book ID: {Id}, type: {Type}", id, type);
                return StatusCode(500, "An error occurred while fetching the file");
            }
        }

        private bool IsValidImageExtension(string extension)
        {
            string[] validExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp" };
            return validExtensions.Contains(extension);
        }
    }
}