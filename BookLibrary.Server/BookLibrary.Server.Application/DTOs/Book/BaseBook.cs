using System.ComponentModel.DataAnnotations;

namespace BookLibrary.Server.Application.DTOs.Book
{
    public class BaseBook
    {
        [Required(ErrorMessage = "Title is required")]
        [StringLength(200, ErrorMessage = "Title cannot be longer than 200 characters")]
        public required string Title { get; set; }
        [Required(ErrorMessage = "Author is required")]
        [StringLength(150, ErrorMessage = "Author name cannot be longer than 150 characters")]
        public required string Author { get; set; }
        [StringLength(1000, ErrorMessage = "Description cannot be longer than 1000 characters")]
        public required string Description { get; set; }
        [Required(ErrorMessage = "ISBN is required")]
        [StringLength(13, MinimumLength = 10, ErrorMessage = "ISBN must be between 10 and 13 characters long")]
        public required string Isbn { get; set; }
        [Required(ErrorMessage = "Publication Date is required")]
        [DataType(DataType.Date)]
        public DateTime PublicationDate { get; set; }
        [RegularExpression(@"^(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|png|gif|bmp|webp)$", ErrorMessage = "Image URL must be a valid URL and end with a valid image file extension (e.g., .jpg, .png).")]
        public string? ImageUrl { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Number of pages must be a positive number")]
        public required int NumberOfPage { get; set; }
        [Required(ErrorMessage = "Genre is required")]
        [StringLength(100, ErrorMessage = "Genre cannot be longer than 100 characters")]
        public string? Genre { get; set; }
        [Required(ErrorMessage = "Category Id is required")]
        public Guid CategoryId { get; set; }
        [StringLength(100, ErrorMessage = "Publisher name cannot be longer than 100 characters")]
        public required string Publisher { get; set; }
        [Required(ErrorMessage = "Language is required")]
        [StringLength(50, ErrorMessage = "Language cannot be longer than 50 characters")]
        public required string Language { get; set; }
    }
}
