using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookLibrary.Server.Application.Exceptions
{
    public class UserOperationException : Exception
    {
        public UserOperationException(string message) : base(message)
        {
        }
    }
}
