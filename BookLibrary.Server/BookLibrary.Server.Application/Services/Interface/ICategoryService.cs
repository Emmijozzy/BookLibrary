using BookLibrary.Server.Application.Common;
using BookLibrary.Server.Application.DTOs.Category;

namespace BookLibrary.Server.Application.Services.Interface
{
    public interface ICategoryService
    {
        Task<ServiceResult<Guid>> Create(CreateCategory book);
        Task<ServiceResult<IEnumerable<GetCategory>>> GetAll(int? pageNumber, int? Pagesize, string includeProperties);
        Task<ServiceResult<IEnumerable<GetCategory>>> GetAllWithUserBooks(int? pageNumber, int? pageSize);
        Task<ServiceResult<IEnumerable<GetCategory>>> GetAllWithUsersBooks(int? pageNumber, int? pageSize);
        Task<ServiceResult<IEnumerable<GetCategory>>> GetAllWithUsersPublicBooks(int? pageNumber, int? pageSize);
        Task<ServiceResult<GetCategory>> GetById(Guid id, string? includeProperties);
        Task<ServiceResult<GetCategory>> GetByIdWithUserBooks(Guid id);
        Task<ServiceResult<GetCategory>> GetByIdWithUsersPublicBooks(Guid id);
        Task<ServiceResult<bool>> Update(UpdateCategory category);
        Task<ServiceResult<bool>> Delete(Guid id);
    }
}
