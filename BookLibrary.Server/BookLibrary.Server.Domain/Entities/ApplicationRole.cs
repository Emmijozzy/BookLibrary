using Microsoft.AspNetCore.Identity;

namespace BookLibrary.Server.Domain.Entities
{
    public class ApplicationRole : IdentityRole
    {
        public string? Description { get; set; }
    }
}
