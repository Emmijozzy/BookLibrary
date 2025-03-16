using BookLibrary.Server.Application.DTOs;
using BookLibrary.Server.Application.DTOs.Book;
using BookLibrary.Server.Application.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookLibrary.Server.Host.Controllers
{
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    public class BookController(IBookService bookService, ILogger<BookController> logger) : BaseController(logger)
    {
        [HttpPost("add")]
        public async Task<IActionResult> Create(CreateBook book)
        {
            var serviceResult = await bookService.Create(book);

            return serviceResult != null && serviceResult.IsSuccess
                 ? LogAndResponse<Guid>(serviceResult, successStatusCode: StatusCodes.Status201Created)
                 : LogAndResponse<Guid>(serviceResult, failureStatusCode: StatusCodes.Status400BadRequest);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll([FromQuery] GetBooksQuery query)
        {
            var serviceResult = await bookService.GetAll(query);

            return serviceResult != null && serviceResult.IsSuccess
                ? LogAndResponse<IEnumerable<GetBook>>(serviceResult, successStatusCode: StatusCodes.Status200OK)
                : LogAndResponse<IEnumerable<GetBook>>(serviceResult, failureStatusCode: StatusCodes.Status400BadRequest);

        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id, [FromQuery] string IncludeProperties = null!)
        {
            var serviceResult = await bookService.GetById(id, IncludeProperties);

            return serviceResult != null && serviceResult.IsSuccess
               ? LogAndResponse<GetBook>(serviceResult, successStatusCode: StatusCodes.Status200OK)
               : LogAndResponse<GetBook>(serviceResult, failureStatusCode: StatusCodes.Status400BadRequest);
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update(UpdateBook book)
        {
            var serviceResult = await bookService.Update(book);

            return serviceResult != null && serviceResult.IsSuccess
               ? LogAndResponse<bool>(serviceResult, successStatusCode: StatusCodes.Status200OK)
               : LogAndResponse<bool>(serviceResult, failureStatusCode: StatusCodes.Status400BadRequest);

        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var serviceResult = await bookService.Delete(id);

            return serviceResult != null && serviceResult.IsSuccess
               ? LogAndResponse<bool>(serviceResult, successStatusCode: StatusCodes.Status200OK)
               : LogAndResponse<bool>(serviceResult, failureStatusCode: StatusCodes.Status400BadRequest);
        }
    }
}
