using BookLibrary.Server.Application.Common;
using BookLibrary.Server.Application.DTOs;
using BookLibrary.Server.Application.DTOs.Book;
using Microsoft.AspNetCore.Http;

namespace BookLibrary.Server.Application.Services.Interface
{
    public interface IBookService
    {
        Task<ServiceResult<IEnumerable<GetBook>>> GetBooks(GetBooksQuery query);
        Task<ServiceResult<IEnumerable<GetBook>>> GetAllUsersPublicBooks(GetBooksQuery query);
        Task<ServiceResult<IEnumerable<GetBook>>> GetAllUserBooks(Guid userId, GetBooksQuery query);
        Task<ServiceResult<Guid>> Create(CreateBook book);
        Task<ServiceResult<GetBook>> GetById(Guid id, string? includeProperties);
        Task<ServiceResult<bool>> Update(UpdateBook book);
        Task<ServiceResult<bool>> Delete(Guid id);
    }
}
