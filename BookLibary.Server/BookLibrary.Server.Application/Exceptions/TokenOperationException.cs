namespace BookLibrary.Server.Application.Exceptions
{
    public class TokenOperationException : Exception
    {
        public TokenOperationException(string message) : base(message) { }
    }
}
