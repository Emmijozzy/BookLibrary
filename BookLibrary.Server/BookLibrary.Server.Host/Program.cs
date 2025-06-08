using BookLibrary.Server.Application.DependencyInjection;
using BookLibrary.Server.Host.Middleware;
using BookLibrary.Server.Infrastructure.DependencyInjection;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

if (!builder.Environment.IsDevelopment())
{

    builder.WebHost.ConfigureKestrel(options =>
    {
        var port = int.Parse(Environment.GetEnvironmentVariable("PORT") ?? "5000");
        Console.WriteLine($"Server running on http://[::]:{port}");

        // In development, use HTTPS
        if (builder.Environment.IsDevelopment())
        {
            options.ListenAnyIP(port, listenOptions =>
            {
                listenOptions.UseHttps();
            });
        }
        else
        {
            // In production, use HTTP only
            options.ListenAnyIP(port);
        }
    });
}

builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables();

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// Configure Serilog
if (builder.Environment.IsDevelopment())
{
    builder.Host.UseSerilog((context, services, configuration) => configuration
    .ReadFrom.Configuration(context.Configuration)
    .ReadFrom.Services(services)
    .Enrich.FromLogContext()
    .Enrich.FromLogContext()
    //.MinimumLevel.Warning()
    );
}
else
{
    builder.Host.UseSerilog((context, services, configuration) => configuration
    .ReadFrom.Configuration(context.Configuration)
    .ReadFrom.Services(services)
    .Enrich.FromLogContext()
    .Enrich.FromLogContext()
    // .MinimumLevel.Warning()
    );
}

// Configure data protection
if (!builder.Environment.IsDevelopment())
{
    // In production, use a persistent key store
    builder.Services.AddDataProtection()
        .PersistKeysToFileSystem(new DirectoryInfo("/app/keys"))
        .SetApplicationName("BookLibrary");
}

// Add services to the container.
Log.Information("Application is starting");

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactVite", policy =>
    {
        policy.WithOrigins("http://localhost:5099", "https://localhost:7257", "http://localhost:5173", "https://booklibrary-fyic.onrender.com/")
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
    // CORS after routing, before auth
    // Add this after your CORS configuration
    //app.Use(async (context, next) =>
    //{
    //    Console.WriteLine($"Request from: {context.Request.Headers["Origin"]}");
    //    await next.Invoke();
    //});

    if (app.Environment.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }

    // Serve React static files
    app.UseDefaultFiles(); // Looks for index.html
    app.UseStaticFiles();

    app.UseRouting();

    // Order: Exception handling, HTTPS, Static files, Routing, CORS, Auth, Endpoints
    app.UseMiddleware<ErrorHandlingMiddleware>(); // Exception handling should be first
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();

    if (app.Environment.IsDevelopment())
    {
        app.UseHttpsRedirection();
    }

    // Fallback to React index.html for non-API routes
    app.MapFallbackToFile("index.html");

    app.Use(async (context, next) =>
    {
        Log.Information("Incoming Request: {Method} {Path}", context.Request.Method, context.Request.Path);

        context.Request.EnableBuffering();
        var reader = new StreamReader(context.Request.Body);
        var requestBody = await reader.ReadToEndAsync();
        context.Request.Body.Position = 0;
        Log.Information("Request Body: {RequestBody}", requestBody);

        await next();

        Log.Information("Response Status: {StatusCode}", context.Response.StatusCode);
    });

    // Add this after your other middleware registrations
    app.Use(async (context, next) =>
    {
        // Log the incoming request
        Console.WriteLine($"Request: {context.Request.Method} {context.Request.Path}");

        // Capture the original body stream
        var originalBodyStream = context.Response.Body;

        try
        {
            // Create a new memory stream
            using var memoryStream = new MemoryStream();
            context.Response.Body = memoryStream;

            // Continue processing the request
            await next.Invoke();

            // Log the response
            memoryStream.Seek(0, SeekOrigin.Begin);
            var responseBody = await new StreamReader(memoryStream).ReadToEndAsync();
            Console.WriteLine($"Response: {context.Response.StatusCode}, Body: {responseBody.Substring(0, Math.Min(responseBody.Length, 200))}");

            // Copy the response to the original stream
            memoryStream.Seek(0, SeekOrigin.Begin);
            await memoryStream.CopyToAsync(originalBodyStream);
        }
        finally
        {
            // Restore the original stream
            context.Response.Body = originalBodyStream;
        }
    });


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