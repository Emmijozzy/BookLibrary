using BookLibrary.Server.Application.Common;

namespace BookLibrary.Server.Application.Interface
{
    public interface IEmailService
    {
        Task<RepositoryResult<bool>> SendResetPasswordEmail(string email, string token, string userId);
        Task<RepositoryResult<bool>> SendEmailVerificationEmail(string email, string token, string userId);
    }
}
