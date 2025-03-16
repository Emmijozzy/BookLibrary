using System.ComponentModel.DataAnnotations;

namespace BookLibrary.Server.Application.DTOs.Category
{
    public class BaseCategory
    {
        [Required(ErrorMessage = "Name is required")]
        public required string Name { get; set; }
        public required string Description { get; set; }

    }
}
