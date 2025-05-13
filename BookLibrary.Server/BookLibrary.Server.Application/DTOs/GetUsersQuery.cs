using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookLibrary.Server.Application.DTOs
{
    public class GetUsersQuery
    {
        public string? SearchTerm { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Role { get; set; }
        public string? SortBy { get; set; }
        public string? status { get; set; }
        public string? IncludeProperties { get; set; }
    }
}
