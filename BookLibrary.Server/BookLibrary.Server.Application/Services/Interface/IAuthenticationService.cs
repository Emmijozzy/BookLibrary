using BookLibrary.Server.Application.Common;
using BookLibrary.Server.Application.DTOs.Auth;
using BookLibrary.Server.Application.DTOs.User;

namespace BookLibrary.Server.Application.Services.Interface
{
    public interface IAuthenticationService
    {
        Task<ServiceResult<UserDto>> LoginAsync(LoginUser user);
        Task<ServiceResult<UserDto>> RegisterAsync(RegisterUser user);
        Task<ServiceResult<bool>> LogoutAsync(string token);
        Task<ServiceResult<AuthResponseDto>> RefreshTokenAsync(string token);
        Task<ServiceResult<bool>> RequestReset(RequestResetDto requestResetDto);
        Task<ServiceResult<bool>> ResetPassword(ResetPasswordDto resetPasswordDto);
        Task<ServiceResult<bool>> VerifyEmail(VerifyEmailDto verifyEmailDto);
        Task<ServiceResult<bool>> ResendConfirmationEmail(string email);
    }
}
