﻿namespace BookLibrary.Server.Application.DTOs.Auth
{
    public class ResetPasswordDto
    {
        public required string Token { get; set; }
        public required string Password { get; set; }
        public required string UserId { get; set; }
    }
}
