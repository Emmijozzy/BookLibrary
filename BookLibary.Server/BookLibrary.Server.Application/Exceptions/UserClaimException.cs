namespace BookLibrary.Server.Application.Exceptions
{
    public class UserClaimException : Exception
    {
        public UserClaimException(string message) : base(message) { }
    }
}
