namespace BookLibrary.Server.Domain.Entities
{
    public class Category
    {
        public Guid Id { get; set; } = new Guid();
        public required string Name { get; set; }
        public required string Description { get; set; }
        public ICollection<Book>? Books { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}
