using AutoMapper;
using BookLibrary.Server.Application.Common;
using BookLibrary.Server.Application.DTOs;
using BookLibrary.Server.Application.DTOs.User;
using BookLibrary.Server.Application.Exceptions;
using BookLibrary.Server.Application.Interface;
using BookLibrary.Server.Application.Services.Interface;
using BookLibrary.Server.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace BookLibrary.Server.Application.Services.Implementation
{
    public class UserService(
        IUserManagement userInterface,
        IGenericRepository<Book> bookRepository,
        IFileUploadService fileService,
        IUserManagement userManagement,
        IMapper mapper,
        ILogger<UserService> logger,
        IHttpContextAccessor httpContextAccessor
        ) : IUserService
    {
        private async Task<(Guid userId, ApplicationUser user)> GetUserEssential()
        {
            var userIdStr = httpContextAccessor.HttpContext?.User?.FindFirst("Id")?.Value;
            logger.LogInformation("User ID: {UserId} at Create Book service", userIdStr);

            if (string.IsNullOrEmpty(userIdStr))
                throw new PermissionDeniedException("Unauthorized: User ID is missing.");

            Guid userId = Guid.TryParse(userIdStr, out Guid userIdGuid) ? userIdGuid : throw new PermissionDeniedException("Unauthorized: User ID is invalid.");

            var (_, user, _) = await userManagement.GetUserById(userIdStr!);
            if (user == null) throw new NotFoundException("User not found", user!.GetType());

            return (userId, user);
        }
        public async Task<ServiceResult<UserDto>> GetUserById(string id, string? includeProperties = null)
        {
            if (string.IsNullOrEmpty(id))
                throw new ArgumentNullException(nameof(id), "User ID is required.");

            //// Try to parse as Guid if possible
            //Guid.TryParse(id, out Guid userId);

            //if (userId == Guid.Empty)
            //    throw new ArgumentException("User ID is invalid.");

            // Use the updated GetUserById method that accepts a Guid
            var userResult = await userInterface.GetUserById(id, "");

            if (!userResult.IsSuccess || userResult.Result == null)
                throw new NotFoundException("User not found", typeof(ApplicationUser));

            var user = mapper.Map<UserDto>(userResult.Result);

            // Get user roles
            var rolesResult = await userInterface.GetUserRoles(userResult.Result);
            if (rolesResult.IsSuccess && rolesResult.Result != null)
            {
                user.Roles = rolesResult.Result;
            }

            return ServiceResult<UserDto>.Success(user, "User fetched successfully");
        }

        public async Task<ServiceResult<ICollection<UserDto>>> GetUsers(GetUsersQuery query)
        {
            // Create filters based on search term if provided
            List<Expression<Func<ApplicationUser, bool>>> filters = new List<Expression<Func<ApplicationUser, bool>>>();

            if (!string.IsNullOrEmpty(query.SearchTerm))
            {
                string searchTermLower = query.SearchTerm.ToLower();
                filters.Add(user =>
                    user.Email!.ToLower().Contains(searchTermLower) ||
                    user.FullName.ToLower().Contains(searchTermLower) ||
                    user.UserName!.ToLower().Contains(searchTermLower)
                );
            }

            if (!string.IsNullOrEmpty(query.status))
            {
                if (query.status.ToLower() == "unlocked")
                {
                    filters.Add(user => user.LockoutEnd == null);
                }
                else if (query.status.ToLower() == "locked")
                {
                    filters.Add(user => user.LockoutEnd != null);
                }
            }

            Func<IQueryable<ApplicationUser>, IOrderedQueryable<ApplicationUser>> orderBy = null!;

            if (!string.IsNullOrEmpty(query.SortBy))
            {
                switch (query.SortBy?.ToLower())
                {
                    case "name":
                        orderBy = q => q.OrderBy(u => u.FullName);
                        break;
                    case "name_desc":
                        orderBy = q => q.OrderByDescending(u => u.FullName);
                        break;
                    case "email":
                        orderBy = q => q.OrderBy(u => u.Email);
                        break;
                    case "email_desc":
                        orderBy = q => q.OrderByDescending(u => u.Email);
                        break;
                    default:
                        orderBy = q => q.OrderBy(u => u.FullName);
                        break;
                }
            }

            // Get users with pagination and filters
            var usersResult = await userInterface.GetAllUsers(
                filters,
                orderBy,
                pageNumber: query.PageNumber,
                pageSize: query.PageSize,
                includeProperties: query.IncludeProperties
            );

            if (!usersResult.IsSuccess || usersResult.Result == null)
                throw new NotFoundException("Users not found", typeof(ApplicationUser));

            var users = mapper.Map<ICollection<UserDto>>(usersResult.Result);

            // Get roles for each user
            var usersWithRoles = new List<UserDto>();

            foreach (var user in users)
            {
                var userResult = await userInterface.GetUserById(user.Id, "");
                if (!userResult.IsSuccess || userResult.Result == null)
                    continue; // Skip this user instead of throwing exception

                var rolesResult = await userInterface.GetUserRoles(userResult.Result);
                if (rolesResult.IsSuccess && rolesResult.Result != null)
                {
                    user.Roles = rolesResult.Result;

                    // Only add users that match the role filter if specified
                    if (string.IsNullOrEmpty(query.Role) ||
                        user.Roles.Contains(query.Role, StringComparer.OrdinalIgnoreCase))
                    {
                        usersWithRoles.Add(user);
                    }
                }
            }

            // Create metadata object with pagination info
            var metadata = new
            {
                TotalCount = usersWithRoles.Count,
                PageSize = query.PageSize,
                TotalPages = (int)Math.Ceiling(usersWithRoles.Count / (double)query.PageSize)
            };

            return ServiceResult<ICollection<UserDto>>.Success(
                usersWithRoles,
                "Users fetched successfully",
                metadata
            );
        }

        public Task<ServiceResult<UserDto>> CreateUser(UserDto user)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<UserDto>> DeleteUser(string id)
        {
            if (string.IsNullOrEmpty(id))
                throw new ArgumentNullException(nameof(id), "User ID is required.");

            // Get the user to ensure it exists and to return in the response
            var userResult = await userInterface.GetUserById(id, "");
            if (!userResult.IsSuccess || userResult.Result == null)
                throw new NotFoundException("User not found", typeof(ApplicationUser));

            var user = userResult.Result;
            var userDto = mapper.Map<UserDto>(user);

            try
            {
                // Begin a unit of work - this should be handled by the repository layer
                await userInterface.BeginTransactionAsync();

                // First, get all books created by this user to handle file deletion
                var booksResult = await bookRepository.GetAllAsync(
                    new List<Expression<Func<Book, bool>>> { b => b.CreatedBy == Guid.Parse(id) }
                );

                if (booksResult.IsSuccess && booksResult.Result != null)
                {
                    // Delete associated files first
                    foreach (var book in booksResult.Result)
                    {
                        // Delete PDF file if exists
                        if (!string.IsNullOrEmpty(book.PdfUrl))
                        {
                            await fileService.DeleteFileAsync(book.PdfUrl);
                        }

                        // Delete image file if exists
                        if (!string.IsNullOrEmpty(book.ImageUrl))
                        {
                            await fileService.DeleteFileAsync(book.ImageUrl);
                        }
                    }
                }

                // Delete all books created by this user
                var deleteResult = await bookRepository.DeleteByPropertyAsync(b => b.CreatedBy, Guid.Parse(id));
                if (!deleteResult.IsSuccess)
                {
                    logger.LogError($"Failed to delete books for user {id}");
                    await userInterface.RollbackTransactionAsync();
                    throw new UserOperationException("Failed to delete user's books");
                }

                // Remove user from all roles
                var userRolesResult = await userInterface.GetUserRoles(user);
                if (userRolesResult.IsSuccess && userRolesResult.Result != null && userRolesResult.Result.Any())
                {
                    var removeRolesResult = await userInterface.RemoveUserFromRoles(user, userRolesResult.Result);
                    if (!removeRolesResult.IsSuccess)
                    {
                        logger.LogError($"Failed to remove user {id} from roles");
                        await userInterface.RollbackTransactionAsync();
                        throw new UserOperationException("Failed to remove user from roles");
                    }
                }

                // Delete user tokens (refresh tokens, etc.)
                var removeTokensResult = await userInterface.RemoveUserTokens(user);
                if (!removeTokensResult.IsSuccess)
                {
                    logger.LogError($"Failed to remove tokens for user {id}");
                    await userInterface.RollbackTransactionAsync();
                    throw new UserOperationException("Failed to remove user tokens");
                }

                //// Then delete the user
                var userDeleteResult = await userInterface.DeleteUser(user);
                if (!userDeleteResult.IsSuccess)
                {
                    await userInterface.RollbackTransactionAsync();
                    throw new UserOperationException($"User deletion failed: {userDeleteResult.ErrorMessage}");
                }


                // Commit the transaction
                await userInterface.CommitTransactionAsync();

                return ServiceResult<UserDto>.Success(userDto, "User and associated data deleted successfully");
            }
            catch (Exception ex)
            {
                // Rollback the transaction on any error
                await userInterface.RollbackTransactionAsync();

                if (ex is UserOperationException || ex is NotFoundException)
                    throw;

                logger.LogError(ex, $"Unexpected error deleting user {id}");
                throw new UserOperationException($"Unexpected error deleting user {id}: {ex.Message}");
            }
        }


        public async Task<ServiceResult<UserDto>> UpdateUser(string id, UpdateUserDto user)
        {
            if (user == null) throw new ArgumentNullException(nameof(user), "User data is required.");

            if (id == null) throw new ArgumentNullException(nameof(id), "User ID is required.");

            var userResult = await userInterface.GetUserById(id, "");
            if (!userResult.IsSuccess || userResult.Result == null)
                throw new NotFoundException("User not found", typeof(ApplicationUser));

            var updatedUser = mapper.Map(user, userResult.Result);

            var updatedUserResult = await userInterface.UpdateUser(updatedUser);
            if (!updatedUserResult.IsSuccess || updatedUserResult.Result == null)
                throw new UserOperationException("User update failed");

            var mappedUser = mapper.Map<UserDto>(updatedUserResult.Result);
            return ServiceResult<UserDto>.Success(mappedUser, "User updated successfully");

        }

        //UpdateUserRoles
        public async Task<ServiceResult<UserDto>> UpdateUserRoles(string id, UpdateUserRolesDto userRoles)
        {
            // Input validation
            if (userRoles == null) throw new ArgumentNullException(nameof(userRoles), "User roles data is required.");
            if (id == null) throw new ArgumentNullException(nameof(id), "User ID is required.");

            // Get user
            var userResult = await userInterface.GetUserById(id, "");
            if (!userResult.IsSuccess || userResult.Result == null)
                throw new NotFoundException("User not found", typeof(ApplicationUser));

            // Update roles
            var userRoleResult = await userInterface.UpdateUserRoles(userResult.Result, userRoles.Roles);
            if (!userRoleResult.IsSuccess)
                throw new UserOperationException($"User roles update failed: {userRoleResult.ErrorMessage}");

            // Map to DTO
            var mappedUser = mapper.Map<UserDto>(userResult.Result);
            mappedUser.Roles = userRoleResult.Result!;

            return ServiceResult<UserDto>.Success(mappedUser, "User roles updated successfully");
        }

        public async Task<ServiceResult<bool>> LockUser(string id)
        {
            if (string.IsNullOrEmpty(id))
                throw new ArgumentNullException(nameof(id), "User ID is required.");

            var userResult = await userInterface.GetUserById(id, "");
            if (!userResult.IsSuccess || userResult.Result == null)
                throw new NotFoundException("User not found", typeof(ApplicationUser));

            var lockedUserResult = await userInterface.LockUser(userResult.Result);
            if (!lockedUserResult.IsSuccess)
                throw new UserOperationException($"User lock failed: {lockedUserResult.ErrorMessage}");

            return ServiceResult<bool>.Success(true, "User locked successfully");
        }

        public async Task<ServiceResult<bool>> UnlockUser(string id)
        {
            if (string.IsNullOrEmpty(id))
                throw new ArgumentNullException(nameof(id), "User ID is required.");

            var userResult = await userInterface.GetUserById(id, "");
            if (!userResult.IsSuccess || userResult.Result == null)
                throw new NotFoundException("User not found", typeof(ApplicationUser));

            var unlockedUserResult = await userInterface.UnlockUser(userResult.Result);
            if (!unlockedUserResult.IsSuccess)
                throw new UserOperationException($"User unlock failed: {unlockedUserResult.ErrorMessage}");

            return ServiceResult<bool>.Success(true, "User unlocked successfully");
        }

        public async Task<ServiceResult<UserDto>> GetProfile()
        {
            var (userId, user) = await GetUserEssential();

            var userDto = mapper.Map<UserDto>(user);

            var userRolesResult = await userInterface.GetUserRoles(user);

            if (userRolesResult.IsSuccess && userRolesResult.Result != null)
            {
                userDto.Roles = userRolesResult.Result;
            }
            return ServiceResult<UserDto>.Success(userDto, "Profile fetched successfully");
        }

        public async Task<ServiceResult<UserDto>> UpdateProfile(UpdateUserDto userDto)
        {
            var (userId, user) = await GetUserEssential();

            var userResult = await userInterface.GetUserById(userId.ToString(), "");
            if (!userResult.IsSuccess || userResult.Result == null)
                throw new NotFoundException("User not found", typeof(ApplicationUser));

            var updatedUser = mapper.Map(userDto, userResult.Result);

            var updatedUserResult = await userInterface.UpdateUser(updatedUser);
            if (!updatedUserResult.IsSuccess || updatedUserResult.Result == null)
                throw new UserOperationException("User update failed");

            var mappedUser = mapper.Map<UserDto>(updatedUserResult.Result);
            return ServiceResult<UserDto>.Success(mappedUser, "User updated successfully");
        }
        public async Task<ServiceResult<bool>> UpdatePassword(UpdatePasswordDto passwordDto)
        {
            var (userId, user) = await GetUserEssential();

            var userResult = await userInterface.GetUserById(userId.ToString(), "");
            if (!userResult.IsSuccess || userResult.Result == null)
                throw new NotFoundException("User not found", typeof(ApplicationUser));

            var confirmPasswordResult = await userInterface.ConfirmPassword(user, passwordDto.CurrentPassword);
            if (!confirmPasswordResult.IsSuccess || !confirmPasswordResult.Result)
                throw new UserOperationException("Wrong password.");

            var updateResult = await userInterface.UpdatePassword(userResult.Result, passwordDto.CurrentPassword, passwordDto.NewPassword);
            if (!updateResult.IsSuccess)
                throw new UserOperationException("Password update failed");

            return ServiceResult<bool>.Success(true, "Password updated successfully");
        }

        public async Task<ServiceResult<UserDto>> DeleteProfile(DeleteAccountDto deleteAccountDto)
        {
            var (userId, user) = GetUserEssential().Result;

            if (deleteAccountDto.Password == null)
                throw new ArgumentNullException(nameof(deleteAccountDto.Password), "Password is required.");

            if (deleteAccountDto.ConfirmText != "DELETE")
                throw new ArgumentNullException(nameof(deleteAccountDto.ConfirmText), "DELETE action is required.");

            var confirmPasswordResult = await userInterface.ConfirmPassword(user, deleteAccountDto.Password);
            if (!confirmPasswordResult.IsSuccess || !confirmPasswordResult.Result)
                throw new UserOperationException("Wrong password.");
            return await DeleteUser(userId.ToString());
        }
    }
}
