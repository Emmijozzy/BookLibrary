

using BookLibrary.Server.Application.Common;
using BookLibrary.Server.Application.Interface;
using BookLibrary.Server.Domain.Entities;
using BookLibrary.Server.Infrastructure.Data;
using BookLibrary.Server.Infrastructure.Exceptions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BookLibrary.Server.Infrastructure.Security
{
    public class TokenManagement(AspBookProjectContext context, IConfiguration configuration, ILogger<TokenManagement> logger) : ITokenManagement
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

                var refreshTokenFromDb = await context.RefreshTokens.FirstOrDefaultAsync(r => r.UserId == user.UserId);
                if (refreshTokenFromDb != null)
                {
                    context.RefreshTokens.Remove(refreshTokenFromDb);
                    await context.SaveChangesAsync();
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
                logger.LogInformation($"Removing refresh token for user {userId}");
                if (userId == null) throw new ArgumentNullException("User id can not be null");

                var refreshToken = context.RefreshTokens.FirstOrDefault(r => r.UserId == userId);
                if (refreshToken == null)
                {
                    // logger.LogWarning($"Refresh token not found for user {userId}");
                    throw new KeyNotFoundException("Refresh token not found");
                }
                // logger.LogInformation($"Refresh token found for user {refreshToken.UserId}");

                context.RefreshTokens.Remove(refreshToken);
                await context.SaveChangesAsync();
                return RepositoryResult<bool>.Success(true);

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Unexpected error removing refresh token");
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
                expires: DateTime.Now.AddMinutes(15),
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

    }
}
