using BookLibrary.Server.Application.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookLibrary.Server.Application.Interface
{
    public interface IFileUploadService
    {
        Task<ServiceResult<string>> UploadFile(IFormFile file, string folder);
        Task<string> UploadFileAsync(IFormFile file, string folder);
        Task<string> GetSignedUrlAsync(string url);
        Task<Boolean> DeleteFileAsync(string url);
        Task<ServiceResult<string>> GetFileUrl(Guid id, string type = "pdf");

        //Task<byte[]> FetchCloudinaryFileAsync(string url);
    }
}
