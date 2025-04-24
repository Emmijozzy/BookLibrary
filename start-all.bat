@echo off
echo Starting .NET Backend (BookLibrary.Server.Host)...
start dotnet run --project BookLibrary.Server/BookLibrary.Server.Host/BookLibrary.Server.Host.csproj

echo Starting React Frontend...
start cmd /c "cd /d BookLibrary.Client.React && npm run dev"

echo All projects are now running.
exit