using BookLibrary.Server.Application.DTOs.Book;

namespace BookLibrary.Server.Application.DTOs.Category
{
    public class GetCategory : BaseCategory
    {
        public Guid Id { get; set; }
        public ICollection<GetBook>? Books { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
