using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookLibrary.Server.Application.DTOs.Auth
{
    public class ResendVerificationEmailDto
    {
        public required string Email { get; set; }
    }
}
