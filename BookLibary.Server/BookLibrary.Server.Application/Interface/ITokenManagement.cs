using BookLibrary.Server.Application.Common;
using BookLibrary.Server.Domain.Entities;
using System.Security.Claims;

namespace BookLibrary.Server.Application.Interface
{
    public interface ITokenManagement
    {
        string GenerateSignedRefreshToken(string userId);
        Task<RepositoryResult<bool>> AddRefreshToken(string refreshToken, string userId, string clientIp);
        Task<RepositoryResult<RefreshToken?>> GetRefreshToken(string userId);
        Task<RepositoryResult<bool>> UpdateRefreshToken(RefreshToken refreshToken);
        Task<RepositoryResult<bool>> ValidateRefreshToken(string refreshToken, out string userId);
        Task<RepositoryResult<bool>> RemoveRefreshToken(string userId);
        List<Claim> GetUserClaimsFromToken(string token);
        string GenerateToken(List<Claim> claims);
        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
    }
}
