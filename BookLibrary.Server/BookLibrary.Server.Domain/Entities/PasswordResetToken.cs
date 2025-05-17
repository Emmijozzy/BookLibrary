namespace BookLibrary.Server.Domain.Entities
{
    public class PasswordResetToken
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public required string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public required string Token { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
