using BookLibrary.Server.Application.Interface;
using BookLibrary.Server.Domain.Entities;
using BookLibrary.Server.Infrastructure.Configurations;
using BookLibrary.Server.Infrastructure.Data;
using BookLibrary.Server.Infrastructure.Repository;
using BookLibrary.Server.Infrastructure.Security;
using BookLibrary.Server.Infrastructure.Services;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace BookLibrary.Server.Infrastructure.DependencyInjection
{
    public static class ServiceContainer
    {
        public static IServiceCollection AddInfrastructureService(this IServiceCollection services, IConfiguration configuration)
        {
            // Database configuration
            services.AddDbContext<AspBookProjectContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
            });

            services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
            {
                // User settings
                options.User.RequireUniqueEmail = true;

                // Add password settings if needed
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequiredLength = 8;
            })
            .AddEntityFrameworkStores<AspBookProjectContext>()
            .AddDefaultTokenProviders();

            // Configure the default token provider with a longer lifespan
            // This affects all tokens including password reset tokens
            services.Configure<DataProtectionTokenProviderOptions>(options =>
            {
                options.TokenLifespan = TimeSpan.FromHours(24); // Set token expiration to 24 hours
            });

            // Configure Identity to use the default email provider for password reset
            services.Configure<IdentityOptions>(options =>
            {
                options.Tokens.PasswordResetTokenProvider = TokenOptions.DefaultProvider;
                options.Tokens.EmailConfirmationTokenProvider = TokenOptions.DefaultProvider;
            });

            // Authentication configuration
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
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ClockSkew = TimeSpan.Zero,

                    NameClaimType = "sub",
                    RoleClaimType = ClaimTypes.Role,
                };
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
                        if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
                        {
                            context.Token = authHeader.Substring("Bearer ".Length).Trim();
                        }
                        return Task.CompletedTask;
                    },

                    OnChallenge = context =>
                    {
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

            // Cloudinary configuration
            services.Configure<CloudinarySettings>(configuration.GetSection("CloudinarySettings"));

            var cloudinaryConfig = configuration.GetSection("CloudinarySettings").Get<CloudinarySettings>();
            var account = new Account(
                cloudinaryConfig.CloudName,
                cloudinaryConfig.ApiKey,
                cloudinaryConfig.ApiSecret
            );

            services.AddSingleton(account);
            services.AddSingleton(new Cloudinary(account));

            // Other services
            services.AddHttpContextAccessor();

            // Repository registrations
            services.AddScoped<IGenericRepository<Book>, Generic<Book>>();
            services.AddScoped<IGenericRepository<Category>, Generic<Category>>();

            // Service registrations
            services.AddScoped<ITokenManagement, TokenManagement>();
            services.AddScoped<IUserManagement, UserManagement>();
            services.AddScoped<IFileUploadService, FileUploadService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddTransient<IClientIpAccessor, HttpContextClientIpAccessor>();


            return services;
        }
    }
}
