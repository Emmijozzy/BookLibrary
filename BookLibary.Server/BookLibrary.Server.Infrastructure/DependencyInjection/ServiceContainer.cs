using BookLibrary.Server.Application.Interface;
using BookLibrary.Server.Domain.Entities;
using BookLibrary.Server.Infrastructure.Data;
using BookLibrary.Server.Infrastructure.Repository;
using BookLibrary.Server.Infrastructure.Security;
using BookLibrary.Server.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace BookLibrary.Server.Infrastructure.DependencyInjection
{
    public static class ServiceContainer
    {
        public static IServiceCollection AddInfrastructureService(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AspBookProjectContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
            });

            services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
                    .AddEntityFrameworkStores<AspBookProjectContext>();

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters()
                {
                    ValidateAudience = false,
                    ValidateIssuer = false,
                    ValidateLifetime = true,
                    RequireExpirationTime = true,
                    ValidateIssuerSigningKey = true,
                    ClockSkew = TimeSpan.Zero,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:AccessTokenSecretKey"]!))
                };
                options.Events = new JwtBearerEvents
                {
                    OnChallenge = context =>
                    {
                        // Skip the default behavior
                        context.HandleResponse();

                        if (context.AuthenticateFailure is SecurityTokenExpiredException)
                        {
                            throw new SecurityTokenExpiredException("Unauthorized: Token has expired.");
                        }
                        else
                        {
                            throw new UnauthorizedAccessException("Unauthorized: Invalid or missing token.");
                        }

                    }
                };
            });

            services.AddHttpContextAccessor();

            services.AddScoped<IGenericRepository<Book>, Generic<Book>>();
            services.AddScoped<IGenericRepository<Category>, Generic<Category>>();
            services.AddScoped<ITokenManagement, TokenManagement>();
            services.AddScoped<IUserManagement, UserManagement>();
            services.AddTransient<IClientIpAccessor, HttpContextClientIpAccessor>();

            return services;
        }
    }
}
