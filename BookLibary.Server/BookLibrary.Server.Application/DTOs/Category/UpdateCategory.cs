namespace BookLibrary.Server.Application.DTOs.Category
{
    public class UpdateCategory : BaseCategory
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
