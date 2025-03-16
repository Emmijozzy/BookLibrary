namespace BookLibrary.Server.Application.Exceptions
{
    public class NotFoundException : Exception
    {
        public Type EntityType { get; }
        public NotFoundException(string message, Type entityType) : base(message)
        {
            EntityType = entityType;
        }
    }
}
