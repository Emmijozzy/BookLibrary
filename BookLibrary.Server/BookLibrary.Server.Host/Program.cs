using BookLibrary.Server.Application.DependencyInjection;
using BookLibrary.Server.Host.Middleware;
using BookLibrary.Server.Infrastructure.DependencyInjection;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

// Configure Serilog
if (builder.Environment.IsDevelopment())
{
    builder.Host.UseSerilog((context, services, configuration) => configuration
    .ReadFrom.Configuration(context.Configuration)
    .ReadFrom.Services(services)
    .Enrich.FromLogContext()
    .Enrich.FromLogContext()
    .MinimumLevel.Warning());
}

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5099); // HTTP
    options.ListenAnyIP(7257, listenOptions => listenOptions.UseHttps()); // HTTPS
});

// Add services to the container.
Log.Information("Application is starting");

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactVite", policy =>
    {
        policy.WithOrigins("http://localhost:5099", "https://localhost:7257", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles; // Remove $id & $ref
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull; // Ignore nulls
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.WriteIndented = true; // Pretty JSON
    });


builder.Services.AddMvc();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddInfrastructureService(builder.Configuration);
builder.Services.AddApplicationService();
//disable automatic model validation
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});



try
{
    var app = builder.Build();

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    // app.Use(async (context, next) =>
    // {
    //     var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();

    //     if (!string.IsNullOrEmpty(authHeader))
    //     {
    //         Console.WriteLine($"Authorization Header: {authHeader}");
    //     }

    //     await next();
    // });

    app.UseCors("AllowReactVite");
    // Add this after your CORS configuration
    //app.Use(async (context, next) =>
    //{
    //    Console.WriteLine($"Request from: {context.Request.Headers["Origin"]}");
    //    await next.Invoke();
    //});
    app.UseMiddleware<ErrorHandlingMiddleware>();
    app.UseAuthentication();
    app.UseAuthorization();
    app.UseHttpsRedirection();
    app.MapControllers();

    //app.Use(async (context, next) =>
    //{
    //    Log.Information("Incoming Request: {Method} {Path}", context.Request.Method, context.Request.Path);

    //    context.Request.EnableBuffering();
    //    var reader = new StreamReader(context.Request.Body);
    //    var requestBody = await reader.ReadToEndAsync();
    //    context.Request.Body.Position = 0;
    //    Log.Information("Request Body: {RequestBody}", requestBody);

    //    await next();

    //    Log.Information("Response Status: {StatusCode}", context.Response.StatusCode);
    //});

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
