namespace BookLibrary.Server.Application.Exceptions
{
    public class CategoryOperationException : Exception
    {
        public CategoryOperationException(string message) : base(message) { }
    }
}
