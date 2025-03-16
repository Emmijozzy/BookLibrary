using BookLibrary.Server.Application.DTOs.Auth;
using FluentValidation;

namespace BookLibrary.Server.Application.Validation.Auth
{
    public class LoginValidation : AbstractValidator<LoginUser>
    {
        public LoginValidation()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");
            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(8).WithMessage("Password must be at least 8 characters long");
        }
    }
}
