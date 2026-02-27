# Sea-Carp

**Perhaps the most insecure .NET based eCommerce platform in the world.**

Sea-Carp is a deliberately vulnerable .NET web application created for security demonstration and training purposes. It simulates a basic eCommerce system with intentional security flaws, serving as a playground for identifying and understanding common web application vulnerabilities. **Not intended for production use under any circumstances.**

## Architecture

Sea-Carp follows a **layered architecture** pattern with clean separation of concerns:

### Layers

1. **SeaCarp.Presentation** (Web UI & API Layer)
   - ASP.NET Core MVC controllers and Razor views
   - REST API endpoints for eCommerce operations
   - Swagger/OpenAPI documentation
   - Session and cookie management

2. **SeaCarp.Application** (Business Logic Layer)
   - Service classes for core operations
   - Background jobs
   - Business rule implementation

3. **SeaCarp.Domain** (Core Domain Layer)
   - Domain models and entities
   - Repository interfaces

4. **SeaCarp.Infrastructure** (Data Access Layer)
   - Repository implementations
   - In-memory database

5. **SeaCarp.CrossCutting** (Shared Services & Utilities)
   - Authentication & JWT handling
   - Cryptography services
   - File operations
   - HTTP client operations
   - Logging and environment information
   - Extension methods and utilities

## Prerequisites

### For Docker
- **Docker**
- **Docker Compose**

### For Local Development
- **.NET 10 SDK**

## Running the Application

### Option 1: Docker

1. **Build and Start with Docker Compose**
   ```bash
   docker compose up --build
   ```

2. **Access the Application**
   - **Web UI:** http://localhost:8080

3. **Stop the Application**
   ```bash
   docker compose down
   ```

### Option 2: Local Development

1. **Clone the Repository**
   ```bash
   git clone https://github.com/antbac/Sea-Carp
   cd SeaCarp
   ```

2. **Restore Dependencies**
   ```bash
   dotnet restore
   ```

3. **Build the Solution**
   ```bash
   dotnet build
   ```

4. **Run the Application**
   ```bash
   dotnet run --project SeaCarp.Presentation/SeaCarp.Presentation.csproj
   ```

5. **Access the Application**
   - **Web UI:** http://localhost:8080

## Important Notes

- This application is **for educational and authorized testing only**
- Do **NOT** deploy this to production or publicly accessible environments
- Use this only in **isolated lab/testing environments**
- All vulnerabilities are intentional and serve educational purposes

---

*For security research, training, and authorized penetration testing only.*