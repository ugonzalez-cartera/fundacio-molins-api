# Fundacio Joaquim Molins API

## Overview
This project is a Node.js REST API built with TypeScript, Fastify, and Mongoose, following Hexagonal Architecture and Domain-Driven Design (DDD) principles. It manages patrons and related entities for the Fundacio Joaquim Molins.

---

## Project Structure

```
├── src/
│   ├── app.ts                # Application entrypoint
│   ├── fastify-server.ts      # Fastify server setup
│   ├── domain/                # Domain layer (entities, value objects, repositories)
│   ├── application/           # Application layer (use cases, DTOs)
│   ├── infrastructure/        # Infrastructure layer (adapters, models, config, db)
│   └── ...
├── index.ts                  # Main entrypoint
├── package.json
├── tsconfig.json
├── .env                      # Environment variables
```

---

## Hexagonal Architecture
- **Domain Layer:** Business logic, entities, value objects, repository interfaces
- **Application Layer:** Use cases (CQRS), DTOs, orchestrates domain logic
- **Infrastructure Layer:** Adapters (HTTP controllers/routes), database models, repository implementations, config

---

## Main Components

### Domain Layer
- `entities/`: Domain entities (e.g., Patron)
- `value-objects/`: Business rule encapsulation (e.g., Email, Charge, PatronRole)
- `repositories/`: Interfaces for persistence

### Application Layer
- `use-cases/`: Application services (CRUD, queries, commands)
- `dtos/`: Data Transfer Objects for API and use case boundaries

### Infrastructure Layer
- `adapters/http/`: Fastify controllers and routes
- `models/`: Mongoose models
- `repositories/`: MongoDB repository implementations
- `config/`: Configuration service
- `database/`: Connection logic

---

## Key Interfaces & Classes

### Patron Entity & Value Objects
- `Patron`: Main aggregate root for patron
- `Email`, `Charge`, `PatronRole`, `PatronName`: Value objects enforcing business rules

### Repository Pattern
- `IPatronRepository`: Interface in domain layer
- `MongoosePatronRepository`: Implementation in infrastructure layer

### Use Cases
- `CreatePatronUseCase`, `ListPatronsUseCase`, `GetPatronUseCase`, `UpdatePatronUseCase`, `DeletePatronUseCase`: Application layer orchestrators

### DTOs
- `PatronDto`: API representation of a Patron
- Command/query DTOs for use case input

### Fastify Server
- `fastify-server.ts`: Configures Fastify, middleware, and registers routes
- Health check endpoint at `/healthz`

---

## Environment & Configuration
- `.env`: Store secrets and config (e.g., DB connection string)
- `dotenv` is used to load environment variables

---

## How to Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up your `.env` file in the project root
3. Start the server:
   ```bash
   npm run dev
   ```
4. Access API endpoints (e.g., `/api/v1/patrons`, `/healthz`)

---

## Extending & Customizing
- Add new entities/value objects in `src/domain/entities/`
- Add new use cases in `src/application/use-cases/`
- Add new routes/controllers in `src/infrastructure/adapters/http/`
- Implement new repository interfaces in `src/infrastructure/repositories/`

---

## Testing & Health
- Health check endpoint: `GET /healthz`
- Use Fastify's built-in logging and error handling

---

## Contact
For questions or contributions, contact the repository owner.
