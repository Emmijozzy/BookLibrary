# BookLibrary - Full Stack Application

A digital book library management system with a .NET 8 backend API and React frontend, featuring user authentication, file management, and book operations.

Live Demo: [https://booklibrary-fyic.onrender.com/](https://booklibrary-fyic.onrender.com/)

## 🏗️ Architecture Overview

```
BookLibrary/
├── BookLibrary.Server/                # Backend (.NET 8 API)
│   ├── BookLibrary.Server.Host/       # API Layer & Entry Point
│   ├── BookLibrary.Server.Application/# Business Logic & Services
│   ├── BookLibrary.Server.Domain/     # Entity Models & Interfaces
│   ├── BookLibrary.Server.Infrastructure/ # Data Access & External Services
│   └── MigrationBk/                   # Database Migration Backups
└── BookLibrary.Client/                # Frontend (React + Vite)
```

## 🚀 Features

### Backend Features
- **User Management**: ASP.NET Core Identity with custom ApplicationUser
- **Book Management**: CRUD operations with file upload support
- **Category Management**: Book categorization system
- **File Storage**: Cloudinary integration for images and PDFs
- **Authentication**: JWT token-based authentication with refresh tokens
- **Database**: PostgreSQL with Entity Framework Core
- **Email Services**: Password reset and email verification
- **CORS**: Configured for React frontend at localhost:5173

### Frontend Features
- **React + Vite**: Modern React development setup
- **Authentication**: Login/Register functionality
- **Book Management**: Browse and manage books
- **File Upload**: Image and PDF upload capabilities
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Technology Stack

### Backend
- **.NET 8**: Framework
- **ASP.NET Core**: Web API
- **Entity Framework Core**: ORM with PostgreSQL
- **ASP.NET Core Identity**: Authentication
- **JWT**: Token-based authentication
- **Cloudinary**: File storage service
- **Serilog**: Logging
- **AutoMapper**: Object mapping

### Frontend
- **React 18+**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type-safe JavaScript
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **React Context**: Server state management (if applicable)
- **Tailwind CSS/Material-UI**: Styling framework
- **Formik**: Form management


## 📋 Prerequisites

- .NET 8 SDK
- Node.js 18+ and npm
- PostgreSQL
- Cloudinary account

## ⚙️ Configuration

### Backend Configuration

Configure in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=BookLibrary;Username=your_user;Password=your_password"
  },
  "CloudinarySettings": {
    "CloudName": "your_cloud_name",
    "ApiKey": "your_api_key",
    "ApiSecret": "your_api_secret"
  },
  "Jwt": {
    "Key": "your_secret_key_here",
    "Issuer": "BookLibrary",
    "Audience": "BookLibraryUsers",
    "ExpiryMinutes": 60
  }
}
```

### Frontend Configuration
For development, you may need to update this to point to your local backend:
```typescript
export const API_BASE_URL = "http://localhost:5099/api";
// or for HTTPS
export const API_BASE_URL = "https://localhost:7257/api";
```

## 🚀 Getting Started

### Backend Setup

1. **Clone and Navigate**
```bash
git clone https://github.com/Emmijozzy/BookLibrary.git
cd BookLibrary/BookLibrary.Server
```

2. **Restore Dependencies**
```bash
dotnet restore
```

3. **Update Database**
```bash
dotnet ef database update --project BookLibrary.Server.Infrastructure --startup-project BookLibrary.Server.Host
```

4. **Run Backend**
```bash
dotnet run --project BookLibrary.Server.Host
```

Available at:
- HTTP: `http://localhost:5099`
- HTTPS: `https://localhost:7257`

### Frontend Setup

1. **Navigate to Frontend**
```bash
cd BookLibrary.Client
```

2. **Install Dependencies**
```bash
npm install
```

3. **Start Development Server**
```bash
npm run dev
```

Available at: `http://localhost:5173`

## 📚 API Endpoints

Based on the service interfaces found in the codebase:

### Authentication (`IAuthenticationService`)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/request-reset` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/resend-confirmation` - Resend confirmation email

### Books (`IBookService`)
- `GET /api/books` - Get books with query parameters
- `GET /api/books/public` - Get all users' public books
- `GET /api/books/user/{userId}` - Get all user books
- `GET /api/books/{id}` - Get book by ID
- `POST /api/books` - Create new book
- `PUT /api/books` - Update book
- `DELETE /api/books/{id}` - Delete book

### Categories (`ICategoryService`)
- `GET /api/categories` - Get all categories
- `GET /api/categories/user-books` - Get categories with user books
- `GET /api/categories/public-books` - Get categories with public books
- `GET /api/categories/{id}` - Get category by ID
- `POST /api/categories` - Create category
- `PUT /api/categories` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Users (`IUserService`)
- `GET /api/users` - Get users
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/password` - Update password
- `DELETE /api/users/profile` - Delete account

### Core Entities (from migrations)

- **AspNetUsers**: Extended with FullName property
- **Books**: With Author, CategoryId, ImageUrl, PdfUrl, IsPublic, CreatedBy
- **Categories**: Book categorization
- **RefreshTokens**: JWT refresh token management

### Key Features
- **Soft Delete**: Supported in entities
- **Audit Trail**: CreatedAt, UpdatedAt timestamps
- **User Ownership**: Books linked to creators
- **Public/Private**: Books can be public or private

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: With refresh token support
- **Role-based Access**: Admin and User roles
- **Password Reset**: Secure token-based reset
- **Email Verification**: Account verification system
- **User Ownership**: Users can only modify their own content

### File Security
- **Cloudinary Integration**: Secure file storage
- **Signed URLs**: For secure file access
- **File Cleanup**: Automatic deletion when books are removed

## 📁 File Management

The `IFileUploadService` provides:
- **Image Upload**: Book cover images to "books/images"
- **PDF Upload**: Book content to "books/pdfs"
- **File Deletion**: Cleanup when books are deleted
- **Signed URLs**: Secure file access

## 🔄 Database Migrations

Migration backups stored in `MigrationBk/`:
- `Production/`: Production environment migrations
- `StagingBk/`: Staging environment migrations
- `MinimalIdentityDb/`: Identity-specific migrations
- `SimplifiedAspBookProject -BK/`: Main project migrations

### Creating New Migrations
```bash
dotnet ef migrations add MigrationName --project BookLibrary.Server.Infrastructure --startup-project BookLibrary.Server.Host --context SimplifiedAspBookProject
```

### Project Structure

**Backend:**
```
BookLibrary.Server.Application/
├── Services/
│   ├── Interface/
│   └── Implementation/
├── DTOs/
└── Common/

BookLibrary.Server.Infrastructure/
├── Data/
├── Services/
├── Security/
└── Migrations/

BookLibrary.Server.Host/
├── Controllers/
└── Program.cs
```

**Frontend:**
```
BookLibrary.Client.React/
├── src/
│   ├── constants/
│   │   └── index.ts
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   └── utils/
├── public/
├── package.json
└── README.md
```

**Migration Backups:**
```
MigrationBk/
├── Production/
├── StagingBk/
├── MinimalIdentityDb/
└── SimplifiedAspBookProject -BK/
```

**Root Level:**
```
BookLibrary/
├── BookLibrary.Server/
├── BookLibrary.Client.React/
├── MigrationBk/
├── stop-all.bat
└── README.md
```

### Service Layer

The application uses:
- **Repository Pattern**: For data access
- **Service Layer**: For business logic (`BookService`, `CategoryService`, `AuthenticationService`, `UserService`)
- **Dependency Injection**: Configured in `ServiceContainer`
- **Validation**: Using FluentValidation
- **Mapping**: AutoMapper for DTOs

## 🔧 Configuration Details

### Kestrel Server Configuration
```csharp
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5099); // HTTP
    options.ListenAnyIP(7257, listenOptions => listenOptions.UseHttps()); // HTTPS
});
```

### CORS Configuration
```csharp
options.AddPolicy("AllowReactVite", policy =>
{
    policy.WithOrigins("http://localhost:5099", "https://localhost:7257", "http://localhost:5173")
          .AllowAnyHeader()
          .AllowAnyMethod();
});
```

## 🛑 Stopping the Application

Use the provided batch file:
```bash
stop-all.bat
```

This stops both .NET backend and React frontend processes.

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection**: Verify PostgreSQL is running and connection string is correct
2. **Cloudinary**: Ensure API credentials are properly configured
3. **CORS**: Frontend must run on localhost:5173 for CORS policy
4. **JWT**: Verify JWT key is set in configuration

### Migration Issues
```bash
# Reset database (development only)
dotnet ef database drop --project BookLibrary.Server.Infrastructure --startup-project BookLibrary.Server.Host
dotnet ef database update --project BookLibrary.Server.Infrastructure --startup-project BookLibrary.Server.Host
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, please open an issue in the repository.

---

## 📚 Additional Resources

### Documentation Links
- [.NET 8 Documentation](https://docs.microsoft.com/en-us/dotnet/)
- [React Documentation](https://reactjs.org/docs/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

### Learning Resources
- [Clean Architecture in .NET](https://docs.microsoft.com/en-us/dotnet/architecture/)
- [React Best Practices](https://reactjs.org/docs/thinking-in-react.html)
- [JWT Authentication Guide](https://jwt.io/introduction/)
- [Entity Framework Core Guide](https://docs.microsoft.com/en-us/ef/core/)

### Community & Support
- [Stack Overflow](https://stackoverflow.com/questions/tagged/asp.net-core+react)
- [GitHub Discussions](https://github.com/dotnet/aspnetcore/discussions)
- [React Community](https://reactjs.org/community/support.html)

## 🏆 Acknowledgments

- ASP.NET Core team for the excellent framework
- React team for the powerful frontend library
- Cloudinary for reliable file storage
- PostgreSQL for robust database solution
- Open source community for various packages and tools

---

**Happy Coding! 🚀**

For any questions or issues, please don't hesitate to reach out to the development team or create an issue in the repository.
