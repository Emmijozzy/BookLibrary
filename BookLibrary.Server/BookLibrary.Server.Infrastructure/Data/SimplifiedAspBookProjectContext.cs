using BookLibrary.Server.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace BookLibrary.Server.Infrastructure.Data
{
    public class SimplifiedAspBookProjectContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        public SimplifiedAspBookProjectContext(DbContextOptions<SimplifiedAspBookProjectContext> options)
            : base(options)
        {
        }

        public DbSet<Book> Books { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
                var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");

                if (environment == "Production")
                {
                    optionsBuilder.UseNpgsql(connectionString ?? throw new Exception("DATABASE_URL environment variable is not set."));
                }
                else
                {
                    optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=booklibrary;Username=postgres;Password=postgres;SSL Mode=Prefer;Trust Server Certificate=true");
                }
            }
        }
        protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
        {
            base.ConfigureConventions(configurationBuilder);

            // Configure DateTime properties to always use UTC
            configurationBuilder
                .Properties<DateTime>()
                .HaveConversion(typeof(UtcValueConverter));
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Minimal configurations
            builder.Entity<ApplicationRole>().Property(e => e.Description).HasMaxLength(250);
            builder.Entity<RefreshToken>().HasKey(r => r.Token);
            builder.Entity<RefreshToken>().Ignore(r => r.IsExpired).Ignore(r => r.IsActive);
            builder.Entity<ApplicationUser>().Ignore(u => u.UserId);

        }
    }

    public class SimplifiedAspBookProjectContextFactory : IDesignTimeDbContextFactory<SimplifiedAspBookProjectContext>
    {
        public SimplifiedAspBookProjectContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<SimplifiedAspBookProjectContext>();
            optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=booklibrary;Username=postgres;Password=postgres;SSL Mode=Prefer;Trust Server Certificate=true");
            return new SimplifiedAspBookProjectContext(optionsBuilder.Options);
        }
    }
}