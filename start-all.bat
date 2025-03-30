@echo off
echo Starting .NET Backend (BookLibrary.Server.Host)...
start dotnet run --project BookLibrary.Server/BookLibrary.Server.Host/BookLibrary.Server.Host.csproj

echo Starting React Frontend...
start cmd /c "cd /d BookLibrary.Client.React && npm run dev"

echo Starting .NET MVC Frontend (BooKLibrary.Client.MVC)...
start dotnet run --project BookLibrary.Client.MVC/BooKLibrary.Client.MVC.csproj

echo All projects are now running.
exit