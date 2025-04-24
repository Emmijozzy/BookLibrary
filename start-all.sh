#!/bin/bash

echo "Starting .NET Backend (BookLibrary.Server.Host)..."
nohup dotnet run --project BookLibrary.Server/BookLibrary.Server.Host/BookLibrary.Server.Host.csproj > backend.log 2>&1 &

echo "Starting React Frontend..."
cd BookLibrary.Client.React && npm install && npm run dev &

echo "All projects are now running."