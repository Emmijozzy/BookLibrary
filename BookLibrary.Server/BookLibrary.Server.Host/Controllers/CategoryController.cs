using BookLibrary.Server.Application.DTOs.Category;
using BookLibrary.Server.Application.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookLibrary.Server.Host.Controllers
{
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    public class CategoryController(ICategoryService categoryService, ILogger<CategoryController> logger) : BaseController(logger)
    {
        [HttpPost("add")]
        public async Task<IActionResult> Create(CreateCategory category)
        {
            var serviceResult = await categoryService.Create(category);
            return serviceResult != null && serviceResult.IsSuccess
                ? LogAndResponse<Guid>(serviceResult, successStatusCode: StatusCodes.Status201Created)
                : LogAndResponse<Guid>(serviceResult, failureStatusCode: StatusCodes.Status400BadRequest);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll([FromQuery] int pageNumber, int pageSize, string? includeProperties = null)
        {
            var serviceResult = await categoryService.GetAll(pageNumber, pageSize, includeProperties);
            return serviceResult != null && serviceResult.IsSuccess
               ? LogAndResponse<IEnumerable<GetCategory>>(serviceResult, successStatusCode: StatusCodes.Status200OK)
               : LogAndResponse<IEnumerable<GetCategory>>(serviceResult, failureStatusCode: StatusCodes.Status400BadRequest);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id, [FromQuery] string? includeProperties = null)
        {
            var serviceResult = await categoryService.GetById(id, includeProperties);
            return serviceResult != null && serviceResult.IsSuccess
                ? LogAndResponse<GetCategory>(serviceResult, successStatusCode: StatusCodes.Status200OK)
                : LogAndResponse<GetCategory>(serviceResult, failureStatusCode: StatusCodes.Status400BadRequest);
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update(UpdateCategory category)
        {
            var serviceResult = await categoryService.Update(category);
            return serviceResult != null && serviceResult.IsSuccess
              ? LogAndResponse<bool>(serviceResult, successStatusCode: StatusCodes.Status200OK)
              : LogAndResponse<bool>(serviceResult, failureStatusCode: StatusCodes.Status400BadRequest);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var serviceResult = await categoryService.Delete(id);

            return serviceResult != null && serviceResult.IsSuccess
              ? LogAndResponse<bool>(serviceResult, successStatusCode: StatusCodes.Status200OK)
              : LogAndResponse<bool>(serviceResult, failureStatusCode: StatusCodes.Status400BadRequest);
        }
    }
}
