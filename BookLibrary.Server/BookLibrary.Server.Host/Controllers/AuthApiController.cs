
using BookLibrary.Server.Application.DTOs.Auth;
using BookLibrary.Server.Application.DTOs.User;
using BookLibrary.Server.Application.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace BookLibrary.Server.Host.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthApiController(IAuthenticationService authenticationService, ILogger<AuthApiController> logger) : BaseController(logger)
    {
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginUser loginRequest)
        {
            logger.LogInformation("Received Login Request: {@loginRequest}", loginRequest);
            var serviceResult = await authenticationService.LoginAsync(loginRequest);

            return serviceResult != null && serviceResult.IsSuccess
                 ? LogAndResponse<UserDto>(serviceResult, successStatusCode: StatusCodes.Status200OK)
                 : LogAndResponse<UserDto>(serviceResult, failureStatusCode: StatusCodes.Status400BadRequest);
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterUser registerRequest)
        {
            var serviceResult = await authenticationService.RegisterAsync(registerRequest);

            return serviceResult != null && serviceResult.IsSuccess
                 ? LogAndResponse<UserDto>(serviceResult, successStatusCode: StatusCodes.Status201Created)
                 : LogAndResponse<UserDto>(serviceResult, failureStatusCode: StatusCodes.Status400BadRequest);
        }

        [HttpPost("Logout")]
        public async Task<IActionResult> Logout()
        {
            Request.Cookies.TryGetValue("access_token", out var accessToken);

            var serviceResult = await authenticationService.LogoutAsync(accessToken);
            return serviceResult != null && serviceResult.IsSuccess
                ? LogAndResponse<bool>(serviceResult, successStatusCode: StatusCodes.Status200OK)
                : LogAndResponse<bool>(serviceResult, failureStatusCode: StatusCodes.Status400BadRequest);
        }

        [HttpPost("RefreshToken")]
        public async Task<IActionResult> RefreshToken()
        {
            Request.Cookies.TryGetValue("access_token", out var accessToken);
            Console.WriteLine($"Access Token: {accessToken} as refreshtoken");
            var serviceResult = await authenticationService.RefreshTokenAsync(accessToken);
            return serviceResult != null && serviceResult.IsSuccess
                ? LogAndResponse<AuthResponseDto>(serviceResult, successStatusCode: StatusCodes.Status200OK)
                : LogAndResponse<AuthResponseDto>(serviceResult, failureStatusCode: StatusCodes.Status400BadRequest);
        }
    }
}
