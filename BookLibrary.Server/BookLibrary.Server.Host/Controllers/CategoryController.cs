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
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll([FromQuery] int pageNumber, int pageSize, string? includeProperties = null)
        {
            var serviceResult = await categoryService.GetAll(pageNumber, pageSize, includeProperties);
            return serviceResult != null && serviceResult.IsSuccess
               ? LogAndResponse<IEnumerable<GetCategory>>(serviceResult, successStatusCode: StatusCodes.Status200OK)
               : LogAndResponse<IEnumerable<GetCategory>>(serviceResult, failureStatusCode: StatusCodes.Status400BadRequest);
        }

        [HttpGet("all-with-user-books")]
        public async Task<IActionResult> GetAllWithUserBooks(int pageNumber, int pageSize)
        {
            var serviceResult = await categoryService.GetAllWithUserBooks(pageNumber, pageSize);
            return serviceResult != null && serviceResult.IsSuccess
               ? LogAndResponse<IEnumerable<GetCategory>>(serviceResult, successStatusCode: StatusCodes.Status200OK)
               : LogAndResponse<IEnumerable<GetCategory>>(serviceResult, failureStatusCode: StatusCodes.Status400BadRequest);
        }

        [HttpGet("all-with-users-books")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllWithUsersBooks(int pageNumber, int pageSize)
        {
            var serviceResult = await categoryService.GetAllWithUsersBooks(pageNumber, pageSize);
            return serviceResult != null && serviceResult.IsSuccess
               ? LogAndResponse<IEnumerable<GetCategory>>(serviceResult, successStatusCode: StatusCodes.Status200OK)
               : LogAndResponse<IEnumerable<GetCategory>>(serviceResult, failureStatusCode: StatusCodes.Status400BadRequest);
        }

        [HttpGet("all-with-users-public-books")]
        public async Task<IActionResult> GetAllWithUsersPublicBooks(int pageNumber, int pageSize)
        {
            var serviceResult = await categoryService.GetAllWithUsersPublicBooks(pageNumber, pageSize);
            return serviceResult != null && serviceResult.IsSuccess
               ? LogAndResponse<IEnumerable<GetCategory>>(serviceResult, successStatusCode: StatusCodes.Status200OK)
               : LogAndResponse<IEnumerable<GetCategory>>(serviceResult, failureStatusCode: StatusCodes.Status400BadRequest);
        }


        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Get(Guid id, [FromQuery] string? includeProperties = null)
        {
            var serviceResult = await categoryService.GetById(id, includeProperties);
            return serviceResult != null && serviceResult.IsSuccess
                ? LogAndResponse<GetCategory>(serviceResult, successStatusCode: StatusCodes.Status200OK)
                : LogAndResponse<GetCategory>(serviceResult, failureStatusCode: StatusCodes.Status400BadRequest);
        }

        [HttpGet("{id}/user-books")]
        public async Task<IActionResult> GetWithUserBooks(Guid userId_Books, Guid id, [FromQuery] string? includeProperties = null)
        {
            var serviceResult = await categoryService.GetByIdWithUserBooks(id);
            return serviceResult != null && serviceResult.IsSuccess
                ? LogAndResponse<GetCategory>(serviceResult, successStatusCode: StatusCodes.Status200OK)
                : LogAndResponse<GetCategory>(serviceResult, failureStatusCode: StatusCodes.Status400BadRequest);
        }

        [HttpGet("{id}/users-public-books")]
        public async Task<IActionResult> GetByIdWithUsersPublicBooks(Guid userId_Books, Guid id, [FromQuery] string? includeProperties = null)
        {
            var serviceResult = await categoryService.GetByIdWithUsersPublicBooks(id);
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
