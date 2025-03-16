namespace BookLibrary.Server.Application.DTOs.User
{
    public class UserDto
    {
        public required string Id { get; set; }
        public required string Email { get; set; }
        public required string FullName { get; set; }
        public bool isAuthenticated { get; set; }
    }
}
