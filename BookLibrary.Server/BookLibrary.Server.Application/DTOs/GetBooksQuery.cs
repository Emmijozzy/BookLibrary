namespace BookLibrary.Server.Application.DTOs
{
    public class GetBooksQuery
    {
        public string? SearchTerm { get; set; }
        public string? SearchBy { get; set; }
        public DateTime? PublishedAfter { get; set; }
        public string? Genre { get; set; }
        public string? SortBy { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? IncludeProperties { get; set; } = null;
        public string? UserId { get; set; }
        public bool? IsPrivate { get; set; }
    }
}
