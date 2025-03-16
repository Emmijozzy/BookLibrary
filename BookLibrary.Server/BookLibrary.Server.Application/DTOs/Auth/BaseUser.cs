namespace BookLibrary.Server.Application.DTOs.Auth
{
    public class BaseUser
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
