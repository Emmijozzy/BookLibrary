// Ignore Spelling: metadata Deconstruct

namespace BookLibrary.Server.Application.Common
{
    public class ServiceResult<T>
    {
        public bool IsSuccess { get; init; }
        public T? Result { get; init; }
        public required string Message { get; init; }
        public object? Metadata { get; private set; } = null;
        public IEnumerable<string>? Errors
        {
            get; init;
        }

        public static ServiceResult<T> Success(T result, string message, object? metadata = null) =>
            new()
            {
                IsSuccess = true,
                Result = result,
                Message = message,
                Metadata = metadata
            };
        public static ServiceResult<T> Failure(string message, IEnumerable<string> errors) =>
            new()
            {
                IsSuccess = false,
                Message = message,
                Errors = errors,
                Metadata = null
            };

        public void Deconstruct(out bool isSuccess, out T? result, out string? message, out object? metadata, out IEnumerable<string>? errors) =>
            (isSuccess, result, message, metadata, errors) = (IsSuccess, Result, Message, Metadata, Errors);
    }
}