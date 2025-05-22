

using BookLibrary.Server.Application.Common;
using BookLibrary.Server.Application.DTOs.Auth;
using BookLibrary.Server.Application.Interface;
using BookLibrary.Server.Domain.Entities;
using BookLibrary.Server.Infrastructure.Data;
using BookLibrary.Server.Infrastructure.Exceptions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BookLibrary.Server.Infrastructure.Security
{
    public class TokenManagement(SimplifiedAspBookProjectContext context, UserManager<ApplicationUser> userManager, IConfiguration configuration, ILogger<TokenManagement> logger) : ITokenManagement
    {
        public string GenerateSignedRefreshToken(string userId)
        {
            var refreshKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:RefreshTokenSecretKey"]!));
            var signingCredentials = new SigningCredentials(refreshKey, SecurityAlgorithms.HmacSha256);

            Claim claim = new Claim("userId", userId);

            var token = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { claim }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = signingCredentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var refreshToken = tokenHandler.CreateToken(token);
            return tokenHandler.WriteToken(refreshToken);
        }

        public async Task<RepositoryResult<bool>> AddRefreshToken(string refreshToken, string userId, string clientIp)
        {
            try
            {
                if (refreshToken == null && userId == null)
                {
                    throw new ArgumentNullException("Refresh token and user id and client ip can not be null");
                }

                var user = await context.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                {
                    throw new KeyNotFoundException("User not found");
                }

                context.RefreshTokens.Add(new RefreshToken()
                {
                    Token = refreshToken!,
                    UserId = user.UserId,
                    CreatedByIp = clientIp,
                    Expires = DateTime.UtcNow.AddDays(7),
                });

                await context.SaveChangesAsync();
                return await Task.FromResult(RepositoryResult<bool>.Success(true));
            }
            catch (KeyNotFoundException ex)
            {
                logger.LogError(ex, "User not found");
                throw;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Unexpected error adding refresh token");
                throw new SecurityOperationException(ex.Message, ex);
            }
        }

        public Task<RepositoryResult<RefreshToken?>> GetRefreshToken(string userId)
        {
            try
            {
                if (userId == null) throw new ArgumentNullException("User id can not be null");

                var refreshToken = context.RefreshTokens.FirstOrDefault(r => r.UserId == userId);
                if (refreshToken == null) throw new KeyNotFoundException("Refresh token not found");
                return Task.FromResult(RepositoryResult<RefreshToken?>.Success(refreshToken));
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Unexpected error getting refresh token");
                throw new SecurityOperationException(ex.Message, ex);
            }
        }

        public Task<RepositoryResult<bool>> UpdateRefreshToken(RefreshToken refreshToken)
        {
            try
            {
                if (refreshToken == null) throw new ArgumentNullException("Refresh token can not be null");

                var existingRefreshToken = context.RefreshTokens.FirstOrDefault(r => r.Token == refreshToken.Token);
                if (existingRefreshToken == null) throw new KeyNotFoundException("Refresh token not found");

                context.RefreshTokens.Update(refreshToken);
                context.SaveChanges();
                return Task.FromResult(RepositoryResult<bool>.Success(true));
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Unexpected error updating refresh token");
                throw new SecurityOperationException(ex.Message, ex);
            }
        }

        public Task<RepositoryResult<bool>> ValidateRefreshToken(string refreshToken, out string userId)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var refreshKey = configuration["JWT:RefreshTokenSecretKey"]!;

            try
            {
                tokenHandler.ValidateToken(refreshToken, ValidationParameters(key: refreshKey), out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var userIdClaim = jwtToken.Claims.First(c => c.Type == "userId");
                userId = userIdClaim.Value;
                return Task.FromResult(RepositoryResult<bool>.Success(true));
            }
            catch (Exception ex)
            {
                userId = string.Empty;
                throw new SecurityOperationException(ex.Message ?? "Invalid refresh token", ex);
            }
        }

        public async Task<RepositoryResult<bool>> RemoveRefreshToken(string userId)
        {
            try
            {
                logger.LogInformation($"Removing all refresh tokens for user {userId}");
                if (userId == null) throw new ArgumentNullException("User id can not be null");

                // Find all refresh tokens that belong to the user
                var refreshTokens = await context.RefreshTokens
                    .Where(r => r.UserId == userId)
                    .ToListAsync();

                if (refreshTokens == null || refreshTokens.Count == 0)
                {
                    logger.LogWarning($"No refresh tokens found for user {userId}");
                    return RepositoryResult<bool>.Success(true);
                }

                logger.LogInformation($"Found {refreshTokens.Count} refresh token(s) for user {userId}");

                context.RefreshTokens.RemoveRange(refreshTokens);
                try
                {
                    await context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException ex)
                {
                    logger.LogError(ex, "Optimistic concurrency exception occurred while removing refresh tokens");
                    // Reload the refresh tokens and try again
                    context.RefreshTokens.Load();
                    context.RefreshTokens.RemoveRange(refreshTokens);
                    await context.SaveChangesAsync();
                }
                return RepositoryResult<bool>.Success(true);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Unexpected error removing refresh tokens");
                throw new SecurityOperationException(ex.Message, ex);
            }
        }

        public string GenerateToken(List<Claim> claims)
        {
            string secretKey = configuration["Jwt:AccessTokenSecretKey"]!;
            Console.WriteLine($"Raw Secret Key from Config: {secretKey}");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(20),
                signingCredentials: creds);
            var tokenHandler = new JwtSecurityTokenHandler();
            var generatedToken = tokenHandler.WriteToken(token);

            Console.WriteLine($"Generated Token: {generatedToken}");

            return generatedToken;
        }

        public List<Claim> GetUserClaimsFromToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var accesskey = configuration["Jwt:AccessTokenSecretKey"];
            tokenHandler.ValidateToken(token, ValidationParameters(key: accesskey), out SecurityToken validatedToken);
            var jwtToken = (JwtSecurityToken)validatedToken;
            var claims = jwtToken.Claims.ToList();
            return claims;
        }

        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            string key = configuration["Jwt:AccessTokenSecretKey"]!;
            var tokenValidationParameters = ValidationParameters(key: key, allowExpiredTokens: true);
            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;

            if (jwtSecurityToken == null)
            {
                throw new SecurityTokenException("Invalid token");
            }

            return principal;
        }

        private TokenValidationParameters ValidationParameters(string key, string? issuer = null, string? audience = null, bool allowExpiredTokens = false)
        {
            return new TokenValidationParameters
            {
                ValidateIssuer = !string.IsNullOrEmpty(issuer), // Validate issuer if provided
                ValidIssuer = issuer,                          // Expected issuer value
                ValidateAudience = !string.IsNullOrEmpty(audience), // Validate audience if provided
                ValidAudience = audience,                      // Expected audience value
                ValidateLifetime = !allowExpiredTokens,        // Validate token lifetime unless expired tokens are allowed
                ValidateIssuerSigningKey = true,               // Validate the signing key
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)), // Signing key
                ClockSkew = TimeSpan.Zero
            };
        }

        public async Task<RepositoryResult<string>> GenerateResetPasswordToken(RequestResetDto request)
        {
            if (string.IsNullOrEmpty(request.Email)) throw new ArgumentNullException("Email is required");

            var user = await userManager.FindByEmailAsync(request.Email);
            if (user == null) throw new KeyNotFoundException("User not found");

            // Generate password reset token
            var token = await userManager.GeneratePasswordResetTokenAsync(user);
            logger.LogInformation($"Token Generated: {token}");
            if (string.IsNullOrEmpty(token)) throw new Exception("Failed to generate password reset token");


            return RepositoryResult<string>.Success(token);

        }

        public async Task<RepositoryResult<bool>> ChangePassword(ResetPasswordDto changePassword, string userId)
        {
            try
            {
                if (changePassword == null) throw new ArgumentNullException(nameof(changePassword));
                if (string.IsNullOrEmpty(changePassword.Password)) throw new ArgumentNullException(nameof(changePassword.Password), "Password is required");
                if (string.IsNullOrEmpty(changePassword.Token)) throw new ArgumentNullException(nameof(changePassword.Token), "Token is required");
                if (string.IsNullOrEmpty(userId)) throw new ArgumentNullException(nameof(userId), "User id is required");

                logger.LogInformation("Attempting to reset password for user ID: {UserId}", userId);
                logger.LogDebug("Token length: {TokenLength}", changePassword.Token.Length);

                var user = await userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    logger.LogWarning("User not found with ID: {UserId}", userId);
                    throw new KeyNotFoundException("User not found");
                }

                logger.LogInformation("Found user: {UserEmail}", user.Email);


                var result = await userManager.ResetPasswordAsync(user, changePassword.Token, changePassword.Password);

                if (result.Succeeded)
                {
                    logger.LogInformation("Password reset successful for user: {UserEmail}", user.Email);
                    return RepositoryResult<bool>.Success(true);
                }

                if (result.Errors.Any())
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    logger.LogWarning("Password reset failed: {Errors}", errors);
                    return RepositoryResult<bool>.Failure(errors);
                }

                logger.LogWarning("Unknown error occurred while changing password");
                return RepositoryResult<bool>.Failure("Unknown error occurred while changing password");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Exception during password reset");
                throw;
            }
        }

        public Task<RepositoryResult<string>> GenerateEmailConfirmationToken(ApplicationUser user)
        {
            if (user == null) throw new ArgumentNullException(nameof(user), "User is required");

            var token = userManager.GenerateEmailConfirmationTokenAsync(user);
            if (token == null) throw new Exception("Failed to generate email confirmation token");

            logger.LogInformation($"Token Generated: {token.Result}");

            return Task.FromResult(RepositoryResult<string>.Success(token.Result));
        }

        public async Task<RepositoryResult<bool>> ConfirmEmail(string token, ApplicationUser user)
        {
            if (string.IsNullOrEmpty(token)) throw new ArgumentNullException(nameof(token), "Token is required");
            if (user == null) throw new ArgumentNullException(nameof(user), "User is required");

            logger.LogInformation($"Attempting to confirm email for user: {user.Email}, Token: {token}");

            //confirm email
            var userFound = await userManager.ConfirmEmailAsync(user, token);
            if (userFound.Succeeded) return RepositoryResult<bool>.Success(true);

            var errors = string.Join(", ", userFound.Errors.Select(e => e.Description));
            return RepositoryResult<bool>.Failure(errors);
        }

    }
}
