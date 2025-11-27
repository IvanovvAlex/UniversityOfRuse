FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["BuildingManagement.Web/BuildingManagement.Web.csproj", "BuildingManagement.Web/"]
COPY ["BuildingManagement.Common/BuildingManagement.Common.csproj", "BuildingManagement.Common/"]
COPY ["BuildingManagement.Core/BuildingManagement.Core.csproj", "BuildingManagement.Core/"]
COPY ["Directory.Build.props", "."]
COPY ["Directory.Packages.props", "."]
RUN dotnet restore "BuildingManagement.Web/BuildingManagement.Web.csproj"
COPY . .
WORKDIR "/src/BuildingManagement.Web"
RUN dotnet publish "BuildingManagement.Web.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8081
ENTRYPOINT ["dotnet", "BuildingManagement.Web.dll"]


