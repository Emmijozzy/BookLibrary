using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookLibrary.Server.Application.DTOs.Auth
{
    public class VerifyEmailDto
    {
        public required string Token { get; set; }
        public required string Email { get; set; }
        public required string UserId { get; set; }
    }
}
