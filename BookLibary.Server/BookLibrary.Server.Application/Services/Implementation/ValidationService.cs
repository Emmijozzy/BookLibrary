// Ignore Spelling: validator

using BookLibrary.Server.Application.Common;
using BookLibrary.Server.Application.Services.Interface;
using FluentValidation;

namespace BookLibrary.Server.Application.Services.Implementation
{
    public class ValidationService : IValidationService
    {
        public async Task<ServiceResult<bool>> validateAsync<T>(T model, IValidator<T> validator)
        {
            var validationResult = await validator.ValidateAsync(model);

            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList();
                return ServiceResult<bool>.Failure("Validation Failed", errors);
            }

            return ServiceResult<bool>.Success(true, "Validation Succeeded");
        }
    }
}
