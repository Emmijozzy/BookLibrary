using BookLibrary.Server.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace BookLibrary.Server.Infrastructure.Data
{
    public class MinimalDbContext : DbContext
    {
        public MinimalDbContext(DbContextOptions<MinimalDbContext> options)
            : base(options)
        {
        }

        // Add Book and Category entities
        public DbSet<Book> Books { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseNpgsql("Host=localhost;Database=MinimalBooklibrary;Username=postgres;Password=postgres");
            }
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure Book entity
            builder.Entity<Book>()
                .Property(b => b.Id)
                .HasDefaultValueSql("gen_random_uuid()");

            // Configure Category entity
            builder.Entity<Category>()
                .Property(c => c.Id)
                .HasDefaultValueSql("gen_random_uuid()");

            // Configure Book-Category relationship
            builder.Entity<Book>()
                .HasOne(b => b.Category)
                .WithMany(c => c.Books)
                .HasForeignKey(b => b.CategoryId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configure RefreshToken
            builder.Entity<RefreshToken>()
                .HasKey(r => r.Token);

            builder.Entity<RefreshToken>()
                .Ignore(r => r.IsExpired)
                .Ignore(r => r.IsActive);
        }
    }

    public class MinimalDbContextFactory : IDesignTimeDbContextFactory<MinimalDbContext>
    {
        public MinimalDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<MinimalDbContext>();
            optionsBuilder.UseNpgsql("Host=localhost;Database=MinimalBooklibrary;Username=postgres;Password=postgres");
            return new MinimalDbContext(optionsBuilder.Options);
        }
    }
}