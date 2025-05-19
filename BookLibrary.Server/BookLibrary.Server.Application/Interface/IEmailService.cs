using BookLibrary.Server.Application.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookLibrary.Server.Application.Interface
{
    public interface IEmailService
    {
        Task<RepositoryResult<bool>> SendResetPasswordEmail(string email, string token, string userId);
        Task<RepositoryResult<bool>> SendEmailVerificationEmail(string email, string token, string userId);
    }
}
