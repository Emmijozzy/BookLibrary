namespace BookLibrary.Server.Application.DTOs.Auth
{
    public class RegisterUser : BaseUser
    {
        public required string ConfirmPassword { get; set; }
        public required string FullName { get; set; }
    }
}
