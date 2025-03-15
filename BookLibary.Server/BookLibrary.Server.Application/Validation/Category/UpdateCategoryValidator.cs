using BookLibrary.Server.Application.DTOs.Category;
using FluentValidation;

namespace BookLibrary.Server.Application.Validation.Category
{
    public class UpdateCategoryValidator : AbstractValidator<UpdateCategory>
    {
        public UpdateCategoryValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("Id is required.");
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.");
            RuleFor(x => x.CreatedAt).LessThanOrEqualTo(DateTime.Now).WithMessage("CreatedAt must be in the past or present.");
            RuleFor(x => x.UpdatedAt).LessThanOrEqualTo(DateTime.Now).WithMessage("UpdatedAt must be in the past or present.");
        }
    }
}
