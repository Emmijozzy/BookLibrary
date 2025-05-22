using BookLibrary.Server.Application.Common;
using BookLibrary.Server.Application.Interface;
using BookLibrary.Server.Infrastructure.Common.Extension;
using BookLibrary.Server.Infrastructure.Data;
using BookLibrary.Server.Infrastructure.Exceptions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace BookLibrary.Server.Infrastructure.Repository
{
    public class Generic<TEntity>(SimplifiedAspBookProjectContext context, ILogger<Generic<TEntity>> logger)
        : IGenericRepository<TEntity> where TEntity : class
    {
        private readonly DbSet<TEntity> dbSet = context.Set<TEntity>();

        public async Task<RepositoryResult<IEnumerable<TEntity>>> GetAllAsync(
            IEnumerable<Expression<Func<TEntity, bool>>>? filters = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
            int? pageNumber = null,
            int? pageSize = null,
            string? includeProperties = null)
        {
            try
            {
                IQueryable<TEntity> query = dbSet;

                if (filters != null)
                {
                    foreach (var filter in filters)
                    {
                        query = query.Where(filter);
                    }
                }

                if (!string.IsNullOrEmpty(includeProperties))
                {
                    foreach (var includeProperty in includeProperties.Split(',', StringSplitOptions.RemoveEmptyEntries))
                    {
                        query = query.Include(includeProperty.FirstCharToUpper());
                    }
                }

                if (orderBy == null)
                {
                    var entityType = typeof(TEntity);
                    var idProperty = entityType.GetProperty("Id");
                    if (idProperty == null)
                    {
                        throw new EntityIdPropertyNotFoundException(entityType);
                    }

                    query = query.OrderBy(e => EF.Property<object>(e, "Id"));
                }
                else
                {
                    query = orderBy(query);
                }

                if (pageNumber.HasValue && pageSize.HasValue && pageNumber != 0 && pageSize != 0)
                {
                    query = query.Skip((pageNumber.Value - 1) * pageSize.Value).Take(pageSize.Value);
                }

                var entities = await query.ToListAsync();

                return RepositoryResult<IEnumerable<TEntity>>.Success(entities);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Unexpected error retrieving {EntityType}", typeof(TEntity).Name);
                throw new DatabaseOperationException("An error occurred while retrieving data.", ex);
            }
        }

        public async Task<RepositoryResult<Guid>> AddAsync(TEntity entity)
        {
            if (entity == null) throw new ArgumentNullException(nameof(entity), "Entity cannot be null");

            try
            {
                await dbSet.AddAsync(entity);
                await context.SaveChangesAsync();
                return GetEntityId(entity);
            }
            catch (DbUpdateException ex)
            {
                logger.LogError(ex, "Database error adding {EntityType}", typeof(TEntity).Name);
                throw new DatabaseOperationException("A database error occurred while adding the entity.", ex);
            }
        }

        public async Task<RepositoryResult<bool>> DeleteAsync(Guid id)
        {
            try
            {
                var entity = await dbSet.FindAsync(id);
                if (entity == null)
                    throw new KeyNotFoundException($"Entity with ID {id} not found.");

                dbSet.Remove(entity);
                await context.SaveChangesAsync();
                return RepositoryResult<bool>.Success(true);
            }
            catch (KeyNotFoundException ex)
            {
                logger.LogError(ex, "Entity with ID {id} not found", id);
                throw;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Unexpected error deleting {EntityType} with ID {id}", typeof(TEntity).Name, id);
                throw new DatabaseOperationException("An error occurred while deleting the entity.", ex);
            }
        }

        public async Task<RepositoryResult<TEntity>> GetByIdAsync(Guid id, string? includeProperties = null)
        {
            try
            {
                IQueryable<TEntity> query = dbSet;

                if (!string.IsNullOrEmpty(includeProperties))
                {
                    foreach (var includeProperty in includeProperties.Split(',', StringSplitOptions.RemoveEmptyEntries))
                    {
                        query = query.Include(includeProperty.FirstCharToUpper());
                    }
                }

                var entity = await query.FirstOrDefaultAsync(e => EF.Property<Guid>(e, "Id") == id);
                if (entity == null)
                    throw new KeyNotFoundException($"Entity with ID {id} not found.");

                return RepositoryResult<TEntity>.Success(entity);
            }
            catch (KeyNotFoundException ex)
            {
                logger.LogError(ex, "Entity with ID {id} not found", id);
                throw;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error retrieving {EntityType} with ID {id}", typeof(TEntity).Name, id);
                throw new DatabaseOperationException("An error occurred while retrieving the entity.", ex);
            }
        }

        public async Task<RepositoryResult<bool>> UpdateAsync(TEntity entity)
        {
            if (entity == null) throw new ArgumentNullException(nameof(entity), "Entity cannot be null.");

            try
            {
                dbSet.Update(entity);
                await context.SaveChangesAsync();
                return RepositoryResult<bool>.Success(true);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Concurrency conflict updating {EntityType}", typeof(TEntity).Name);
                throw new DatabaseOperationException("A concurrency conflict occurred while updating the entity.", ex);
            }
        }

        private RepositoryResult<Guid> GetEntityId(TEntity entity)
        {
            var entityProperty = entity.GetType().GetProperty("Id");
            if (entityProperty == null)
                throw new EntityIdPropertyNotFoundException(entity.GetType());

            var entityId = (Guid?)entityProperty.GetValue(entity);
            if (!entityId.HasValue)
                throw new InvalidOperationException("Entity 'Id' property is null.");

            return RepositoryResult<Guid>.Success(entityId.Value);
        }

        public async Task<RepositoryResult<int>> CountAsync(IEnumerable<Expression<Func<TEntity, bool>>>? filters = null)
        {
            try
            {
                IQueryable<TEntity> query = dbSet;

                if (filters != null)
                {
                    foreach (var filter in filters)
                    {
                        query = query.Where(filter);
                    }
                }

                return RepositoryResult<int>.Success(await query.CountAsync());
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Unexpected error counting {EntityType}", typeof(TEntity).Name);
                throw new DatabaseOperationException("An error occurred while counting the entities.", ex);
            }
        }

        public async Task<RepositoryResult<bool>> DeleteByPropertyAsync<TProperty>(
            Expression<Func<TEntity, TProperty>> propertySelector,
            TProperty propertyValue)
        {
            try
            {
                // Create a parameter expression for the entity
                var parameter = Expression.Parameter(typeof(TEntity), "e");

                // Get the property from the selector
                var memberExpression = (MemberExpression)propertySelector.Body;
                var property = Expression.Property(parameter, memberExpression.Member.Name);

                // Create an equality comparison
                var constantValue = Expression.Constant(propertyValue, typeof(TProperty));
                var equalExpression = Expression.Equal(property, constantValue);

                // Create a lambda expression for the filter
                var lambda = Expression.Lambda<Func<TEntity, bool>>(equalExpression, parameter);

                // Find all entities matching the filter
                var entities = await dbSet.Where(lambda).ToListAsync();

                if (entities.Any())
                {
                    // Remove all matching entities
                    dbSet.RemoveRange(entities);
                    await context.SaveChangesAsync();
                }

                return RepositoryResult<bool>.Success(true);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Error deleting entities by property {propertySelector}");
                throw new DatabaseOperationException($"An error occurred while deleting entities by property.", ex);
            }
        }
    }
}