using BookLibrary.Server.Application.Mapper;
using BookLibrary.Server.Application.Services.Implementation;
using BookLibrary.Server.Application.Services.Interface;
using BookLibrary.Server.Application.Validation.Book;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json.Serialization;

namespace BookLibrary.Server.Application.DependencyInjection
{
    public static class ServiceContainer
    {
        public static IServiceCollection AddApplicationService(this IServiceCollection services)
        {
            services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
            });
            services.AddAutoMapper(typeof(MapperConfig));
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IBookService, BookService>();
            services.AddScoped<IAuthenticationService, AuthenticationService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IValidationService, ValidationService>();
            services.AddValidatorsFromAssemblyContaining<CreateBookValidator>();

            return services;
        }
    }
}
