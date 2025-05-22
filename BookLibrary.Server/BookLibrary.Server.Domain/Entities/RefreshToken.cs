using System.ComponentModel.DataAnnotations;

namespace BookLibrary.Server.Domain.Entities
{
    public class RefreshToken
    {
        [Key]
        public required string Token { get; set; }
        public DateTime Expires { get; set; }
        public bool IsExpired => DateTime.UtcNow >= Expires;
        public DateTime Created { get; set; } = DateTime.UtcNow.ToUniversalTime();
        public required string CreatedByIp { get; set; }
        public DateTime? Revoked { get; set; }
        public string RevokedByIp { get; set; } = string.Empty;
        public required string UserId { get; set; }
        public bool IsActive => Revoked == null && !IsExpired;
    }
}
