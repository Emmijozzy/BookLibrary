using BookLibrary.Server.Application.DTOs.Category;

namespace BookLibrary.Server.Application.DTOs.Book
{
    public class GetBook : BaseBook
    {
        public Guid Id { get; set; }
        public GetCategory? Category { get; set; }
        public Guid CategoryId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
