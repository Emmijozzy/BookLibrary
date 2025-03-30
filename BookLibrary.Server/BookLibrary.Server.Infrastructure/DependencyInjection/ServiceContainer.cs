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
                var secretKey = configuration["Jwt:AccessTokenSecretKey"];
                Console.WriteLine($"Raw Secret Key from Config: {secretKey}");

                // If using Base64-encoded key, decode it
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateAudience = false,
                    ValidateIssuer = false,
                    ValidateLifetime = true,
                    //RequireExpirationTime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ClockSkew = TimeSpan.Zero,
                };
                options.Events = new JwtBearerEvents
                {


                    OnMessageReceived = context =>
                    {
                        var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
                        if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
                        {
                            context.Token = authHeader.Substring("Bearer ".Length).Trim();
                            // Console.WriteLine($"Extracted Token: {context.Token}");
                        }
                        return Task.CompletedTask;
                    },

                    OnChallenge = context =>
                    {
                        // Skip the default behavior
                        //context.HandleResponse();

                        Console.WriteLine(context.Error);
                        Console.WriteLine(context);

                        if (context.Request.Path.StartsWithSegments("/api/AuthApi/RefreshToken"))
                        {
                            context.HandleResponse();
                            return Task.CompletedTask;
                        }

                        if (context.AuthenticateFailure is SecurityTokenExpiredException)
                        {
                            throw new SecurityTokenExpiredException("Unauthorized: Token has expired.");
                        }
                        else
                        {
                            throw new UnauthorizedAccessException("Unauthorized: Invalid or missing token.");
                        }
                    },

                    OnAuthenticationFailed = context =>
                    {
                        Console.WriteLine($"Authentication Failed: {context.Exception.Message}");
                        return Task.CompletedTask;
                    },

                    OnTokenValidated = context =>
                    {
                        Console.WriteLine("Token validated successfully.");
                        return Task.CompletedTask;
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
