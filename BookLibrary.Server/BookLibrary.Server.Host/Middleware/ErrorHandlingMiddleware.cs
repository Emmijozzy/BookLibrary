// Ignore Spelling: Middleware

using BookLibrary.Server.Application.Exceptions;
using BookLibrary.Server.Host.Common;
using BookLibrary.Server.Infrastructure.Exceptions;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;

namespace BookLibrary.Server.Host.Middleware
{
    public class ErrorHandlingMiddleware(
        RequestDelegate next,
        ILogger<ErrorHandlingMiddleware> logger,
        IHostEnvironment environment
        )
    {

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                logger.LogInformation("Request entering ErrorHandlingMiddleware: {Path}", context.Request.Path);
                await next(context);
                logger.LogInformation("Response leaving ErrorHandlingMiddleware: {StatusCode}", context.Response.StatusCode);

                if (context.Response.StatusCode == StatusCodes.Status403Forbidden)
                {
                    await HandleExceptionAsync(context, new PermissionDeniedException("You do not have sufficient permissions to access this resource"));
                }

            }
            catch (Exception ex)
            {
                logger.LogWarning("Exception caught in ErrorHandlingMiddleware: {ExceptionType}", ex.GetType().Name);
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var (statusCode, response) = exception switch
            {
                ValidationException validationEx => (
                    StatusCodes.Status400BadRequest,
                    CreateErrorResponse("VALIDATION_ERROR", validationEx)),

                ArgumentNullException argNullEx => (
                    StatusCodes.Status400BadRequest,
                    CreateErrorResponse("VALIDATION_ERROR", argNullEx)),

                ArgumentException argEx => (
                    StatusCodes.Status400BadRequest,
                    CreateErrorResponse("VALIDATION_ERROR", argEx)),

                SecurityTokenExpiredException tokenExpireEx => (
                     StatusCodes.Status401Unauthorized,
                     CreateErrorResponse("EXPIRED_TOKEN", tokenExpireEx)),

                SecurityTokenValidationException tokenValidationEx => (
                    StatusCodes.Status401Unauthorized,
                    CreateErrorResponse("UNAUTHORIZED", tokenValidationEx)),

                SecurityOperationException securityEx => (
                    StatusCodes.Status401Unauthorized,
                    CreateErrorResponse("UNAUTHORIZED", securityEx)),

                SecurityTokenException tokenEx => (
                    StatusCodes.Status401Unauthorized,
                    CreateErrorResponse("UNAUTHORIZED", tokenEx)),

                UnauthorizedAccessException unauthorizedEx => (
                    StatusCodes.Status401Unauthorized,
                    CreateErrorResponse("UNAUTHORIZED", unauthorizedEx)),

                InvalidPasswordException invalidePasswordEx => (
                    StatusCodes.Status401Unauthorized,
                    CreateErrorResponse("UNAUTHORIZED", invalidePasswordEx)),

                PermissionDeniedException permissionDeniedEx => (
                    StatusCodes.Status403Forbidden,
                    CreateErrorResponse("PERMISSION_DENIED", permissionDeniedEx)),

                UserNotFoundException notFoundEx => (
                    StatusCodes.Status404NotFound,
                    CreateErrorResponse("NOT_FOUND", notFoundEx)),

                KeyNotFoundException keyNotFoundEx => (
                    StatusCodes.Status404NotFound,
                    CreateErrorResponse("NOT_FOUND", keyNotFoundEx)),

                NotFoundException notFoundEx => (
                    StatusCodes.Status404NotFound,
                    CreateErrorResponse("NOT_FOUND", notFoundEx)),

                DbUpdateException dbEx => (
                    StatusCodes.Status409Conflict,
                    CreateErrorResponse("DATABASE_ERROR", dbEx)),

                UserAlreadyExistsException userAlreadyExistsException => (
                    StatusCodes.Status409Conflict,
                    CreateErrorResponse("USER_ALREADY_EXISTS", userAlreadyExistsException)),

                DatabaseOperationException databaseEx => (
                    StatusCodes.Status409Conflict,
                    CreateErrorResponse("DATABASE_ERROR", databaseEx)),

                _ => (
                    StatusCodes.Status500InternalServerError,
                    CreateErrorResponse("INTERNAL_SERVER_ERROR", exception))
            };

            logger.LogError(
                exception,
                    "Request {TraceId} failed with {StatusCode}. Path: {Path}",
                    context.TraceIdentifier,
                    statusCode,
                    context.Request.Path
                );
            context.Response.StatusCode = statusCode;
            await context.Response.WriteAsJsonAsync(response);
        }

        private ApiResponse<object> CreateErrorResponse(string code, Exception ex)
        {
            var metadata = new
            {
                TraceId = Activity.Current?.Id ?? "Unknown",
                Additional = new Dictionary<string, object>
                {
                    ["ServerTime"] = DateTime.UtcNow,
                    ["ErrorType"] = ex.GetType().Name
                }

            };

            if (environment.IsDevelopment())
            {
                metadata.Additional["StackTrace"] = ex!.StackTrace!;
                metadata.Additional["Source"] = ex.Source!;
            }

            // Add custom details for permission denied errors
            if (ex is PermissionDeniedException)
            {
                metadata.Additional["RequiredPermission"] = "Admin";
                metadata.Additional["ResourceType"] = "Book";

                return ApiResponse<object>.Failure(
                    "Access Denied",
                    code,
                    new[] { "You do not have sufficient permissions to access this resource", "This operation requires administrator privileges" },
                    metadata
                );
            }

            return ApiResponse<object>.Failure(
            ex.Message,
            code,
            new[] { ex.Message },
            metadata
            );
        }
    }
}
