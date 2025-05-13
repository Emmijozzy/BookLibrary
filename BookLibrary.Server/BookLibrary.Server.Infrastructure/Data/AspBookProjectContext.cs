using BookLibrary.Server.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace BookLibrary.Server.Infrastructure.Data
{
    public partial class AspBookProjectContext(DbContextOptions<AspBookProjectContext> options) : IdentityDbContext<ApplicationUser, ApplicationRole, string>(options)
    {
        public DbSet<Book> Books { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (optionsBuilder == null)
            {
                throw new ArgumentNullException(nameof(optionsBuilder));
            }

            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=AspBookProject;Integrated Security=true;TrustServerCertificate=true;");
            }
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationRole>(entity =>
            {
                entity.Property(e => e.Description).HasMaxLength(250);
            });

            // Seed default roles
            SeedRoles(builder);

            // Seed admin user
            SeedAdminUser(builder);
        }

        private void SeedRoles(ModelBuilder builder)
        {
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

            // Store role IDs for user assignment
            _adminRoleId = adminRoleId;
        }

        private string _adminRoleId;

        private void SeedAdminUser(ModelBuilder builder)
        {
            string adminUserId = Guid.NewGuid().ToString();

            // Create admin user
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
                    RoleId = _adminRoleId
                }
            );
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
