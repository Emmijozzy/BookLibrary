using BookLibrary.Server.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace BookLibrary.Server.Infrastructure.Data
{
    public class MinimalIdentityDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        public MinimalIdentityDbContext(DbContextOptions<MinimalIdentityDbContext> options)
            : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseNpgsql("Host=localhost;Database=MinimalIdentityBooklibrary;Username=postgres;Password=postgres");
            }
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure ApplicationUser
            builder.Entity<ApplicationUser>()
                .Ignore(u => u.UserId);
        }
    }

    public class MinimalIdentityDbContextFactory : IDesignTimeDbContextFactory<MinimalIdentityDbContext>
    {
        public MinimalIdentityDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<MinimalIdentityDbContext>();
            optionsBuilder.UseNpgsql("Host=localhost;Database=MinimalIdentityBooklibrary;Username=postgres;Password=postgres");
            return new MinimalIdentityDbContext(optionsBuilder.Options);
        }
    }
}