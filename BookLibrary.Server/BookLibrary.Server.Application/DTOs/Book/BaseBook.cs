using Microsoft.AspNetCore.Http;


namespace BookLibrary.Server.Application.DTOs.Book
{
    public class BaseBook
    {
        public string Title { get; set; } = string.Empty;

        public string Author { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Isbn { get; set; } = string.Empty;

        public DateTime PublicationDate { get; set; }

        public IFormFile? Image { get; set; }

        public string? ImageUrl { get; set; }

        public IFormFile? Pdf { get; set; }

        public string? PdfUrl { get; set; }

        public int NumberOfPage { get; set; }

        public string Genre { get; set; } = string.Empty;

        public Guid CategoryId { get; set; }

        public string Publisher { get; set; } = string.Empty;

        public string Language { get; set; } = string.Empty;
    }
}

