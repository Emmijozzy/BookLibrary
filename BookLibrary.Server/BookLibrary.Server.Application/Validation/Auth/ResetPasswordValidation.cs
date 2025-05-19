using BookLibrary.Server.Application.DTOs.Auth;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookLibrary.Server.Application.Validation.Auth
{
    public class ResetPasswordValidation : AbstractValidator<ResetPasswordDto>
    {
        public ResetPasswordValidation()
        {
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
            RuleFor(x => x.Token)
                .NotEmpty().WithMessage("Token is required");

        }
    }
}
