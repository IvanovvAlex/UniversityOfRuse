FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 5000

ENV ASPNETCORE_URLS=http://0.0.0.0:5000

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY BankAccountManager.sln ./
COPY Directory.Build.props ./
COPY Directory.Packages.props ./
COPY BankAccountManager.Core/ BankAccountManager.Core/
COPY BankAccountManager.Common/ BankAccountManager.Common/
COPY BankAccountManager.Data/ BankAccountManager.Data/
COPY BankAccountManager.Domain/ BankAccountManager.Domain/
COPY BankAccountManager.Api/ BankAccountManager.Api/

RUN dotnet restore BankAccountManager.Api/BankAccountManager.Api.csproj
RUN dotnet build BankAccountManager.Api/BankAccountManager.Api.csproj -c Release -o /app/build

FROM build AS publish
RUN dotnet publish BankAccountManager.Api/BankAccountManager.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BankAccountManager.Api.dll"]


