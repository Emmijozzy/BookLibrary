using BookLibrary.Server.Application.Common;
using FluentValidation;

namespace BookLibrary.Server.Application.Services.Interface
{
    public interface IValidationService
    {
        Task<ServiceResult<bool>> validateAsync<T>(T model, IValidator<T> validator);
    }
}
