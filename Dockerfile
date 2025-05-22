# Use ASP.NET runtime for production
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
ENV PORT=10000
EXPOSE 10000
ENV ASPNETCORE_URLS=http://+:10000

# Use SDK to build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ["BookLibrarySolutions.sln", "./"]

# The directory structure in the Docker image must match your local structure
COPY ["BookLibrary.Server/BookLibrary.Server.Application/*.csproj", "./BookLibrary.Server/BookLibrary.Server.Application/"]
COPY ["BookLibrary.Server/BookLibrary.Server.Host/*.csproj", "./BookLibrary.Server/BookLibrary.Server.Host/"]
COPY ["BookLibrary.Server/BookLibrary.Server.Infrastructure/*.csproj", "./BookLibrary.Server/BookLibrary.Server.Infrastructure/"]
COPY ["BookLibrary.Server/BookLibrary.Server.Domain/*.csproj", "./BookLibrary.Server/BookLibrary.Server.Domain/"]


COPY ["BookLibrary.Server/", "./BookLibrary.Server/"]

# Restore dependencies
RUN dotnet restore "BookLibrarySolutions.sln"

# Build and publish the WebApi project
RUN dotnet publish "BookLibrary.Server/BookLibrary.Server.Host/BookLibrary.Server.Host.csproj" -c Release -o /app/publish

# Final stage - runtime image
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "BookLibrary.Server.Host.dll"]