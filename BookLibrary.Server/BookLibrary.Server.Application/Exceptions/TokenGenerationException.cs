namespace BookLibrary.Server.Application.Exceptions
{
    public class TokenGenerationException : Exception
    {
        public TokenGenerationException(string message) : base(message) { }
    }
}
