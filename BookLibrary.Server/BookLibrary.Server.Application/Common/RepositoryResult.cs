// Ignore Spelling: Deconstruct

namespace BookLibrary.Server.Application.Common
{
    public class RepositoryResult<T>
    {
        public bool IsSuccess { get; private set; }
        public T? Result { get; private set; }
        public string? ErrorMessage { get; set; }

        private RepositoryResult(bool success, T? result, string? errorMessage)
        {
            IsSuccess = success;
            Result = result;
            ErrorMessage = errorMessage;
        }

        public static RepositoryResult<T> Success(T result) =>
            new RepositoryResult<T>(true, result, null);

        public static RepositoryResult<T> Failure(string errorMessage) =>
            new RepositoryResult<T>(false, default, errorMessage);

        public void Deconstruct(out bool isSuccess, out T? result, out string? errorMessage) =>
            (isSuccess, result, errorMessage) = (IsSuccess, Result, ErrorMessage);
    }
}
