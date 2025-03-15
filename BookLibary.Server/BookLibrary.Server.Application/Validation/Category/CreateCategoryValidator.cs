using BookLibrary.Server.Application.DTOs.Category;
using FluentValidation;

namespace BookLibrary.Server.Application.Validation.Category
{
    public class CreateCategoryValidation : AbstractValidator<CreateCategory>
    {
        public CreateCategoryValidation()
        {
            RuleFor(category => category.Name)
                .NotEmpty().WithMessage("Name is required")
                .MaximumLength(100).WithMessage("Name must not exceed 100 characters");
        }
    }
}
