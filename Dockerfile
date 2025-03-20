# Use the .NET SDK to build the app
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build-env
WORKDIR /app

# Copy project files and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy the rest of the app and build it
COPY . ./
RUN dotnet publish consumer.csproj -c Release -o out

# Use the ASP.NET runtime to run the app
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build-env /app/out .

# Expose the port
EXPOSE 5098

# Set the entry point
ENTRYPOINT ["dotnet", "consumer.dll"]