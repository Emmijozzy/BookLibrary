namespace BookLibrary.Server.Application.Exceptions
{
    public class BookRetrievalException : Exception
    {
        public BookRetrievalException(string message) : base(message) { }
    }
}
