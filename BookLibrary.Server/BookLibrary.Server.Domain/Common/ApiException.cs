namespace BookLibrary.Server.Domain.Common
{
    public abstract class ApiException : Exception
    {
        public int statusCode { get; }

        public ApiException(string message, int statusCode) : base(message)
        {
            this.statusCode = statusCode;
        }
    }
}
