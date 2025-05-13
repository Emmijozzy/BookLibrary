using BookLibrary.Server.Application.Common;
using BookLibrary.Server.Application.DTOs.Auth;
using BookLibrary.Server.Domain.Entities;
using System.Linq.Expressions;
using System.Security.Claims;

namespace BookLibrary.Server.Application.Interface
{
    public interface IUserManagement
    {
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
        Task<RepositoryResult<ApplicationUser>> CreateUser(RegisterUser user);
        Task<RepositoryResult<bool>> loginUser(ApplicationUser user);
        Task<RepositoryResult<ApplicationUser?>> GetUserByEmail(string email);
        Task<RepositoryResult<ApplicationUser?>> GetUserById(string id, string? includeProperties = null);
        Task<RepositoryResult<IEnumerable<ApplicationUser>>> GetAllUsers(
            IEnumerable<Expression<Func<ApplicationUser, bool>>>? filters = null,
            Func<IQueryable<ApplicationUser>, IOrderedQueryable<ApplicationUser>>? orderBy = null,
            int? pageNumber = null,
            int? pageSize = null,
            string? includeProperties = null);
        Task<bool> CheckPassword(ApplicationUser user, string password);
        Task<RepositoryResult<string>> RemoveUserByEmail(string email);
        Task<RepositoryResult<List<Claim>>> GetUserClaims(string email);
        Task<RepositoryResult<List<string>>> GetUserRoles(ApplicationUser user);
        Task<RepositoryResult<ApplicationUser>> UpdateUser(ApplicationUser user);
        Task<RepositoryResult<List<string>>> UpdateUserRoles(ApplicationUser user, List<string> roles);
        Task<RepositoryResult<bool>> LockUser(ApplicationUser user);
        Task<RepositoryResult<bool>> UnlockUser(ApplicationUser user);
        Task<RepositoryResult<int>> GetTotalCountAsync(List<Expression<Func<ApplicationUser, bool>>> filters = null);
        Task<RepositoryResult<bool>> DeleteUser(ApplicationUser user);
        Task<RepositoryResult<bool>> RemoveUserFromRoles(ApplicationUser user, IEnumerable<string> roles);
        Task<RepositoryResult<bool>> RemoveUserTokens(ApplicationUser user);
        Task<RepositoryResult<bool>> ConfirmPassword(ApplicationUser user, string currentPassword);
        Task<RepositoryResult<bool>> UpdatePassword(ApplicationUser user, string currentPassword, string newPassword);
    }
}
