using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookLibrary.Server.Application.DTOs.User
{
    public class DeleteAccountDto
    {
        public required string Password { get; set; }
        public required string ConfirmText { get; set; }
    }
}
