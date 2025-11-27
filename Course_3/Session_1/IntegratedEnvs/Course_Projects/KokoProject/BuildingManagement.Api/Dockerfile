FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["BuildingManagement.Api/BuildingManagement.Api.csproj", "BuildingManagement.Api/"]
COPY ["BuildingManagement.Data/BuildingManagement.Data.csproj", "BuildingManagement.Data/"]
COPY ["BuildingManagement.Domain/BuildingManagement.Domain.csproj", "BuildingManagement.Domain/"]
COPY ["BuildingManagement.Common/BuildingManagement.Common.csproj", "BuildingManagement.Common/"]
COPY ["BuildingManagement.Core/BuildingManagement.Core.csproj", "BuildingManagement.Core/"]
COPY ["Directory.Build.props", "."]
COPY ["Directory.Packages.props", "."]
RUN dotnet restore "BuildingManagement.Api/BuildingManagement.Api.csproj"
COPY . .
WORKDIR "/src/BuildingManagement.Api"
RUN dotnet publish "BuildingManagement.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "BuildingManagement.Api.dll"]


