// Ignore Spelling: Metadata

namespace BookLibrary.Server.Host.Common
{
    public class ApiResponse<T>
    {
        public string Status { get; private set; } = string.Empty;
        public string Code { get; private set; } = string.Empty;
        public string Message { get; private set; } = string.Empty;
        public T Data { get; private set; } = default!;
        public object? Metadata { get; private set; }
        public IEnumerable<string> Errors { get; private set; } = Enumerable.Empty<string>();
        public bool IsSuccess => Status == "Success";

        private ApiResponse() { }

        public static ApiResponse<T> Success(
            T data,
            string message = "Operation completed successfully",
            object? metadata = null
            )
        {
            return new ApiResponse<T>
            {
                Status = "Success",
                Code = "SUCCESS",
                Message = message,
                Data = data,
                Metadata = metadata
            };
        }

        public static ApiResponse<T> Failure(
            string message,
            string code,
            IEnumerable<string> errors,
            object? metadata = null
            )
        {
            return new ApiResponse<T>
            {
                Status = "error",
                Code = code,
                Message = message,
                Errors = errors ?? Enumerable.Empty<string>(),
                Metadata = metadata
            };
        }
    }
}
