namespace BookLibrary.Server.Infrastructure.Exceptions
{
    public class EntityIdPropertyNotFoundException : Exception
    {
        public Type EntityType { get; }

        public EntityIdPropertyNotFoundException(Type entityType) : base($"Entity {entityType.Name} does not have an Id property")
        {
            this.EntityType = entityType;
        }
    }
}
