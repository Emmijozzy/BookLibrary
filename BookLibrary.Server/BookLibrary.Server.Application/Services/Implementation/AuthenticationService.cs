using AutoMapper;
using BookLibrary.Server.Application.Common;
using BookLibrary.Server.Application.DTOs.Auth;
using BookLibrary.Server.Application.DTOs.User;
using BookLibrary.Server.Application.Exceptions;
using BookLibrary.Server.Application.Interface;
using BookLibrary.Server.Application.Services.Interface;
using FluentValidation;
using System.Security.Claims;

namespace BookLibrary.Server.Application.Services.Implementation
{
    public class AuthenticationService(
        IUserManagement userManagement,
        ITokenManagement tokenManagement,
        IValidationService validationService,
        IValidator<RegisterUser> RegisterValidation,
        IValidator<LoginUser> LoginUserValidator,
        IMapper mapper,
        IClientIpAccessor clientIpAccessor
        ) : IAuthenticationService
    {
        public async Task<ServiceResult<UserDto>> RegisterAsync(RegisterUser user)
        {
            if (user == null) throw new ArgumentNullException(nameof(user), "User data is required.");

            var validationResult = await validationService.validateAsync<RegisterUser>(user, RegisterValidation);

            if (!validationResult.IsSuccess)
            {
                return ServiceResult<UserDto>.Failure(validationResult.Message, validationResult.Errors!);
            }

            var (isSuccess, result, errorMsg) = await userManagement.CreateUser(user);

            if (!isSuccess)
            {
                throw new UserCreationException(errorMsg!); // Throw a specific exception
            }

            var mappedUser = mapper.Map<UserDto>(result);
            return ServiceResult<UserDto>.Success(mappedUser, "User created successfully.");
        }


        public async Task<ServiceResult<UserDto>> LoginAsync(LoginUser user)
        {
            if (user == null) throw new ArgumentNullException(nameof(user), "User data is required.");

            var (isSuccess, result, message, metadata, errors) = await validationService.validateAsync<LoginUser>(user, LoginUserValidator);
            if (!isSuccess) return ServiceResult<UserDto>.Failure(message!, errors!);

            var (success, userFromDb, errorMsg) = await userManagement.GetUserByEmail(user.Email);
            if (!success || userFromDb == null) throw new NotFoundException($"User with email '{user.Email}' not found.", user.GetType());

            var passwordCheck = await userManagement.CheckPassword(userFromDb, user.Password);
            if (!passwordCheck) throw new InvalidPasswordException("Invalid password.");

            var userClaimResult = await userManagement.GetUserClaims(userFromDb!.Email!);
            if (!userClaimResult.IsSuccess) throw new UserClaimException("Error while retrieving user claims.");

            List<Claim> claims = userClaimResult.Result!;
            var accessToken = tokenManagement.GenerateToken(claims);
            var refreshToken = tokenManagement.GenerateSignedRefreshToken(userFromDb.Id);

            var clientIp = clientIpAccessor.GetClientIp();
            var refreshTokenIsAdded = await tokenManagement.AddRefreshToken(refreshToken, userFromDb.Id, clientIp);
            if (!refreshTokenIsAdded.IsSuccess) throw new TokenGenerationException("Error while adding refresh token.");

            return ServiceResult<UserDto>.Success(new UserDto
            {
                Email = userFromDb!.Email!,
                FullName = userFromDb.FullName,
                Id = userFromDb.Id,
                isAuthenticated = true,
            }, "Login successfully", new { accessToken });
        }

        public async Task<ServiceResult<bool>> LogoutAsync(string token)
        {
            if (string.IsNullOrWhiteSpace(token)) throw new ArgumentNullException(nameof(token), "Token is required.");

            ClaimsPrincipal principalClaims = tokenManagement.GetPrincipalFromExpiredToken(token);
            var userIdClaim = principalClaims.Claims.FirstOrDefault(c => c.Type == "Id");

            // Console.WriteLine("User ID Claim: " + userIdClaim.Value);

            if (userIdClaim == null || string.IsNullOrWhiteSpace(userIdClaim.Value))
                throw new InvalidTokenException("Invalid token: User ID is missing.");

            var result = await tokenManagement.RemoveRefreshToken(userIdClaim.Value);
            if (!result.IsSuccess) throw new TokenOperationException("Error while trying to remove refresh token.");

            return ServiceResult<bool>.Success(true, "Logged out successfully", new { accessToken = "" });
        }


        public async Task<ServiceResult<AuthResponseDto>> RefreshTokenAsync(string token)
        {
            if (string.IsNullOrEmpty(token)) throw new ArgumentNullException(nameof(token), "Token is required.");

            ClaimsPrincipal claimsPrincipal = tokenManagement.GetPrincipalFromExpiredToken(token);
            var userId = claimsPrincipal.Claims.First(c => c.Type == "Id").Value;
            if (string.IsNullOrEmpty(userId))
                throw new InvalidTokenException("Invalid token: User ID is missing.");

            var (isSuccess, refreshToken, errorMsg) = await tokenManagement.GetRefreshToken(userId);
            if (!isSuccess || refreshToken == null) throw new UnauthorizedAccessException("Unauthorized: Invalid or missing token.");

            if (!refreshToken!.IsActive) throw new UnauthorizedAccessException("Refresh token is inactive");

            var currentClientIp = clientIpAccessor.GetClientIp();

            if (refreshToken.CreatedByIp != currentClientIp!)
            {
                refreshToken.RevokedByIp = currentClientIp;
                var result = await tokenManagement.UpdateRefreshToken(refreshToken);
                if (!result.IsSuccess) throw new TokenOperationException("Error revoking refresh token on new device.");
                throw new UnauthorizedAccessException("Unauthorized: New device detected. Kindly login again.");
            }

            var refreshTokenIsValid = await tokenManagement.ValidateRefreshToken(refreshToken.Token, out string refreshUserId);
            if (!refreshTokenIsValid.IsSuccess && !refreshTokenIsValid.Result) throw new UnauthorizedAccessException("Access denied, invalid or expired refresh token");

            var (success, fetchedUser, errMsg) = await userManagement.GetUserById(refreshUserId);
            if (!success && fetchedUser == null) throw new NotFoundException("User not found", fetchedUser.GetType());

            var claims = await userManagement.GetUserClaims(fetchedUser!.Email);
            if (!claims.IsSuccess) throw new UserClaimException("Error while trying to get user claims");

            var newAccessToken = tokenManagement.GenerateToken(claims.Result!);
            var newRefreshToken = tokenManagement.GenerateSignedRefreshToken(refreshUserId);

            var newTokenResult = await tokenManagement.AddRefreshToken(newRefreshToken, refreshUserId, currentClientIp);
            if (!newTokenResult.IsSuccess) throw new TokenOperationException("Error while trying to add new refresh token");

            return ServiceResult<AuthResponseDto>.Success(new AuthResponseDto
            {
                AccessToken = newAccessToken,
            }, "Token Refreshed Successfully", new { accessToken = newAccessToken });

        }

    }
}
