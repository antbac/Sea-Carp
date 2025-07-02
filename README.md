# Sea-Carp
Sea Carp: Perhaps the most insecure .NET based eCommerce plattform in the world.

Sea-Carp is a deliberately vulnerable .NET web application created for security demonstration and training purposes. It simulates a basic eCommerce system with intentional security flaws, serving as a playground for identifying and understanding common web application vulnerabilities. Not intended for production use under any circumstances.

## System Overview

Sea-Carp is a .NET web application structured in a layered architecture with the following components:

- **SeaCarp.Presentation**: Web interface layer with MVC controllers, views, and Razor pages
- **SeaCarp.Application**: Business logic, services, and job handlers (including SupportHandlerJob and StockingJob)
- **SeaCarp.Domain**: Core models (User, Product, Order, SupportCase), interfaces, and repository abstractions
- **SeaCarp.Infrastructure**: Data access implementation using SQLite and repository implementations
- **SeaCarp.CrossCutting**: Shared utilities, extensions, and cross-cutting concerns (logging, cryptography, etc.)

### Key Features
- User management and authentication
- Product catalog and ordering system
- Admin dashboard for system management
- Support case handling
- Background jobs for scheduled tasks

### Technology Stack
- ASP.NET Core (.NET 9.0)
- SQLite database
- Docker containerization
- JWT for authentication
- Newtonsoft.Json for JSON handling
- elFinder.Net for file management

## Prerequisites

Before building the solution, install the CycloneDX tool:

```sh
dotnet tool install --global "Tools\CycloneDX"
```

## Running with Docker

The Sea-Carp application can be run using Docker, which simplifies setup and ensures consistent behavior across different environments.

### Prerequisites for Docker
- [Docker](https://www.docker.com/products/docker-desktop/) - Make sure Docker is installed on your machine
- [Docker Compose](https://docs.docker.com/compose/install/) (included in Docker Desktop for Windows/Mac)

### Building and Running with Docker Compose

1. Navigate to the project root folder (where the docker-compose.yml file is located)
2. Run the following command to build and start the application:

```sh
docker compose up --build
```

3. Access the application in your web browser:
   - http://localhost:8080

### Building and Running with Docker Only

If you prefer to use Docker without Docker Compose:

1. Build the Docker image:

```sh
docker build -t seacarp:latest .
```

2. Run the container:

```sh
docker run -d -p 8080:80 --name seacarp-app seacarp:latest
```

3. Access the application in your web browser:
   - http://localhost:8080

### Stopping the Container

To stop and remove the running container:

```sh
docker compose down
```

Or if using Docker directly:

```sh
docker stop seacarp-app
docker rm seacarp-app
```
