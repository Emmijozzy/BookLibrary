using BookLibrary.Server.Application.Interface;
using BookLibrary.Server.Application.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookLibrary.Server.Host.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileController(
        IFileUploadService fileService,
        IBookService bookService,
        ILogger<FileController> logger
    ) : ControllerBase
    {

        [HttpPost("upload")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> UploadFile(IFormFile file, [FromQuery] string folder)
        {
            try
            {
                var FileResult = await fileService.UploadFile(file, folder);
                if (!FileResult.IsSuccess)
                    return BadRequest("File upload failed");

                var url = FileResult.Result;
                logger.LogInformation("File uploaded successfully. URL: {Url}", url);
                return Ok(new { url });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error uploading file");
                return StatusCode(500, "An error occurred while uploading the file");
            }
        }

        [HttpGet("proxy/{id}")]
        public async Task<IActionResult> ProxyFile(Guid id, [FromQuery] string type = "pdf")
        {
            try
            {
                var fileUrlResult = await fileService.GetFileUrl(id, type);

                if (!fileUrlResult.IsSuccess || string.IsNullOrEmpty(fileUrlResult.Result))
                {
                    return BadRequest("File not found");
                }
                // Redirect to the signed URL
                return Redirect(fileUrlResult.Result);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error proxying file for book ID: {Id}, type: {Type}", id, type);
                return StatusCode(500, "An error occurred while fetching the file");
            }
        }
    }
}