﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookLibrary.Server.Application.Exceptions
{
    public class PermissionDeniedException: Exception
    {
        public PermissionDeniedException(string message) : base(message) { }
    }
}
