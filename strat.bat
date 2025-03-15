@echo off
echo Starting Project 1...
strat dotnet run --project AspDotNetMVC/AspDotNetMVC.csproj &

echo Starting Project 2...
strat dotnet run --project AspDotNetMVCwithReact.Server/AspDotNetMVCwithReact.Server.csproj &

echo Both projects are running.
