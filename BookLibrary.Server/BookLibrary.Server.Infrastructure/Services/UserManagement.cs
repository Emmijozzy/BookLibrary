using BookLibrary.Server.Application.Common;
using BookLibrary.Server.Application.DTOs.Auth;
using BookLibrary.Server.Application.Interface;
using BookLibrary.Server.Domain.Entities;
using BookLibrary.Server.Infrastructure.Data;
using BookLibrary.Server.Infrastructure.Exceptions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;
using System.IdentityModel.Tokens.Jwt;
using System.Linq.Expressions;
using System.Security.Claims;

namespace BookLibrary.Server.Infrastructure.Services
{

    public class UserManagement(
        UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager,
        AspBookProjectContext context,
        ILogger<UserManagement> logger
    ) : IUserManagement
    {
        private IDbContextTransaction _transaction;
        public async Task BeginTransactionAsync()
        {
            _transaction = await context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.CommitAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }
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

            var roleResult = await userManager.AddToRoleAsync(newUser, "User");
            if (!roleResult.Succeeded)
                throw new IdentityException("Failed to add user to role: " + roleResult.Errors.FirstOrDefault()?.Description);

            return RepositoryResult<ApplicationUser>.Success(newUser);
        }

        public async Task<RepositoryResult<IEnumerable<ApplicationUser>>> GetAllUsers(
             IEnumerable<Expression<Func<ApplicationUser, bool>>>? filters = null,
            Func<IQueryable<ApplicationUser>, IOrderedQueryable<ApplicationUser>>? orderBy = null,
            int? pageNumber = null,
            int? pageSize = null,
            string? includeProperties = null
            )
        {
            IQueryable<ApplicationUser> query = context.Users;

            // Apply filters
            if (filters != null)
            {
                foreach (var filter in filters)
                {
                    query = query.Where(filter);
                }
            }

            // Include properties
            if (!string.IsNullOrEmpty(includeProperties))
            {
                foreach (var includeProperty in includeProperties.Split(',', StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(includeProperty);
                }
            }

            // Apply ordering
            if (orderBy != null)
            {
                query = orderBy(query);
            }
            else
            {
                // Default ordering by Id
                query = query.OrderBy(u => u.Id);
            }

            // Apply pagination
            if (pageNumber.HasValue && pageSize.HasValue && pageNumber > 0 && pageSize > 0)
            {
                query = query.Skip((pageNumber.Value - 1) * pageSize.Value).Take(pageSize.Value);
            }

            var users = await query.ToListAsync();
            return RepositoryResult<IEnumerable<ApplicationUser>>.Success(users);
        }

        public async Task<RepositoryResult<ApplicationUser?>> GetUserByEmail(string email)
        {
            if (String.IsNullOrEmpty(email)) throw new ArgumentException("Email can not be null or empty.");

            var user = await userManager.FindByEmailAsync(email);
            return RepositoryResult<ApplicationUser?>.Success(user);
        }

        public async Task<RepositoryResult<ApplicationUser?>> GetUserById(string id, string? includeProperties = null)
        {
            IQueryable<ApplicationUser> query = context.Users;

            // Include properties
            if (!string.IsNullOrEmpty(includeProperties))
            {
                foreach (var includeProperty in includeProperties.Split(',', StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(includeProperty);
                }
            }

            // Convert Guid to string for comparison
            var user = await query.FirstOrDefaultAsync(u => u.Id == id.ToString());

            if (user == null) throw new UserNotFoundException($"User with id {id} not found.");

            return RepositoryResult<ApplicationUser?>.Success(user);
        }

        public async Task<RepositoryResult<List<Claim>>> GetUserClaims(string email)
        {
            var getUser = await GetUserByEmail(email);
            var user = getUser.Result;
            if (user == null) throw new UserNotFoundException($"User with email {email} not found.");

            var roles = await userManager.GetRolesAsync(user);

            List<Claim> claims = new List<Claim>
                {
                    new Claim("FullName", user.FullName),
                    new Claim("Id", user.Id),
                    new Claim(JwtRegisteredClaimNames.Sub, user.Email!)
                };

            foreach (var role in roles)
            {
                var roleClaim = new Claim("Roles", role);
                var roleClaimType = new Claim(ClaimTypes.Role, role);
                claims.Add(roleClaim);
                claims.Add(roleClaimType);
            }

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

        public Task<RepositoryResult<List<string>>> GetUserRoles(ApplicationUser user)
        {
            var roles = userManager.GetRolesAsync(user);
            return Task.FromResult(RepositoryResult<List<string>>.Success(roles.Result.ToList()));
        }

        public async Task<RepositoryResult<ApplicationUser>> UpdateUser(ApplicationUser user)
        {
            if (user == null) throw new ArgumentNullException(nameof(user), "User cannot be null.");

            // Find the existing user
            var existingUser = await userManager.FindByIdAsync(user.Id);
            if (existingUser == null)
                return RepositoryResult<ApplicationUser>.Failure("User not found");

            // Check if email is being changed
            if (existingUser.Email != user.Email && !string.IsNullOrEmpty(user.Email))
            {
                // Use UserManager to update email - this handles all the necessary updates
                var emailToken = await userManager.GenerateChangeEmailTokenAsync(existingUser, user.Email);
                var emailResult = await userManager.ChangeEmailAsync(existingUser, user.Email, emailToken);

                if (!emailResult.Succeeded)
                    return RepositoryResult<ApplicationUser>.Failure($"Failed to update email: {string.Join(", ", emailResult.Errors.Select(e => e.Description))}");

                // UserName update if it should match email
                if (existingUser.UserName != user.Email)
                {
                    var usernameResult = await userManager.SetUserNameAsync(existingUser, user.Email);
                    if (!usernameResult.Succeeded)
                        return RepositoryResult<ApplicationUser>.Failure($"Failed to update username: {string.Join(", ", usernameResult.Errors.Select(e => e.Description))}");
                }
            }

            // Save the changes
            var updateResult = await userManager.UpdateAsync(existingUser);
            if (!updateResult.Succeeded)
                return RepositoryResult<ApplicationUser>.Failure($"Failed to update user: {string.Join(", ", updateResult.Errors.Select(e => e.Description))}");

            return RepositoryResult<ApplicationUser>.Success(existingUser);
        }

        //UpdateUserRoles
        public async Task<RepositoryResult<List<string>>> UpdateUserRoles(ApplicationUser user, List<string> roles)
        {
            if (user == null) throw new ArgumentNullException(nameof(user), "User cannot be null.");

            // Find the existing user
            var existingUser = await userManager.FindByIdAsync(user.Id);
            if (existingUser == null)
                return RepositoryResult<List<string>>.Failure("User not found");

            // Remove existing roles
            var currentRoles = await userManager.GetRolesAsync(existingUser);
            var removeResult = await userManager.RemoveFromRolesAsync(existingUser, currentRoles);
            if (!removeResult.Succeeded)
                return RepositoryResult<List<string>>.Failure($"Failed to remove roles: {string.Join(", ", removeResult.Errors.Select(e => e.Description))}");

            // Add new roles
            var addResult = await userManager.AddToRolesAsync(existingUser, roles);
            if (!addResult.Succeeded)
                return RepositoryResult<List<string>>.Failure($"Failed to add roles: {string.Join(", ", addResult.Errors.Select(e => e.Description))}");

            return RepositoryResult<List<string>>.Success(roles);
        }

        public async Task<RepositoryResult<bool>> LockUser(ApplicationUser user)
        {
            if (user == null) throw new ArgumentNullException(nameof(user), "User cannot be null.");

            // Check if user is already locked out
            bool isLockedOut = await userManager.IsLockedOutAsync(user);

            if (isLockedOut)
            {
                // User is already locked out, return success
                return RepositoryResult<bool>.Success(true);
            }

            // First ensure lockout is enabled for this user
            var enableLockoutResult = await userManager.SetLockoutEnabledAsync(user, true);
            if (!enableLockoutResult.Succeeded)
            {
                return RepositoryResult<bool>.Failure($"Failed to enable lockout for user: {string.Join(", ", enableLockoutResult.Errors.Select(e => e.Description))}");
            }

            // Set lockout end date to some future date (e.g., 100 years from now for indefinite lockout)
            var lockoutEndDate = DateTimeOffset.UtcNow.AddYears(100);
            var lockoutResult = await userManager.SetLockoutEndDateAsync(user, lockoutEndDate);

            if (lockoutResult.Succeeded)
            {
                return RepositoryResult<bool>.Success(true);
            }
            else
            {
                return RepositoryResult<bool>.Failure($"Failed to lock user: {string.Join(", ", lockoutResult.Errors.Select(e => e.Description))}");
            }
        }


        public async Task<RepositoryResult<bool>> UnlockUser(ApplicationUser user)
        {
            if (user == null) throw new ArgumentNullException(nameof(user), "User cannot be null.");

            // Check if user is currently locked out
            bool isLockedOut = await userManager.IsLockedOutAsync(user);

            if (!isLockedOut)
            {
                // User is already unlocked, return success
                return RepositoryResult<bool>.Success(true);
            }

            // Reset lockout end date to null (or past date) to unlock the user
            var unlockResult = await userManager.SetLockoutEndDateAsync(user, null);

            if (unlockResult.Succeeded)
            {
                // Reset access failed count to clear any previous failed login attempts
                var resetAccessFailedResult = await userManager.ResetAccessFailedCountAsync(user);

                if (resetAccessFailedResult.Succeeded)
                {
                    return RepositoryResult<bool>.Success(true);
                }
                else
                {
                    return RepositoryResult<bool>.Failure($"User unlocked but failed to reset access failed count: {string.Join(", ", resetAccessFailedResult.Errors.Select(e => e.Description))}");
                }
            }
            else
            {
                return RepositoryResult<bool>.Failure($"Failed to unlock user: {string.Join(", ", unlockResult.Errors.Select(e => e.Description))}");
            }
        }

        public async Task<RepositoryResult<int>> GetTotalCountAsync(List<Expression<Func<ApplicationUser, bool>>> filters = null)
        {

            IQueryable<ApplicationUser> query = context.Users;

            if (filters != null)
            {
                foreach (var filter in filters)
                {
                    query = query.Where(filter);
                }
            }

            int count = await query.CountAsync();
            return RepositoryResult<int>.Success(count);
        }

        public async Task<RepositoryResult<bool>> DeleteUser(ApplicationUser user)
        {
            if (user == null) throw new ArgumentNullException(nameof(user), "User cannot be null.");

            var result = await userManager.DeleteAsync(user);

            return RepositoryResult<bool>.Success(result.Succeeded);
        }

        public async Task<RepositoryResult<bool>> RemoveUserFromRoles(ApplicationUser user, IEnumerable<string> roles)
        {
            try
            {
                var result = await userManager.RemoveFromRolesAsync(user, roles);
                if (!result.Succeeded)
                {
                    return RepositoryResult<bool>.Failure(
                        string.Join(", ", result.Errors.Select(e => e.Description))
                    );
                }
                return RepositoryResult<bool>.Success(true);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error removing user from roles");
                return RepositoryResult<bool>.Failure($"Error removing user from roles: {ex.Message}");
            }
        }

        public async Task<RepositoryResult<bool>> RemoveUserTokens(ApplicationUser user)
        {
            try
            {
                // Get all tokens for the user
                var tokens = await context.UserTokens
                    .Where(t => t.UserId == user.Id)
                    .ToListAsync();

                // Remove all tokens
                context.UserTokens.RemoveRange(tokens);

                // Also remove refresh tokens if you have a separate table
                var refreshTokens = await context.RefreshTokens
                    .Where(t => t.UserId == user.Id)
                    .ToListAsync();

                context.RefreshTokens.RemoveRange(refreshTokens);

                await context.SaveChangesAsync();
                return RepositoryResult<bool>.Success(true);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error removing user tokens");
                return RepositoryResult<bool>.Failure($"Error removing user from roles: {ex.Message}");
            }
        }

        public Task<RepositoryResult<bool>> ConfirmPassword(ApplicationUser user, string currentPassword)
        {
            if (user is null)
                throw new ArgumentNullException(nameof(user), "User cannot be null.");
            if (currentPassword is null)
                throw new ArgumentNullException(nameof(currentPassword), "Current password cannot be null.");

            var result = userManager.CheckPasswordAsync(user, currentPassword);
            return Task.FromResult(RepositoryResult<bool>.Success(result.Result.Equals(true)));
        }
        public Task<RepositoryResult<bool>> UpdatePassword(ApplicationUser user, string currentPassword, string newPassword)
        {
            if (user is null)
                throw new ArgumentNullException(nameof(user), "User cannot be null.");
            if (newPassword is null)
                throw new ArgumentNullException(nameof(newPassword), "New password cannot be null.");

            var result = userManager.ChangePasswordAsync(user, currentPassword, newPassword);
            return Task.FromResult(RepositoryResult<bool>.Success(result.Result.Succeeded));
        }
    }

}
