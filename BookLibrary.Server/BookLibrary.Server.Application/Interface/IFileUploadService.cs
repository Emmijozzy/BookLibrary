using Microsoft.AspNetCore.Http;

namespace BookLibrary.Server.Application.Interface
{
    public interface IFileUploadService
    {
        Task<string> UploadFileAsync(IFormFile file, string folder);
        Task<string> GetSignedUrlAsync(string url);
        Task<string> GetFileUrlAsync(Guid id, string type);
        Task<byte[]> FetchCloudinaryFileAsync(string url);
    }
}
