using BookLibrary.Server.Application.Common;
using System.Linq.Expressions;

namespace BookLibrary.Server.Application.Interface
{
    public interface IGenericRepository<TEntity> where TEntity : class
    {
        public Task<RepositoryResult<IEnumerable<TEntity>>> GetAllAsync(
            IEnumerable<Expression<Func<TEntity, bool>>>? filters = null!,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null!,
            int? pageNumber = null!,
            int? pageSize = null!,
            string? includeProperties = null
            );
        public Task<RepositoryResult<TEntity>> GetByIdAsync(Guid id, string? includeProperties = null);
        public Task<RepositoryResult<Guid>> AddAsync(TEntity entity);
        public Task<RepositoryResult<bool>> UpdateAsync(TEntity entity);
        public Task<RepositoryResult<bool>> DeleteAsync(Guid id);
    }
}