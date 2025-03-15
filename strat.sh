#!/bin/bash
echo "Starting Project 1..."
dotnet run --project AspDotNetMVC/AspDotNetMVC.csproj &

echo "Starting Project 2..."
dotnet run --project AspDotNetMVCwithReact.Server/AspDotNetMVCwithReact.Server.csproj &

echo "Both projects are running."
wait