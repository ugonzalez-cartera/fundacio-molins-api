# Fundació Joaquim Molins API

A robust REST API built with hexagonal architecture principles for managing foundation operations and patron information.

## 🏛️ Architecture

This project implements **Hexagonal Architecture** (also known as Ports and Adapters) with **Domain-Driven Design (DDD)** principles:

- **Hexagonal Architecture**: Clean separation between business logic and external concerns
- **Bounded Contexts**: Organized around business domains (patron, meeting, memory)
- **CQRS Pattern**: Clear separation between commands and queries
- **Repository Pattern**: Abstracted data access layer
- **Dependency Injection**: Using Awilix for better testability and modularity

## 🛠️ Technology Stack

### Core Technologies
- **Language**: TypeScript
- **Runtime**: Node.js
- **Web Framework**: Fastify
- **Database**: MongoDB with Mongoose ODM
- **Dependency Injection**: Awilix

### Development & Testing
- **Build Tool**: TSX for development
- **Testing Framework**: Vitest
- **Code Quality**: ESLint with TypeScript support
- **Package Manager**: npm

## 📁 Project Structure

```
src/
├── app/                      # Application orchestration layer
│   ├── app.ts                # Main application class
│   └── tests/                # Application tests
├── contexts/                 # Business domains (Bounded Contexts)
│   ├── patron/              # Patron management domain
│   │   ├── domain/          # Business logic and entities
│   │   ├── application/     # Use cases and DTOs
│   │   └── infrastructure/  # External adapters (DB, HTTP)
│   ├── meeting/             # Meeting management domain
│   └── memory/              # Memory/document domain
└── shared/                  # Shared infrastructure and utilities
    ├── domain/              # Common domain primitives
    ├── infrastructure/      # Shared infrastructure services
    └── errors.ts            # Common error handling
```

## 🎯 Hexagonal Architecture Benefits

- **Testability**: Easy to mock dependencies and write unit tests
- **Maintainability**: Clear separation of concerns
- **Flexibility**: Easy to swap implementations (e.g., database providers)
- **Domain-Centric**: Business logic is independent of external frameworks
- **Scalability**: Well-organized code that grows with business needs

## 🏗️ Architecture Principles

This project follows these key principles:

1. **Business Logic Independence**: Core domain logic doesn't depend on external frameworks
2. **Dependency Inversion**: High-level modules don't depend on low-level modules
3. **Single Responsibility**: Each class and module has one reason to change
4. **Interface Segregation**: Clean contracts between layers
5. **Open/Closed Principle**: Open for extension, closed for modification

## 📊 API Structure

The API follows RESTful conventions with clear resource-based endpoints:

- `/api/v1/patrons` - Patron management
- `/api/v1/meetings` - Meeting operations
- `/api/v1/memories` - Document/memory handling

## 🧪 Testing Strategy

- **Unit Tests**: Domain logic and use cases
- **Integration Tests**: Repository implementations
- **API Tests**: HTTP endpoint validation
- **Configuration Tests**: Environment and setup validation

## 📝 Contributing

This project maintains high code quality standards:
- Follow hexagonal architecture principles
- Write comprehensive tests
- Use TypeScript strictly
- Follow ESLint rules
- Document complex business logic
