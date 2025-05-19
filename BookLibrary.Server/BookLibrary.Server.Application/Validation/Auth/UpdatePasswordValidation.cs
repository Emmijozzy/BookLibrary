using BookLibrary.Server.Application.DTOs.User;
using FluentValidation;

namespace BookLibrary.Server.Application.Validation.Auth
{
    public class UpdatePasswordValidation : AbstractValidator<UpdatePasswordDto>
    {
        public UpdatePasswordValidation()
        {
            RuleFor(x => x.CurrentPassword)
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
            RuleFor(x => x.NewPassword)
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
                .Equal(x => x.NewPassword).WithMessage("Passwords do not match");
        }
    }
}
