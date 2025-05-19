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
        IEmailService emailService,
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

            if (result is null) throw new UserCreationException("User creation failed.");

            var tokenResult = await tokenManagement.GenerateEmailConfirmationToken(result);
            if (!tokenResult.IsSuccess && string.IsNullOrWhiteSpace(tokenResult.Result)) throw new UserCreationException("Error while generating email confirmation token.");

            var emailResult = await emailService.SendEmailVerificationEmail(result.Email!, tokenResult.Result!, result.Id);
            if (!emailResult.IsSuccess) throw new UserCreationException("Error while sending email confirmation.");

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

            if (!userFromDb.EmailConfirmed) throw new EmailNotConfirmedException("Email is not confirmed.");

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
                Locked = userFromDb.LockoutEnd != null
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

            var removeResult = await tokenManagement.RemoveRefreshToken(refreshUserId);
            if (!removeResult.IsSuccess) throw new TokenOperationException("Error while trying to remove refresh token.");

            var newTokenResult = await tokenManagement.AddRefreshToken(newRefreshToken, refreshUserId, currentClientIp);
            if (!newTokenResult.IsSuccess) throw new TokenOperationException("Error while trying to add new refresh token");

            return ServiceResult<AuthResponseDto>.Success(new AuthResponseDto
            {
                AccessToken = newAccessToken,
            }, "Token Refreshed Successfully", new { accessToken = newAccessToken });

        }

        public async Task<ServiceResult<bool>> RequestReset(RequestResetDto requestResetDto)
        {
            if (requestResetDto == null || string.IsNullOrWhiteSpace(requestResetDto.Email))
                throw new ArgumentNullException(nameof(requestResetDto.Email), "Email is required.");

            var (userFound, user, userError) = await userManagement.GetUserByEmail(requestResetDto.Email);
            if (!userFound || user == null)
                throw new NotFoundException("User not found", typeof(RequestResetDto));

            var tokenResult = await tokenManagement.GenerateResetPasswordToken(requestResetDto);
            if (!tokenResult.IsSuccess || string.IsNullOrWhiteSpace(tokenResult.Result))
                throw new TokenGenerationException("Error while generating reset password token.");

            // TODO: Integrate email service to send reset password email with tokenResult.Result
            await emailService.SendResetPasswordEmail(user.Email, tokenResult.Result, user.UserId);

            return ServiceResult<bool>.Success(true, "Password reset email sent successfully");
        }

        public async Task<ServiceResult<bool>> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            if (resetPasswordDto == null || string.IsNullOrWhiteSpace(resetPasswordDto.Token) || string.IsNullOrWhiteSpace(resetPasswordDto.Password))
                throw new ArgumentNullException(nameof(resetPasswordDto), "Token and Password are required.");
            if (string.IsNullOrWhiteSpace(resetPasswordDto.UserId))
                throw new ArgumentNullException(nameof(resetPasswordDto.UserId), "User id is required");

            var verifyResult = await tokenManagement.ChangePassword(resetPasswordDto, resetPasswordDto.UserId);
            if (!verifyResult.IsSuccess || !verifyResult.Result)
                throw new UnauthorizedAccessException("Unauthorized: Invalid or expired token.");

            return ServiceResult<bool>.Success(true, "Password reset successfully");
        }

        public async Task<ServiceResult<bool>> VerifyEmail(VerifyEmailDto verifyEmailDto)
        {
            if (verifyEmailDto == null || string.IsNullOrWhiteSpace(verifyEmailDto.Token) || string.IsNullOrWhiteSpace(verifyEmailDto.UserId))
                throw new ArgumentNullException(nameof(verifyEmailDto), "Token and User id are required.");
            if (string.IsNullOrWhiteSpace(verifyEmailDto.UserId))
                throw new ArgumentNullException(nameof(verifyEmailDto.UserId), "User id is required");

            var userFound = await userManagement.GetUserById(verifyEmailDto.UserId);
            if (!userFound.IsSuccess || userFound.Result == null)
                throw new NotFoundException("User not found", typeof(VerifyEmailDto));

            var verifyResult = await tokenManagement.ConfirmEmail(verifyEmailDto.Token, userFound.Result);
            if (!verifyResult.IsSuccess || !verifyResult.Result)
                throw new UnauthorizedAccessException("Unauthorized: Invalid or expired token.");

            return ServiceResult<bool>.Success(true, "Email verified successfully");
        }

        public async Task<ServiceResult<bool>> ResendConfirmationEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentNullException(nameof(email), "Email is required.");

            var userResult = await userManagement.GetUserByEmail(email);
            if (!userResult.IsSuccess || userResult.Result == null)
                throw new NotFoundException("User not found", typeof(VerifyEmailDto));

            var tokenResult = await tokenManagement.GenerateEmailConfirmationToken(userResult.Result);
            if (!tokenResult.IsSuccess && string.IsNullOrWhiteSpace(tokenResult.Result)) throw new UserCreationException("Error while generating email confirmation token.");

            var emailResult = await emailService.SendEmailVerificationEmail(userResult.Result.Email!, tokenResult.Result!, userResult.Result.Id);
            if (!emailResult.IsSuccess) throw new UserCreationException("Error while sending email confirmation.");

            return ServiceResult<bool>.Success(true, "Email sent successfully");
        }
    }
}
