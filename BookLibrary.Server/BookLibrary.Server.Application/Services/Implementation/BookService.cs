﻿using AutoMapper;
using BookLibrary.Server.Application.Common;
using BookLibrary.Server.Application.DTOs;
using BookLibrary.Server.Application.DTOs.Book;
using BookLibrary.Server.Application.Exceptions;
using BookLibrary.Server.Application.Interface;
using BookLibrary.Server.Application.Services.Interface;
using BookLibrary.Server.Domain.Entities;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace BookLibrary.Server.Application.Services.Implementation
{
    public class BookService(
        IGenericRepository<Book> bookInterface,
        IGenericRepository<Category> categoryInterface,
        IMapper mapper,
        ILogger<BookService> logger,
        IValidationService validationService,
        IValidator<CreateBook> CreateBookValidator,
        IValidator<UpdateBook> UpdateBookValidator,
        IFileUploadService fileService,
        IHttpContextAccessor httpContextAccessor,
        IUserManagement userManagement
        ) : IBookService
    {

        private async Task<(Guid userId, ApplicationUser user)> GetUserEssential()
        {
            var userIdStr = httpContextAccessor.HttpContext?.User?.FindFirst("Id")?.Value;
            logger.LogInformation("User ID: {UserId} at Create Book service", userIdStr);

            if (string.IsNullOrEmpty(userIdStr))
                throw new PermissionDeniedException("Unauthorized: User ID is missing.");

            Guid userId = Guid.TryParse(userIdStr, out Guid userIdGuid) ? userIdGuid : throw new PermissionDeniedException("Unauthorized: User ID is invalid.");

            var (_, user, _) = await userManagement.GetUserById(userIdStr!);
            if (user == null) throw new NotFoundException("User not found", user!.GetType());

            return (userId, user);
        }

        public async Task<ServiceResult<Guid>> Create(CreateBook book)
        {
            var (userId, user) = await GetUserEssential();

            book.CreatedBy = userId;

            if (book == null) throw new ArgumentNullException(nameof(book), "Book data's are required");

            var validationResult = await validationService.validateAsync<CreateBook>(book, CreateBookValidator);

            if (!validationResult.IsSuccess)
                return ServiceResult<Guid>.Failure(validationResult.Message, validationResult.Errors ?? new[] { "Validation failed" });

            if (book.Image is not null)
            {
                var imageUrl = await fileService.UploadFileAsync(book.Image, "books/images");
                book.ImageUrl = imageUrl;
            }

            if (book.Pdf is not null)
            {
                var pdfUrl = await fileService.UploadFileAsync(book.Pdf, "books/pdfs");
                book.PdfUrl = pdfUrl;
            }

            var category = await categoryInterface.GetByIdAsync(book.CategoryId);
            if (category == null) throw new NotFoundException("Category not found", category!.GetType());

            var mappedData = mapper.Map<Book>(book);
            var repoResult = await bookInterface.AddAsync(mappedData);

            if (repoResult.Result == Guid.Empty) throw new BookOperationException("Book creation failed");

            return ServiceResult<Guid>.Success(repoResult.Result, "Book created Successfully.");
        }

        public async Task<ServiceResult<IEnumerable<GetBook>>> GetBooks(GetBooksQuery query)
        {
            List<Expression<Func<Book, bool>>> filters = new List<Expression<Func<Book, bool>>>();

            var (userId, _) = await GetUserEssential();

            // Add search term filter if provided
            if (!string.IsNullOrEmpty(query.SearchTerm))
            {
                string searchTermLower = query.SearchTerm.ToLower();

                // Replace Contains with EF Core compatible version
                if (!string.IsNullOrEmpty(query.SearchBy))
                {
                    string searchBy = query.SearchBy.ToLower();

                    if (searchBy == "title")
                    {
                        filters.Add(book => book.Title.ToLower().Contains(searchTermLower));
                    }
                    else if (searchBy == "author")
                    {
                        filters.Add(book => book.Author.ToLower().Contains(searchTermLower));
                    }
                    else if (searchBy == "genre")
                    {
                        filters.Add(book => book.Genre!.ToLower().Contains(searchTermLower));
                    }
                    else if (searchBy == "description")
                    {
                        filters.Add(book => book.Description.ToLower().Contains(searchTermLower));
                    }
                    else if (searchBy == "isbn")
                    {
                        filters.Add(book => book.Isbn.ToLower().Contains(searchTermLower));
                    }
                    else if (searchBy == "language")
                    {
                        filters.Add(book => book.Language.ToLower().Contains(searchTermLower));
                    }
                    else if (searchBy == "publisher")
                    {
                        filters.Add(book => book.Publisher.ToLower().Contains(searchTermLower));
                    }
                    else if (searchBy == "isPrivate")
                    {
                        filters.Add(book => book.IsPrivate == (query.IsPrivate ?? false));
                    }
                    else
                    {
                        // Default: search across all fields
                        filters.Add(book =>
                            book.Title.ToLower().Contains(searchTermLower) ||
                            book.Author.ToLower().Contains(searchTermLower) ||
                            (book.Genre != null && book.Genre.ToLower().Contains(searchTermLower)) ||
                            book.Isbn.ToLower().Contains(searchTermLower) ||
                            book.Description.ToLower().Contains(searchTermLower) ||
                            book.Language.ToLower().Contains(searchTermLower) ||
                            book.Publisher.ToLower().Contains(searchTermLower)
                        );
                    }
                }
                else
                {
                    // If no search field specified, search across all fields
                    filters.Add(book =>
                        book.Title.ToLower().Contains(searchTermLower) ||
                        book.Author.ToLower().Contains(searchTermLower) ||
                        (book.Genre != null && book.Genre.ToLower().Contains(searchTermLower)) ||
                        book.Description.ToLower().Contains(searchTermLower) ||
                        book.Language.ToLower().Contains(searchTermLower) ||
                        book.Publisher.ToLower().Contains(searchTermLower)
                    );
                }
            }

            // Add publication date filter if provided
            if (query.PublishedAfter.HasValue)
            {
                filters.Add(book => book.PublicationDate >= query.PublishedAfter.Value);
            }

            // Add genre filter if provided
            if (!string.IsNullOrEmpty(query.Genre))
            {
                filters.Add(book => book.Genre.ToLower() == query.Genre.ToLower());
            }

            // Configure sorting
            Func<IQueryable<Book>, IOrderedQueryable<Book>>? orderBy = null;

            if (!string.IsNullOrEmpty(query.SortBy))
            {
                string sortBy = query.SortBy.ToLower();

                if (sortBy == "title")
                    orderBy = q => q.OrderBy(b => b.Title);
                else if (sortBy == "title_desc")
                    orderBy = q => q.OrderByDescending(b => b.Title);
                else if (sortBy == "author")
                    orderBy = q => q.OrderBy(b => b.Author);
                else if (sortBy == "author_desc")
                    orderBy = q => q.OrderByDescending(b => b.Author);
                else if (sortBy == "published_date")
                    orderBy = q => q.OrderBy(b => b.PublicationDate);
                else if (sortBy == "published_date_desc")
                    orderBy = q => q.OrderByDescending(b => b.PublicationDate);
                else
                    orderBy = q => q.OrderBy(b => b.Title); // Default sorting
            }

            // Get books with pagination and filters
            var repoResult = await bookInterface.GetAllAsync(
                filters,
                orderBy,
                pageNumber: query.PageNumber,
                pageSize: query.PageSize,
                includeProperties: query.IncludeProperties
            );

            if (repoResult == null)
                throw new BookRetrievalException("Error fetching books");

            if (repoResult.Result == null || !repoResult.Result.Any())
                return ServiceResult<IEnumerable<GetBook>>.Success(
                    Enumerable.Empty<GetBook>(),
                    "No books found matching the criteria",
                    new { TotalPages = 0, TotalCount = 0 }
                );

            var getBooks = mapper.Map<IEnumerable<GetBook>>(repoResult.Result);

            // Generate signed URLs for each book
            var booksWithSignedUrls = new List<GetBook>();
            foreach (var book in getBooks)
            {
                if (!string.IsNullOrEmpty(book.ImageUrl))
                {
                    book.ImageUrl = await fileService.GetSignedUrlAsync(book.ImageUrl);
                }

                if (!string.IsNullOrEmpty(book.PdfUrl))
                {
                    book.PdfUrl = await fileService.GetSignedUrlAsync(book.PdfUrl);
                }

                booksWithSignedUrls.Add(book);
            }

            // Get total count for pagination
            var resultCount = await bookInterface.CountAsync(filters);
            if (resultCount == null)
                throw new BookRetrievalException("Error fetching book count");

            var totalCount = resultCount.Result;
            var totalPages = Math.Ceiling((double)totalCount / query.PageSize);

            return ServiceResult<IEnumerable<GetBook>>.Success(
                booksWithSignedUrls,
                "Books fetched successfully",
                new { TotalPages = totalPages, TotalCount = totalCount }
            );
        }

        public async Task<ServiceResult<IEnumerable<GetBook>>> GetAllUsersPublicBooks(GetBooksQuery query)
        {
            List<Expression<Func<Book, bool>>> filters = new List<Expression<Func<Book, bool>>>();
            //Filter out books that are not public
            filters.Add(book => book.IsPrivate == false);


            //Filter Book by userId if exist in query
            if (query.UserId is not null)
            {
                Guid.TryParse(query.UserId, out Guid userId);

                if (userId != Guid.Empty)
                {
                    filters.Add(book => book.CreatedBy == userId);
                }
            }

            // Add search term filter if provided
            if (!string.IsNullOrEmpty(query.SearchTerm))
            {
                string searchTermLower = query.SearchTerm.ToLower();

                // Replace Contains with EF Core compatible version
                if (!string.IsNullOrEmpty(query.SearchBy))
                {
                    string searchBy = query.SearchBy.ToLower();

                    if (searchBy == "title")
                    {
                        filters.Add(book => book.Title.ToLower().Contains(searchTermLower));
                    }
                    else if (searchBy == "author")
                    {
                        filters.Add(book => book.Author.ToLower().Contains(searchTermLower));
                    }
                    else if (searchBy == "genre")
                    {
                        filters.Add(book => book.Genre!.ToLower().Contains(searchTermLower));
                    }
                    else if (searchBy == "description")
                    {
                        filters.Add(book => book.Description.ToLower().Contains(searchTermLower));
                    }
                    else if (searchBy == "isbn")
                    {
                        filters.Add(book => book.Isbn.ToLower().Contains(searchTermLower));
                    }
                    else if (searchBy == "language")
                    {
                        filters.Add(book => book.Language.ToLower().Contains(searchTermLower));
                    }
                    else if (searchBy == "publisher")
                    {
                        filters.Add(book => book.Publisher.ToLower().Contains(searchTermLower));
                    }
                    else if (searchBy == "isPrivate")
                    {
                        filters.Add(book => book.IsPrivate == (query.IsPrivate ?? false));
                    }
                    else
                    {
                        // Default: search across all fields
                        filters.Add(book =>
                            book.Title.ToLower().Contains(searchTermLower) ||
                            book.Author.ToLower().Contains(searchTermLower) ||
                            (book.Genre != null && book.Genre.ToLower().Contains(searchTermLower)) ||
                            book.Isbn.ToLower().Contains(searchTermLower) ||
                            book.Description.ToLower().Contains(searchTermLower) ||
                            book.Language.ToLower().Contains(searchTermLower) ||
                            book.Publisher.ToLower().Contains(searchTermLower)
                        );
                    }
                }
                else
                {
                    // If no search field specified, search across all fields
                    filters.Add(book =>
                        book.Title.ToLower().Contains(searchTermLower) ||
                        book.Author.ToLower().Contains(searchTermLower) ||
                        (book.Genre != null && book.Genre.ToLower().Contains(searchTermLower)) ||
                        book.Description.ToLower().Contains(searchTermLower) ||
                        book.Language.ToLower().Contains(searchTermLower) ||
                        book.Publisher.ToLower().Contains(searchTermLower)
                    );
                }
            }

            // Add publication date filter if provided
            if (query.PublishedAfter.HasValue)
            {
                filters.Add(book => book.PublicationDate >= query.PublishedAfter.Value);
            }

            // Add genre filter if provided
            if (!string.IsNullOrEmpty(query.Genre))
            {
                filters.Add(book => book.Genre.ToLower() == query.Genre.ToLower());
            }

            // Configure sorting
            Func<IQueryable<Book>, IOrderedQueryable<Book>>? orderBy = null;

            if (!string.IsNullOrEmpty(query.SortBy))
            {
                string sortBy = query.SortBy.ToLower();

                if (sortBy == "title")
                    orderBy = q => q.OrderBy(b => b.Title);
                else if (sortBy == "title_desc")
                    orderBy = q => q.OrderByDescending(b => b.Title);
                else if (sortBy == "author")
                    orderBy = q => q.OrderBy(b => b.Author);
                else if (sortBy == "author_desc")
                    orderBy = q => q.OrderByDescending(b => b.Author);
                else if (sortBy == "published_date")
                    orderBy = q => q.OrderBy(b => b.PublicationDate);
                else if (sortBy == "published_date_desc")
                    orderBy = q => q.OrderByDescending(b => b.PublicationDate);
                else
                    orderBy = q => q.OrderBy(b => b.Title); // Default sorting
            }

            // Get books with pagination and filters
            var repoResult = await bookInterface.GetAllAsync(
                filters,
                orderBy,
                pageNumber: query.PageNumber,
                pageSize: query.PageSize,
                includeProperties: query.IncludeProperties
            );

            if (repoResult == null)
                throw new BookRetrievalException("Error fetching books");

            if (repoResult.Result == null || !repoResult.Result.Any())
                return ServiceResult<IEnumerable<GetBook>>.Success(
                    Enumerable.Empty<GetBook>(),
                    "No books found matching the criteria",
                    new { TotalPages = 0, TotalCount = 0 }
                );

            var getBooks = mapper.Map<IEnumerable<GetBook>>(repoResult.Result);

            // Generate signed URLs for each book
            var booksWithSignedUrls = new List<GetBook>();
            foreach (var book in getBooks)
            {
                if (!string.IsNullOrEmpty(book.ImageUrl))
                {
                    book.ImageUrl = await fileService.GetSignedUrlAsync(book.ImageUrl);
                }

                if (!string.IsNullOrEmpty(book.PdfUrl))
                {
                    book.PdfUrl = await fileService.GetSignedUrlAsync(book.PdfUrl);
                }

                booksWithSignedUrls.Add(book);
            }

            // Get total count for pagination
            var resultCount = await bookInterface.CountAsync(filters);
            if (resultCount == null)
                throw new BookRetrievalException("Error fetching book count");

            var totalCount = resultCount.Result;
            var totalPages = Math.Ceiling((double)totalCount / query.PageSize);

            return ServiceResult<IEnumerable<GetBook>>.Success(
                booksWithSignedUrls,
                "Books fetched successfully",
                new { TotalPages = totalPages, TotalCount = totalCount }
            );
        }

        public async Task<ServiceResult<IEnumerable<GetBook>>> GetAllUserBooks(Guid userId, GetBooksQuery query)
        {
            List<Expression<Func<Book, bool>>> filters = new List<Expression<Func<Book, bool>>>();

            if (userId != Guid.Empty)
            {
                filters.Add(book => book.CreatedBy == userId);
            }
            if (query.IsPrivate.HasValue)
            {
                filters.Add(book => book.IsPrivate == (query.IsPrivate ?? false));
            }

            var repoResult = await bookInterface.GetAllAsync(
                filters,
                null,
                pageNumber: query.PageNumber,
                pageSize: query.PageSize,
                includeProperties: query.IncludeProperties
            );

            if (repoResult == null)
                throw new BookRetrievalException("Error fetching books");

            if (repoResult.Result == null || !repoResult.Result.Any())
                return ServiceResult<IEnumerable<GetBook>>.Success(
                    Enumerable.Empty<GetBook>(),
                    "No books found matching the criteria",
                    new { TotalPages = 0, TotalCount = 0 }
                );

            var getBooks = mapper.Map<IEnumerable<GetBook>>(repoResult.Result);

            // Generate signed URLs for each book
            var booksWithSignedUrls = new List<GetBook>();
            foreach (var book in getBooks)
            {
                if (!string.IsNullOrEmpty(book.ImageUrl))
                {
                    book.ImageUrl = await fileService.GetSignedUrlAsync(book.ImageUrl);
                }

                if (!string.IsNullOrEmpty(book.PdfUrl))
                {
                    book.PdfUrl = await fileService.GetSignedUrlAsync(book.PdfUrl);
                }

                booksWithSignedUrls.Add(book);
            }

            // Get total count for pagination
            var resultCount = await bookInterface.CountAsync(filters);
            if (resultCount == null)
                throw new BookRetrievalException("Error fetching book count");

            var totalCount = resultCount.Result;

            return ServiceResult<IEnumerable<GetBook>>.Success(
                booksWithSignedUrls,
                "Books fetched successfully",
                new { TotalCount = totalCount }
            );
        }


        public async Task<ServiceResult<bool>> Delete(Guid id)
        {
            var userIdStr = httpContextAccessor.HttpContext?.User?.FindFirst("Id")?.Value;
            // get roles too and check if in array and Admin is included or is string and is Admin 
            var isAdmin = httpContextAccessor.HttpContext?.User?.IsInRole("Admin") ?? false;

            var (userId, _) = await GetUserEssential();

            if (id == Guid.Empty) throw new ArgumentException("Book ID is required", nameof(id));

            var fetchedBook = (await bookInterface.GetByIdAsync(id)).Result;
            if (fetchedBook == null) throw new NotFoundException("Book not found", fetchedBook!.GetType());

            //Allow to delete only your own books
            if (!isAdmin && fetchedBook.CreatedBy != userId) throw new PermissionDeniedException("You can only delete your own books.");

            if (fetchedBook.ImageUrl is not null)
            {
                await fileService.DeleteFileAsync(fetchedBook.ImageUrl);
            }

            if (fetchedBook.PdfUrl is not null)
            {
                await fileService.DeleteFileAsync(fetchedBook.PdfUrl);
            }

            var repoResult = await bookInterface.DeleteAsync(id);

            if (repoResult.Result == false) throw new BookOperationException("Book deletion failed");
            return ServiceResult<bool>.Success(repoResult.Result, "Book deleted Successfully");
        }

        public async Task<ServiceResult<GetBook>> GetById(Guid id, string? includeProperties = null)
        {

            if (id == Guid.Empty) throw new ArgumentException("Book ID is required", nameof(id));

            var reposResult = await bookInterface.GetByIdAsync(id, includeProperties);
            if (!reposResult.IsSuccess && reposResult.Result == null)
                throw new NotFoundException("Book not found", reposResult.Result!.GetType());

            var mappedData = mapper.Map<GetBook>(reposResult.Result);

            // Generate signed URLs for image and PDF if they exist
            if (!string.IsNullOrEmpty(mappedData.ImageUrl))
            {
                mappedData.ImageUrl = await fileService.GetSignedUrlAsync(mappedData.ImageUrl);
            }

            if (!string.IsNullOrEmpty(mappedData.PdfUrl))
            {
                mappedData.PdfUrl = await fileService.GetSignedUrlAsync(mappedData.PdfUrl);
            }

            return ServiceResult<GetBook>.Success(mappedData, "Book fetched with ID successfully");
        }

        public async Task<ServiceResult<bool>> Update(UpdateBook book)
        {
            var (userId, _) = await GetUserEssential();

            var validationResult = await validationService.validateAsync<UpdateBook>(book, UpdateBookValidator);
            if (!validationResult.IsSuccess) return ServiceResult<bool>.Failure(validationResult.Message, validationResult.Errors! ?? new[] { "Validation failed" });

            var existingBook = (await bookInterface.GetByIdAsync(book.Id)).Result;
            if (existingBook is null)
                throw new NotFoundException("Book not found", typeof(Book));

            // Allow to update only your own books
            if (existingBook.CreatedBy != userId) throw new PermissionDeniedException("You can only update your own books.");

            mapper.Map(book, existingBook);

            if (book.Image is not null)
            {
                if (existingBook.ImageUrl is not null)
                {
                    await fileService.DeleteFileAsync(existingBook.ImageUrl);
                }

                var imageUrl = await fileService.UploadFileAsync(book.Image, "books/images");
                existingBook.ImageUrl = imageUrl;
            }

            if (book.Pdf is not null)
            {
                if (existingBook.PdfUrl is not null)
                {
                    await fileService.DeleteFileAsync(existingBook.PdfUrl);
                }

                var pdfUrl = await fileService.UploadFileAsync(book.Pdf, "books/pdfs");
                existingBook.PdfUrl = pdfUrl;
            }

            existingBook.UpdatedAt = DateTime.Now;

            var repoResult = await bookInterface.UpdateAsync(existingBook);
            if (!repoResult.Result)
                throw new BookOperationException("Book update failed");

            return ServiceResult<bool>.Success(true, "Book updated Successfully");
        }

    }
}
