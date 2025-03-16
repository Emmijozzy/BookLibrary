using AutoMapper;
using BookLibrary.Server.Application.Common;
using BookLibrary.Server.Application.DTOs.Category;
using BookLibrary.Server.Application.Exceptions;
using BookLibrary.Server.Application.Interface;
using BookLibrary.Server.Application.Services.Interface;
using BookLibrary.Server.Domain.Entities;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace BookLibrary.Server.Application.Services.Implementation
{
    public class CategoryService(
        IGenericRepository<Category> categoryInterface,
        IMapper mapper,
        ILogger<CategoryService> logger,
        IValidationService validationService,
        IValidator<CreateCategory> CreateCategoryValidator,
        IValidator<UpdateCategory> UpdateCategoryValidator
        ) : ICategoryService
    {
        public async Task<ServiceResult<Guid>> Create(CreateCategory category)
        {
            if (category == null) throw new ArgumentNullException(nameof(category), "Category data's are required");

            var validationResult = await validationService.validateAsync<CreateCategory>(category, CreateCategoryValidator);
            if (!validationResult.IsSuccess) return ServiceResult<Guid>.Failure(validationResult.Message, validationResult.Errors);

            var mappedData = mapper.Map<Category>(category);
            var repoResult = await categoryInterface.AddAsync(mappedData);

            if (repoResult.Result == Guid.Empty) throw new CategoryOperationException("Category creation failed");

            return ServiceResult<Guid>.Success(repoResult.Result, "Category created Successfully. ");
        }

        public async Task<ServiceResult<IEnumerable<GetCategory>>> GetAll(int? pageNumber, int? pageSize, string? includeProperties)
        {
            var repoResult = await categoryInterface.GetAllAsync(pageNumber: pageNumber, pageSize: pageSize, includeProperties: includeProperties);

            if (repoResult == null || !repoResult.IsSuccess)
                throw new CategoryOperationException("Error while fetching category");

            if (!repoResult.Result.Any())
                throw new NotFoundException("No categories found", repoResult.Result.GetType());

            var mappedData = mapper.Map<IEnumerable<GetCategory>>(repoResult.Result);
            return ServiceResult<IEnumerable<GetCategory>>.Success(mappedData, "Categories fetched Successfully");
        }

        public async Task<ServiceResult<bool>> Delete(Guid id)
        {
            if (id == Guid.Empty) throw new ArgumentException("Category ID is required", nameof(id));

            var fetchedCategory = (await categoryInterface.GetByIdAsync(id, "Books")).Result;
            if (fetchedCategory == null) throw new NotFoundException("Category not found", fetchedCategory.GetType());

            if (fetchedCategory.Books.Any()) throw new CategoryOperationException("Category contains books");

            var repoResult = await categoryInterface.DeleteAsync(id);
            if (repoResult.Result == false || repoResult == null) throw new CategoryOperationException("Category deletion failed");

            return ServiceResult<bool>.Success(repoResult.Result, "Category deleted Successfully");
        }

        public async Task<ServiceResult<GetCategory>> GetById(Guid id, string? includeProperties)
        {
            if (id == Guid.Empty) throw new ArgumentException("Category ID is required", nameof(id));

            var reposResult = await categoryInterface.GetByIdAsync(id, includeProperties);
            if (reposResult == null) throw new CategoryOperationException("Error while fetching Category");

            if (!reposResult.IsSuccess && reposResult.Result == null) throw new NotFoundException("Category not found", reposResult.Result.GetType());

            var mappedData = mapper.Map<GetCategory>(reposResult.Result);
            return ServiceResult<GetCategory>.Success(mappedData, "Category fetched with ID successfully");

        }

        public async Task<ServiceResult<bool>> Update(UpdateCategory category)
        {
            if (category == null) throw new ArgumentNullException(nameof(category), "Category data's are required");

            var validationResult = await validationService.validateAsync<UpdateCategory>(category, UpdateCategoryValidator);
            if (!validationResult.IsSuccess) return ServiceResult<bool>.Failure(validationResult.Message, validationResult.Errors);

            var existingCategory = (await categoryInterface.GetByIdAsync(category.Id)).Result;
            if (existingCategory == null) throw new NotFoundException("Category not found", existingCategory.GetType());

            mapper.Map(category, existingCategory);
            existingCategory.UpdatedAt = DateTime.UtcNow;

            var repoResult = await categoryInterface.UpdateAsync(existingCategory);
            if (repoResult == null || !repoResult!.IsSuccess) throw new CategoryOperationException("Category update failed");
            return ServiceResult<bool>.Success(repoResult.Result, "Category updated Successfully");
        }
    }
}
