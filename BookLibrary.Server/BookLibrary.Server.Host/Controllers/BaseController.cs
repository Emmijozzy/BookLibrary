// Ignore Spelling: metadata

using BookLibrary.BookLibrary.Server.BookLibrary.Server.Host.Extensions;
using BookLibrary.Server.Application.Common;
using BookLibrary.Server.Host.Common;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace BookLibrary.Server.Host.Controllers
{
    public class BaseController(ILogger<BaseController> logger) : ControllerBase
    {
        protected IActionResult LogAndResponse<T>(
            ServiceResult<T> result,
            int successStatusCode = StatusCodes.Status200OK,
            int failureStatusCode = StatusCodes.Status400BadRequest
            )
        {
            var jsonOptions = new JsonSerializerOptions
            {
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
                WriteIndented = true,
                ReferenceHandler = ReferenceHandler.IgnoreCycles
            };
            if (result != null && result.IsSuccess)
            {
                var metadata = result.Metadata != null
                    ? ObjectExtensions.CombineObjects(result.Metadata, new
                    {
                        TraceId = HttpContext.TraceIdentifier,
                        Timestamp = DateTime.UtcNow
                    })
                    : new
                    {
                        TraceId = HttpContext.TraceIdentifier,
                        Timestamp = DateTime.UtcNow
                    };
                var response = ApiResponse<T>.Success(
                    result.Result,
                    result.Message,
                    metadata
                    );

                // Ensure Metadata does not serialize with $id

                if (result.Metadata != null)
                {
                    var accessToken = result.Metadata.GetType().GetProperty("accessToken")?.GetValue(result.Metadata);

                    if (accessToken != null && !string.IsNullOrEmpty(accessToken.ToString()))
                    {
                        Response.Cookies.Append("access_token", accessToken.ToString()!, new CookieOptions
                        {
                            HttpOnly = true,
                            Secure = true,
                            SameSite = SameSiteMode.None,
                            Expires = DateTime.UtcNow.AddDays(7)
                        });
                    }
                }

                logger.LogInformation(
                    "Request {TraceId} completed successfully. Path: {Path}",
                    HttpContext.TraceIdentifier,
                    HttpContext.Request.Path);

                //return StatusCode(successStatusCode, response);
                return new JsonResult(response, jsonOptions) { StatusCode = successStatusCode };
            }
            else
            {
                var failureResponse = ApiResponse<T>.Failure(
                    result?.Message,
                    "OPERATION_FAILED",
                    result?.Errors,
                    new
                    {
                        TraceId = HttpContext.TraceIdentifier,
                        Timestamp = DateTime.UtcNow
                    });

                logger.LogWarning(
                    "Request {TraceId} failed. Path: {Path}, Errors: {Errors}",
                    HttpContext.TraceIdentifier,
                    HttpContext.Request.Path,
                    string.Join(", ", result.Errors ?? Array.Empty<string>())
                );
                //return StatusCode(failureStatusCode, failureResponse);
                return new JsonResult(failureResponse, jsonOptions) { StatusCode = failureStatusCode };
            }
        }
    }
}
