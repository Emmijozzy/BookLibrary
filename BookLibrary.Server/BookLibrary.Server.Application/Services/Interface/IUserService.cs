using BookLibrary.Server.Application.Common;
using BookLibrary.Server.Application.DTOs;
using BookLibrary.Server.Application.DTOs.User;

namespace BookLibrary.Server.Application.Services.Interface
{
    public interface IUserService
    {
        Task<ServiceResult<ICollection<UserDto>>> GetUsers(GetUsersQuery query);
        Task<ServiceResult<UserDto>> GetUserById(string id, string? includeProperties = null);
        Task<ServiceResult<UserDto>> CreateUser(UserDto user);
        Task<ServiceResult<UserDto>> DeleteUser(string id);
        Task<ServiceResult<UserDto>> UpdateUser(string id, UpdateUserDto user);
        Task<ServiceResult<UserDto>> UpdateUserRoles(string id, UpdateUserRolesDto roles);
        Task<ServiceResult<bool>> LockUser(string id);
        Task<ServiceResult<bool>> UnlockUser(string id);
        Task<ServiceResult<UserDto>> GetProfile();
        Task<ServiceResult<UserDto>> UpdateProfile(UpdateUserDto user);
        Task<ServiceResult<bool>> UpdatePassword(UpdatePasswordDto password);
        Task<ServiceResult<UserDto>> DeleteProfile(DeleteAccountDto deleteAccountDto);
    }
}
