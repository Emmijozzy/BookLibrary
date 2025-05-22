using BookLibrary.Server.Domain.Entities;
using Microsoft.AspNetCore.Identity;
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
                optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=booklibrary;Username=postgres;Password=postgres;SSL Mode=Prefer;Trust Server Certificate=true");
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

            // Seed roles
            string adminRoleId = Guid.NewGuid().ToString();
            string userRoleId = Guid.NewGuid().ToString();

            builder.Entity<ApplicationRole>().HasData(
                new ApplicationRole
                {
                    Id = adminRoleId,
                    Name = "Admin",
                    NormalizedName = "ADMIN",
                    Description = "Administrator role with full access"
                },
                new ApplicationRole
                {
                    Id = userRoleId,
                    Name = "User",
                    NormalizedName = "USER",
                    Description = "Standard user role with limited access"
                }
            );

            // Seed admin user
            string adminUserId = Guid.NewGuid().ToString();
            var adminUser = new ApplicationUser
            {
                Id = adminUserId,
                UserName = "admin@booklibrary.com",
                NormalizedUserName = "ADMIN@BOOKLIBRARY.COM",
                Email = "admin@booklibrary.com",
                NormalizedEmail = "ADMIN@BOOKLIBRARY.COM",
                EmailConfirmed = true,
                FullName = "System Administrator",
                SecurityStamp = Guid.NewGuid().ToString()
            };

            // Set password hash
            var passwordHasher = new PasswordHasher<ApplicationUser>();
            adminUser.PasswordHash = passwordHasher.HashPassword(adminUser, "Admin@123");

            builder.Entity<ApplicationUser>().HasData(adminUser);

            // Assign admin role to admin user
            builder.Entity<IdentityUserRole<string>>().HasData(
                new IdentityUserRole<string>
                {
                    UserId = adminUserId,
                    RoleId = adminRoleId
                }
            );
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