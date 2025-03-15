using System.ComponentModel.DataAnnotations;

namespace BookLibrary.Server.Application.DTOs.Book
{
    public class UpdateBook : BaseBook
    {
        [Required(ErrorMessage = "Id is required")]
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
