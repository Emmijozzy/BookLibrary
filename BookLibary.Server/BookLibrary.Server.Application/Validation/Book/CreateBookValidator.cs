using BookLibrary.Server.Application.DTOs;
using FluentValidation;

namespace BookLibrary.Server.Application.Validation.Book
{
    public class CreateBookValidator : AbstractValidator<CreateBook>
    {
        public CreateBookValidator()
        {
            RuleFor(book => book.Title)
                .NotEmpty().WithMessage("Title is required")
                .MaximumLength(200).WithMessage("Title cannot be longer than 200 characters");

            RuleFor(book => book.Author)
                .NotEmpty().WithMessage("Author is required")
                .MaximumLength(150).WithMessage("Author name cannot be longer than 150 characters");

            RuleFor(book => book.Description)
                .MaximumLength(1000).WithMessage("Description cannot be longer than 1000 characters");

            RuleFor(book => book.Isbn)
                .NotEmpty().WithMessage("ISBN is required")
                .Length(10, 13).WithMessage("ISBN must be between 10 and 13 characters long");

            RuleFor(book => book.PublicationDate)
                .NotEmpty().WithMessage("Publication Date is required")
                .Must(date => date != default(DateTime)).WithMessage("Publication Date is required");

            RuleFor(book => book.ImageUrl)
                .Matches(@"^(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|png|gif|bmp|webp)$")
                .WithMessage("Image URL must be a valid URL and end with a valid image file extension (e.g., .jpg, .png).")
                .When(book => !string.IsNullOrEmpty(book.ImageUrl));

            RuleFor(book => book.NumberOfPage)
                .GreaterThanOrEqualTo(0).WithMessage("Number of pages must be a positive number");

            RuleFor(book => book.Genre)
                .NotEmpty().WithMessage("Genre is required")
                .MaximumLength(100).WithMessage("Genre cannot be longer than 100 characters");

            RuleFor(book => book.Publisher)
                .NotEmpty().WithMessage("Publisher is required")
                .MaximumLength(100).WithMessage("Publisher name cannot be longer than 100 characters");

            RuleFor(book => book.Language)
                .NotEmpty().WithMessage("Language is required")
                .MaximumLength(50).WithMessage("Language cannot be longer than 50 characters");
        }
    }
}
