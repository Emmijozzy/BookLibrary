using Microsoft.AspNetCore.Identity;

namespace BookLibrary.Server.Domain.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string UserId => Id;
        public required string FullName { get; set; }
    }
}
