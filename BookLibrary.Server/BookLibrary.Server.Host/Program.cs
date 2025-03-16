using BookLibrary.Server.Application.DependencyInjection;
using BookLibrary.Server.Host.Middleware;
using BookLibrary.Server.Infrastructure.DependencyInjection;
using Serilog;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

// Configure Serilog
builder.Host.UseSerilog((context, services, configuration) => configuration
    .ReadFrom.Configuration(context.Configuration)
    .ReadFrom.Services(services)
    .Enrich.FromLogContext());

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5099); // HTTP
    options.ListenAnyIP(7257, listenOptions => listenOptions.UseHttps()); // HTTPS
});

// Add services to the container.
Log.Information("Application is starting");

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles; // Remove $id & $ref
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull; // Ignore nulls
        options.JsonSerializerOptions.WriteIndented = true; // Pretty JSON
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddInfrastructureService(builder.Configuration);
builder.Services.AddApplicationService();

try
{
    var app = builder.Build();

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseAuthentication();
    app.UseMiddleware<ErrorHandlingMiddleware>();
    app.UseHttpsRedirection();
    app.UseAuthorization();
    app.MapControllers();


    Log.Information("Application is running...");

    app.Start(); // Start the app first to get the URLs

    foreach (var url in app.Urls)
    {
        Log.Information($"Server running on {url}");
        Console.WriteLine($"Server running on {url}"); // Print to console
    }

    app.WaitForShutdown();
}
catch (Exception ex)
{
    Console.WriteLine($"Host failed to build: {ex}");
    Log.Error(ex, "Application failed to start");
}
finally
{
    Log.CloseAndFlush();
}
