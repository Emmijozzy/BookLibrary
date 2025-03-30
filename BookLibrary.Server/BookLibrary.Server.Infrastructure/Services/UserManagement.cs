using BookLibrary.Server.Application.Common;
using BookLibrary.Server.Application.DTOs.Auth;
using BookLibrary.Server.Application.Interface;
using BookLibrary.Server.Domain.Entities;
using BookLibrary.Server.Infrastructure.Data;
using BookLibrary.Server.Infrastructure.Exceptions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace BookLibrary.Server.Infrastructure.Services
{
    public class UserManagement(UserManager<ApplicationUser> userManager, AspBookProjectContext context) : IUserManagement
    {
        public async Task<RepositoryResult<ApplicationUser>> CreateUser(RegisterUser user)
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user), "User cannot be null.");

            var existingUser = await userManager.FindByEmailAsync(user.Email);
            if (existingUser != null)
                throw new UserAlreadyExistsException($"User with email {user.Email} already exists.");

            var newUser = new ApplicationUser
            {
                UserName = user.Email,
                Email = user.Email,
                FullName = user.FullName,
            };

            var createResult = await userManager.CreateAsync(newUser, user.Password);
            if (!createResult.Succeeded)
                throw new IdentityException("Failed to create user: " + createResult.Errors.FirstOrDefault()?.Description);

            return RepositoryResult<ApplicationUser>.Success(newUser);
        }

        public async Task<RepositoryResult<IEnumerable<ApplicationUser>>> GetAllUsers()
        {
            var users = await context.Users.ToListAsync();

            return RepositoryResult<IEnumerable<ApplicationUser>>.Success(users);

        }

        public async Task<RepositoryResult<ApplicationUser?>> GetUserByEmail(string email)
        {
            if (String.IsNullOrEmpty(email)) throw new ArgumentException("Email can not be null or empty.");

            var user = await userManager.FindByEmailAsync(email);
            return RepositoryResult<ApplicationUser?>.Success(user);
        }

        public async Task<RepositoryResult<ApplicationUser?>> GetUserById(string id)
        {

            if (String.IsNullOrEmpty(id)) throw new ArgumentException("Id can not be null or empty.");

            var user = await context.Users.FindAsync(id);
            return RepositoryResult<ApplicationUser?>.Success(user);

        }

        public async Task<RepositoryResult<List<Claim>>> GetUserClaims(string email)
        {

            var getUser = await GetUserByEmail(email);
            var user = getUser.Result;
            if (user == null) throw new UserNotFoundException($"User with email {email} not found.");

            List<Claim> claims = new List<Claim>
                {
                    new Claim("FullName", user.FullName),
                    new Claim("Id", user.Id),
                    new Claim(JwtRegisteredClaimNames.Sub, user.Email!)
                };

            return RepositoryResult<List<Claim>>.Success(claims);

        }

        public async Task<RepositoryResult<bool>> loginUser(ApplicationUser user)
        {

            if (user == null) throw new ArgumentNullException(nameof(user), "User cannot be null.");

            var getUser = await GetUserByEmail(user.Email);
            var existingUser = getUser.Result;
            if (existingUser == null) throw new UserNotFoundException($"User with email {user.Email} not found.");

            var result = await userManager.CheckPasswordAsync(existingUser, user.PasswordHash);
            return RepositoryResult<bool>.Success(result);

        }

        public async Task<RepositoryResult<string>> RemoveUserByEmail(string email)
        {

            if (String.IsNullOrEmpty(email)) throw new ArgumentException("Email can not be null or empty.");

            var getUser = await GetUserByEmail(email);
            var user = getUser.Result;
            if (user == null) throw new UserNotFoundException($"User with email {email} not found.");

            var result = await userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                throw new IdentityException("Failed to delete user: " + result.Errors.FirstOrDefault()?.Description);
            }

            return RepositoryResult<string>.Success(user.Id);
        }

        public async Task<bool> CheckPassword(ApplicationUser user, string password)
        {

            if (user == null && password == null) throw new ArgumentNullException(nameof(user), "User and password cannot be null.");

            var result = await userManager.CheckPasswordAsync(user, password);
            return result;
        }
    }
}