using BookLibrary.Server.Application.DTOs.Auth;
using FluentValidation;

namespace BookLibrary.Server.Application.Validation.Auth
{
    public class RegisterValidation : AbstractValidator<RegisterUser>
    {
        public RegisterValidation()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");
            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(8).WithMessage("Password must be at least 8 characters long")
                .Matches(@"(?=.*[A-Z])")
                .WithMessage("Password must contain at least one uppercase letter.")
                .Matches(@"(?=.*[a-z])")
                .WithMessage("Password must contain at least one lowercase letter.")
                .Matches(@"(?=.*\d)")
                .WithMessage("Password must contain at least one digit.")
                .Matches(@"^[A-Za-z\d!@#$%^&*]+$")
                .WithMessage("Password must contain only alphanumeric characters and the following special characters: !@#$%^&*");
            RuleFor(x => x.ConfirmPassword)
                .NotEmpty().WithMessage("Confirm Password is required")
                .Equal(x => x.Password).WithMessage("Passwords do not match");
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Full Name is required")
                .MaximumLength(100).WithMessage("Full Name must not exceed 100 characters");
        }
    }
}
