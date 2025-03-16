using BookLibrary.Server.Application.Common;
using BookLibrary.Server.Application.DTOs.Auth;
using BookLibrary.Server.Domain.Entities;
using System.Security.Claims;

namespace BookLibrary.Server.Application.Interface
{
    public interface IUserManagement
    {
        Task<RepositoryResult<ApplicationUser>> CreateUser(RegisterUser user);
        Task<RepositoryResult<bool>> loginUser(ApplicationUser user);
        Task<RepositoryResult<ApplicationUser?>> GetUserByEmail(string email);
        Task<RepositoryResult<ApplicationUser?>> GetUserById(string id);
        Task<RepositoryResult<IEnumerable<ApplicationUser>>> GetAllUsers();
        Task<bool> CheckPassword(ApplicationUser user, string password);
        Task<RepositoryResult<string>> RemoveUserByEmail(string email);
        Task<RepositoryResult<List<Claim>>> GetUserClaims(string email);
    }
}
