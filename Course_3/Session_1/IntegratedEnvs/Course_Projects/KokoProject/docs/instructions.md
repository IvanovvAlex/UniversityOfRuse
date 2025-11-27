## Building Management System – Coursework Project Instructions

### 1. Overview

The **Building Management System** is an information system for managing residential buildings, apartments, residents, fee types, and payments. It provides CRUD operations, search, and reporting (including exports to Word and Excel) to support building administrators and property managers.

### 2. Architecture and Projects

The solution is named `BuildingManagement` and uses a clean, layered architecture with multiple projects:

- **BuildingManagement.Web**: ASP.NET Core MVC web application. Contains controllers, views, and view models. Communicates with the API using `HttpClient`. No direct database access.
- **BuildingManagement.Api**: ASP.NET Core Web API. Exposes REST endpoints for buildings, apartments, residents, fee types, payments, search, and reports. Uses Domain services and Common DTOs.
- **BuildingManagement.Domain**: Class library with business logic services and interfaces. Depends on the Data layer for persistence.
- **BuildingManagement.Data**: Class library with EF Core entities and `BuildingManagementDbContext`, including entity configurations and relationships.
- **BuildingManagement.Common**: Class library containing DTOs, request and response models, and shared contracts between API, Web, and Domain.
- **BuildingManagement.Core**: Class library for shared enums, constants, and base types.

### 3. Tech Stack and Dependencies

- **Platform**: .NET 10 SDK (C#).
- **Web Framework**: ASP.NET Core MVC (for `BuildingManagement.Web`).
- **API**: ASP.NET Core Web API (for `BuildingManagement.Api`).
- **Data Access**: Entity Framework Core with PostgreSQL provider.
- **Database**: PostgreSQL (configured via connection string).
- **Reporting**:
  - Excel: ClosedXML or EPPlus (community edition).
  - Word: OpenXML SDK or compatible .docx generator.

NuGet package references for EF Core and reporting libraries will be added in later steps and documented here when configured.

### 4. Running the System

Prerequisites:

- .NET 10 SDK installed (for local non-Docker runs).
- Docker and Docker Compose installed.

Steps (Docker, recommended for coursework):

1. **Clone the repository** to a local folder.
2. From the solution root, run:
   - `./run-with-browser.sh`
3. Wait until the `db`, `api`, and `web` containers are started. The script will automatically open:
   - `http://localhost:8081` (MVC Web UI home page).
   - `http://localhost:8080/scalar` (Scalar API documentation UI).
4. To stop the system, press `Ctrl + C` in the terminal to stop log streaming, then run `docker compose down` if you want to remove containers.

Steps (local development without Docker):

1. Ensure a local PostgreSQL instance is running and the connection string in:
   - `BuildingManagement.Api/appsettings.json` (`ConnectionStrings:DefaultConnection`)
     is adjusted if needed.
2. (Planned) Run EF Core migrations from the `BuildingManagement.Api` or `BuildingManagement.Data` project once migrations are added.
3. Start the API:
   - `dotnet run --project BuildingManagement.Api/BuildingManagement.Api.csproj`
4. Start the Web UI:
   - `dotnet run --project BuildingManagement.Web/BuildingManagement.Web.csproj`
5. Open the browser at the URL shown for the Web project (typically `https://localhost:5001` or similar).

This section will be updated with exact migration and connection details after the data layer and API wiring are implemented.

### 5. Using the System (Planned Features)

The UI will provide:

- CRUD screens for:
  - Buildings
  - Apartments
  - Residents
  - Fee Types
  - Payments
- Search and filtering:
  - Residents by building, apartment, name, and phone.
  - Payments by building, resident, fee type, month, and date range.
- Reporting and export:
  - Residents per building report (Word + Excel export).
  - Monthly payments overview report (Word + Excel export).

Detailed user instructions for each screen will be added after the corresponding features are implemented.

### 6. Assignment Requirements Mapping (Progress)

- **Web-based application using ASP.NET Core MVC**: Implemented project scaffold (`BuildingManagement.Web`).
- **Relational database with minimum 3 tables**: Implemented in `BuildingManagement.Data` with `Buildings`, `Apartments`, `Residents`, `FeeTypes`, and `Payments` entities and relationships in `BuildingManagementDbContext`.
- **CRUD operations for main entities**: Planned in API + Web.
- **Search by different criteria**: Planned (residents and payments search).
- **Export to Word and Excel**: Planned.
- **Use Case diagram**: Will be created in `/docs/usecase-diagram.md`.
- **ER / Database diagram**: Will be created in `/docs/er-diagram.md`.
- **Documentation**: `/docs/instructions.md` created and will be updated after each meaningful change.

This document is kept up to date as the implementation progresses.
