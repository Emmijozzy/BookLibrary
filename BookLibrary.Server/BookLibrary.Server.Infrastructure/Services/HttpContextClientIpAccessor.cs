using BookLibrary.Server.Application.Interface;
using Microsoft.AspNetCore.Http;

namespace BookLibrary.Server.Infrastructure.Services
{
    public class HttpContextClientIpAccessor(IHttpContextAccessor httpContextAccessor) : IClientIpAccessor
    {

        public string GetClientIp()
        {
            return httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString();
        }
    }
}
