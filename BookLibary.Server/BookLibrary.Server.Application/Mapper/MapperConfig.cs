using AutoMapper;
using BookLibrary.Server.Application.DTOs;
using BookLibrary.Server.Application.DTOs.Book;
using BookLibrary.Server.Application.DTOs.Category;
using BookLibrary.Server.Application.DTOs.User;
using BookLibrary.Server.Domain.Entities;

namespace BookLibrary.Server.Application.Mapper
{
    public class MapperConfig : Profile
    {
        public MapperConfig()
        {
            CreateMap<CreateBook, Book>();
            CreateMap<UpdateBook, Book>();
            CreateMap<CreateCategory, Category>();
            CreateMap<UpdateCategory, Category>();

            CreateMap<Category, GetCategory>()
                .ForMember(dest => dest.Books, opt => opt.MapFrom(src => src.Books))
                .PreserveReferences();

            CreateMap<Book, GetBook>()
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category)) // Map Category
                .PreserveReferences();

            CreateMap<ApplicationUser, UserDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id)); // Map User>
        }
    }
}
