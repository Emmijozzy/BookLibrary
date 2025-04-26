namespace BookLibrary.Server.Domain.Entities
{
    public class Book
    {
        public Guid Id { get; set; } = new Guid();
        public required string Title { get; set; }
        public required string Author { get; set; }
        public required string Description { get; set; }
        public required string Isbn { get; set; }
        public required DateTime PublicationDate { get; set; }
        public string? ImageUrl { get; set; }
        public required int NumberOfPage { get; set; }
        public string? Genre { get; set; }
        public required string Publisher { get; set; }
        public required string Language { get; set; }
        public string? PdfUrl { get; set; }
        public Category? Category { get; set; }
        public Guid CategoryId { get; set; } = Guid.Parse("00000000-0000-0000-0000-000000000001");
        public DateTime CreatedAt
        { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}