namespace BookLibrary.Server.Application.DTOs.User
{
    public class UpdateUserRolesDto
    {
        public required List<string> Roles { get; set; }
    }
}
