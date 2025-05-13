using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookLibrary.Server.Application.DTOs.User
{
    public class UpdateUserDto
    {
        public required string Id { get; set; }
        public required string Email { get; set; }
        public required string FullName { get; set; }
    }
}
