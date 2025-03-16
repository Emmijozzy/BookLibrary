namespace BookLibrary.Server.Infrastructure.Exceptions
{
    public sealed class SecurityOperationException : Exception
    {
        public SecurityOperationException() { }

        public SecurityOperationException(string message) : base(message) { }

        public SecurityOperationException(string message, Exception innerException) : base(message, innerException) { }

    }
}
