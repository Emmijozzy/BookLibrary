@echo off
echo Stopping .NET Backend (BookLibrary.Server.Host)...
taskkill /IM "dotnet.exe" /F

echo Stopping React Frontend...
taskkill /IM "node.exe" /F

echo All projects have been stopped.
exit