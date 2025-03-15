using BookLibrary.Server.Application.Common;
using BookLibrary.Server.Application.DTOs.Category;

namespace BookLibrary.Server.Application.Services.Interface
{
    public interface ICategoryService
    {
        Task<ServiceResult<Guid>> Create(CreateCategory book);
        Task<ServiceResult<IEnumerable<GetCategory>>> GetAll(int? pageNumber, int? Pagesize, string includeProperties);
        Task<ServiceResult<GetCategory>> GetById(Guid id, string? includeProperties);
        Task<ServiceResult<bool>> Update(UpdateCategory category);
        Task<ServiceResult<bool>> Delete(Guid id);
    }
}
