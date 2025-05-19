using BookLibrary.Server.Application.DTOs;
using BookLibrary.Server.Application.DTOs.User;
using BookLibrary.Server.Application.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookLibrary.Server.Host.Controllers
{
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    public class UserController(IUserService userService, ILogger<UserController> logger) : BaseController(logger)
    {
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll([FromQuery] GetUsersQuery query)
        {
            var serviceResult = await userService.GetUsers(query);
            return serviceResult != null && serviceResult.IsSuccess
               ? LogAndResponse<ICollection<UserDto>>(serviceResult, successStatusCode: StatusCodes.Status200OK)
               : LogAndResponse<ICollection<UserDto>>(serviceResult!, failureStatusCode: StatusCodes.Status400BadRequest);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id, [FromQuery] string? includeProperties = null)
        {
            var serviceResult = await userService.GetUserById(id, includeProperties);
            return serviceResult != null && serviceResult.IsSuccess
               ? LogAndResponse<UserDto>(serviceResult, successStatusCode: StatusCodes.Status200OK)
               : LogAndResponse<UserDto>(serviceResult!, failureStatusCode: StatusCodes.Status400BadRequest);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateById(string id, UpdateUserDto user)
        {
            var serviceResult = await userService.UpdateUser(id, user);
            return serviceResult != null && serviceResult.IsSuccess
               ? LogAndResponse<UserDto>(serviceResult, successStatusCode: StatusCodes.Status200OK)
               : LogAndResponse<UserDto>(serviceResult!, failureStatusCode: StatusCodes.Status400BadRequest);
        }

        [HttpPut("{id}/roles")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateUserRoles(string id, UpdateUserRolesDto userRoles)
        {
            var serviceResult = await userService.UpdateUserRoles(id, userRoles);
            return serviceResult != null && serviceResult.IsSuccess
               ? LogAndResponse<UserDto>(serviceResult, successStatusCode: StatusCodes.Status200OK)
               : LogAndResponse<UserDto>(serviceResult!, failureStatusCode: StatusCodes.Status400BadRequest);
        }

        [HttpPut("{id}/lock")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> LockUser(string id)
        {
            var serviceResult = await userService.LockUser(id);
            return serviceResult != null && serviceResult.IsSuccess
               ? LogAndResponse<bool>(serviceResult, successStatusCode: StatusCodes.Status200OK)
               : LogAndResponse<bool>(serviceResult!, failureStatusCode: StatusCodes.Status400BadRequest);
        }

        [HttpPut("{id}/unlock")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UnlockUser(string id)
        {
            var serviceResult = await userService.UnlockUser(id);
            return serviceResult != null && serviceResult.IsSuccess
               ? LogAndResponse<bool>(serviceResult, successStatusCode: StatusCodes.Status200OK)
               : LogAndResponse<bool>(serviceResult!, failureStatusCode: StatusCodes.Status400BadRequest);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var serviceResult = await userService.DeleteUser(id);
            return serviceResult != null && serviceResult.IsSuccess
               ? LogAndResponse<UserDto>(serviceResult, successStatusCode: StatusCodes.Status200OK)
               : LogAndResponse<UserDto>(serviceResult!, failureStatusCode: StatusCodes.Status400BadRequest);
        }
        //profile

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var serviceResult = await userService.GetProfile();
            return serviceResult != null && serviceResult.IsSuccess
               ? LogAndResponse<UserDto>(serviceResult, successStatusCode: StatusCodes.Status200OK)
               : LogAndResponse<UserDto>(serviceResult!, failureStatusCode: StatusCodes.Status400BadRequest);
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromForm] UpdateUserDto user)
        {
            var serviceResult = await userService.UpdateProfile(user);
            return serviceResult != null && serviceResult.IsSuccess
               ? LogAndResponse<UserDto>(serviceResult, successStatusCode: StatusCodes.Status200OK)
               : LogAndResponse<UserDto>(serviceResult!, failureStatusCode: StatusCodes.Status400BadRequest);
        }

        [HttpPut("profile/change-password")]
        public async Task<IActionResult> UpdatePassword([FromForm] UpdatePasswordDto user)
        {
            var serviceResult = await userService.UpdatePassword(user);
            return serviceResult != null && serviceResult.IsSuccess
               ? LogAndResponse<bool>(serviceResult, successStatusCode: StatusCodes.Status200OK)
               : LogAndResponse<bool>(serviceResult!, failureStatusCode: StatusCodes.Status400BadRequest);
        }

        //user deleting their account themselfe

        [HttpDelete("profile")]
        public async Task<IActionResult> DeleteProfile([FromForm] DeleteAccountDto deleteAccountDto)
        {
            var serviceResult = await userService.DeleteProfile(deleteAccountDto);
            return serviceResult != null && serviceResult.IsSuccess
               ? LogAndResponse<UserDto>(serviceResult, successStatusCode: StatusCodes.Status200OK)
               : LogAndResponse<UserDto>(serviceResult!, failureStatusCode: StatusCodes.Status400BadRequest);
        }

    }

}
