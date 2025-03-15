namespace BookLibrary.Server.Application.Exceptions
{
    public class BookOperationException : Exception
    {
        public BookOperationException(string message) : base(message) { }
    }
}
