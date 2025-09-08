# Fundacio Joaquim Molins API

## Overview
A modern Node.js REST API built with TypeScript, Fastify, and Mongoose, implementing **Hexagonal Architecture** and **Domain-Driven Design (DDD)** principles. The API manages patrons and related entities for the Fundacio Joaquim Molins foundation.

### Key Features
- ✅ **Hexagonal Architecture** with clear layer separation
- ✅ **Domain-Driven Design** with rich domain models and value objects
- ✅ **SOLID Principles** compliance with proper abstractions
- ✅ **Named Constructors** for semantic entity creation
- ✅ **Value Objects** with comprehensive business rule validation
- ✅ **CQRS Pattern** with commands and queries
- ✅ **Repository Pattern** with domain interfaces
- ✅ **Error Handling** with domain-specific error types
- ✅ **Dependency Injection** foundation ready for scaling

---

## Project Structure

```
├── src/
│   ├── app.ts                     # Application bootstrap and lifecycle
│   ├── fastify-server.ts          # Fastify server with colored route printing
│   ├── domain/                    # 🏛️ Domain Layer (Business Logic)
│   │   ├── entities/              # Domain entities and aggregates
│   │   │   ├── patron/            # Patron aggregate root
│   │   │   │   ├── patron.entity.ts     # Rich domain entity with business logic
│   │   │   │   ├── patron.interface.ts  # Patron contract
│   │   │   │   └── value-objects/ # Business rule encapsulation
│   │   │   │       ├── email.ts         # Email validation with RFC compliance
│   │   │   │       ├── charge.ts        # Position/charge validation & normalization
│   │   │   │       └── patron-given-name.ts  # Name validation with internationalization
│   │   │   └── user/              # User base concepts and value objects
│   │   │       └── value-objects/
│   │   │           └── role.ts    # Role validation with enum constraints
│   │   ├── repositories/          # Repository interfaces (pure abstractions)
│   │   └── common/                # Domain-specific errors and shared concepts
│   ├── application/               # 🎯 Application Layer (Use Cases & Orchestration)
│   │   ├── use-cases/             # Business workflows implementing CQRS
│   │   │   └── patron/            # Patron-specific use cases
│   │   │       ├── create-patron.use-case.ts   # Patron creation workflow
│   │   │       ├── get-patron.use-case.ts      # Single patron retrieval
│   │   │       ├── update-patron.use-case.ts   # Patron update with validation
│   │   │       ├── delete-patron.use-case.ts   # Safe patron deletion
│   │   │       └── list-patrons.use-case.ts    # Paginated patron listing
│   │   └── dtos/                  # Data Transfer Objects for boundaries
│   │       └── patron/            # Patron commands, queries, and responses
│   ├── infrastructure/            # 🔧 Infrastructure Layer (External Concerns)
│   │   ├── adapters/http/         # REST API with Fastify
│   │   │   ├── patron.controller.ts    # HTTP request/response handling
│   │   │   └── routes/            # Route definitions and validation
│   │   ├── repositories/          # Database implementations
│   │   │   └── patron.repository.ts    # MongoDB/Mongoose implementation
│   │   ├── models/                # Mongoose schemas and documents
│   │   ├── database/              # Connection management with graceful shutdown
│   │   ├── config/                # Environment-based configuration service
│   │   ├── di/                    # 🚀 Dependency Injection Infrastructure (Ready)
│   │   │   ├── container.ts       # Type-safe DI container
│   │   │   ├── factory.ts         # Container factory patterns
│   │   │   └── index.ts           # Clean exports
│   │   ├── common/                # Shared utilities and error handling
│   │   └── lifecycle/             # Application lifecycle and graceful shutdown
│   └── examples/                  # Usage examples and testing patterns
├── index.ts                       # Application entrypoint with environment setup
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration with path mapping
├── eslint.config.js              # ESLint flat config for modern TypeScript
└── .env                          # Environment configuration (gitignored)
```

---

## Architecture Layers

### 🏛️ **Domain Layer** (Pure Business Logic)
**Purpose:** Contains the core business logic, entities, and domain rules without external dependencies.

**Key Components:**
- **`Patron` Entity:** Rich aggregate root with business methods like `isActive()`, `canBeRenewed()`, `renew()`
- **Value Objects:**
  - `Email`: RFC-compliant validation with domain checking
  - `PatronName`: Internationalized name validation with normalization
  - `Charge`: Position validation with smart capitalization
  - `Role`: Enum-based role validation
- **Repository Interfaces:** Pure abstractions defining data contracts
- **Domain Errors:** Business rule violations and validation errors

**Dependencies:** None (completely isolated from infrastructure)

```typescript
// Example: Rich domain behavior
const patron = Patron.create({
  email: "director@fundacio.org",
  givenName: "Maria",
  familyName: "González",
  role: "admin",
  charge: "Executive Director",
  renovationDate: new Date(),
  endingDate: new Date(Date.now() + 4 * 365 * 24 * 60 * 60 * 1000) // 4 years
})

if (patron.canBeRenewed()) {
  const renewed = patron.renew(newEndDate)
}
```

### 🎯 **Application Layer** (Use Cases & Orchestration)
**Purpose:** Orchestrates domain objects to fulfill business workflows without knowing about technical details.

**Key Components:**
- **Use Cases:** Single-responsibility workflows implementing CQRS pattern
- **DTOs:** Clean data contracts for input/output
- **Commands/Queries:** Separate read and write operations

**Dependencies:** Only depends on domain layer abstractions

```typescript
// Example: Use case orchestration
export class CreatePatronUseCase {
  constructor(private patronRepository: IPatronRepository) {}

  async execute(command: CreatePatronCommand): Promise<PatronDto> {
    // 1. Create domain entity with validation
    const patron = Patron.create(command)

    // 2. Check business rules
    const existing = await this.patronRepository.findByEmail(command.email)
    if (existing) throw new ConflictError('Email already exists')

    // 3. Persist and return
    const saved = await this.patronRepository.create(patron)
    return this.toDto(saved)
  }
}
```

### 🔧 **Infrastructure Layer** (Technical Implementation)
**Purpose:** Handles external systems, databases, web frameworks, and technical concerns.

**Key Components:**
- **HTTP Adapters:** Fastify controllers with request/response handling and validation
- **Repository Implementations:** MongoDB/Mongoose data access with error handling
- **Database Models:** Mongoose schemas with indexing and validation
- **Configuration:** Environment-based settings with type safety
- **Dependency Injection:** Foundation ready for scaling (currently manual instantiation)

**Dependencies:** Implements domain interfaces, orchestrates application use cases

---

## 🎨 Domain-Driven Design Implementation

### **Named Constructors Pattern**
```typescript
// Semantic creation methods for different scenarios
const newPatron = Patron.create({...})           // For new entities
const existingPatron = Patron.fromPrimitives({...}) // From database
```

### **Value Objects with Business Rules**
```typescript
// Email with comprehensive validation
const email = new Email("director@fundacio.org")
// Validates: format, domain existence, length, special cases

// Charge with intelligent normalization
const charge = new Charge("executive director")
// Result: "Executive Director" (properly capitalized)

// PatronName with international support
const name = new PatronName("José María")
// Handles: accents, hyphens, apostrophes, length validation
```

### **Repository Pattern Implementation**
```typescript
// Domain defines the contract (abstraction)
export interface IPatronRepository {
  create(patron: Patron): Promise<Patron>
  findByEmail(email: string): Promise<Patron | null>
  findBySearchTerm(term: string, options?: PaginationOptions): Promise<SearchResult>
}

// Infrastructure provides the implementation
export class MongoosePatronRepository implements IPatronRepository {
  async create(patron: Patron): Promise<Patron> {
    const primitives = patron.toPrimitives()  // Convert for persistence
    const doc = new PatronModel(primitives)
    const saved = await doc.save()
    return Patron.fromPrimitives(saved)       // Reconstruct domain entity
  }
}
```

---

## 🛠️ Development & Usage

### **Quick Start**
```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and settings

# 3. Start development server
npm run dev

# 4. Check health
curl http://localhost:3002/healthz
```

### **API Endpoints**
```bash
# Health Check
GET /healthz

# Patron Management
GET    /api/v1/patrons              # List patrons (with pagination & filtering)
POST   /api/v1/patrons              # Create new patron
GET    /api/v1/patrons/:id          # Get specific patron
PUT    /api/v1/patrons/:id          # Update patron
DELETE /api/v1/patrons/:id          # Delete patron
```

### **Example API Usage**
```bash
# Create a new patron
curl -X POST http://localhost:3002/api/v1/patrons \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo.patron@fundacio.org",
    "givenName": "Carmen",
    "familyName": "Rodríguez",
    "role": "patron",
    "charge": "Vocal del Consejo",
    "renovationDate": "2025-01-01",
    "endingDate": "2029-01-01"
  }'

# List patrons with filtering
curl "http://localhost:3002/api/v1/patrons?role=admin&page=1&limit=10"
```

---

## 🧪 Testing Strategy

### **Current Testing Foundation**
The project includes testing infrastructure ready for expansion:

```typescript
// Mock repository for testing
class MockPatronRepository implements IPatronRepository {
  private patrons = new Map<string, Patron>()

  async create(patron: Patron): Promise<Patron> {
    const id = generateId()
    this.patrons.set(id, patron)
    return patron
  }
  // ... other methods
}

// Test with dependency injection
const mockRepo = new MockPatronRepository()
const useCase = new CreatePatronUseCase(mockRepo)
```

### **Testing Layers**
- **Unit Tests:** Test domain entities and value objects in isolation
- **Integration Tests:** Test use cases with real or mock repositories
- **API Tests:** Test HTTP endpoints end-to-end
- **Contract Tests:** Verify repository implementations meet domain contracts

---

## 🔧 Extending the System

### **Adding New Domain Entities**
1. **Create entity:** `src/domain/entities/new-entity/`
2. **Define interface:** Repository abstraction in domain
3. **Implement repository:** MongoDB implementation in infrastructure
4. **Create use cases:** Business workflows in application layer
5. **Add HTTP layer:** Controllers and routes
6. **Register dependencies:** Update DI container when scaling

### **Adding Value Objects**
```typescript
// 1. Create in appropriate domain/entities/.../value-objects/
export class NewValueObject {
  constructor(private readonly value: string) {
    this.validate(value)
  }

  private validate(value: string): void {
    // Business rules validation
    if (!isValid(value)) {
      throw new ValidationError('Invalid value')
    }
  }

  getValue(): string { return this.value }
}

// 2. Use in entities
private _newField: NewValueObject

// 3. Export from index.ts
export { NewValueObject } from './new-value-object.js'
```

---

## 📊 Architecture Benefits

### **Maintainability**
- ✅ **Clear Separation:** Each layer has single responsibility
- ✅ **Business Logic Isolation:** Domain logic independent of technical details
- ✅ **Type Safety:** Comprehensive TypeScript coverage with strict mode

### **Testability**
- ✅ **Dependency Inversion:** Easy to inject mocks and test doubles
- ✅ **Pure Functions:** Value objects and domain methods are easily testable
- ✅ **Isolated Testing:** Each layer can be tested independently

### **Flexibility**
- ✅ **Swappable Implementations:** Easy to change database or web framework
- ✅ **Environment Configuration:** Different settings for dev/staging/production
- ✅ **Extensible Design:** Ready for new features and requirements

### **Scalability**
- ✅ **Modular Architecture:** Independent development of different modules
- ✅ **Team Scaling:** Clear boundaries enable parallel development
- ✅ **Performance Ready:** Mongoose indexes and query optimization

---

## 🚀 Production Considerations

### **Configuration Management**
```typescript
// Environment-based configuration
export class ConfigService {
  get mongoUri(): string { return process.env.MONGODB_URI }
  get port(): number { return parseInt(process.env.PORT || '3000') }
  get isDevelopment(): boolean { return process.env.NODE_ENV === 'development' }
}
```

### **Error Handling**
- **Domain Errors:** Business rule violations with specific error codes
- **Infrastructure Errors:** Database and external service errors
- **HTTP Error Mapping:** Proper status codes and error responses
- **Graceful Degradation:** Fallback strategies for external dependencies

### **Monitoring & Health Checks**
- **Health Endpoint:** `/healthz` with database connection status
- **Structured Logging:** Pino integration with Fastify
- **Graceful Shutdown:** Proper cleanup of database connections
- **Error Tracking:** Ready for APM integration

---

## 📚 Key Patterns & Principles Applied

### **SOLID Principles**
- **S**ingle Responsibility: Each class has one reason to change
- **O**pen/Closed: Extensible without modifying existing code
- **L**iskov Substitution: Implementations are substitutable
- **I**nterface Segregation: Focused, client-specific interfaces
- **D**ependency Inversion: Depend on abstractions, not concretions

### **Domain-Driven Design**
- **Ubiquitous Language:** Domain terms used throughout codebase
- **Bounded Contexts:** Clear module boundaries
- **Aggregates:** Patron as aggregate root with consistency boundaries
- **Value Objects:** Immutable objects representing business concepts
- **Domain Services:** Business logic that doesn't belong to entities

### **Hexagonal Architecture**
- **Ports:** Interfaces defining application boundaries
- **Adapters:** Implementations for external systems
- **Application Core:** Business logic isolated from infrastructure
- **Dependency Direction:** Always pointing inward toward domain

---

## 🔮 Future Enhancements Ready

### **Immediate Extensions**
- **Authentication & Authorization:** JWT-based security
- **Domain Events:** Event sourcing and CQRS evolution
- **Full Dependency Injection:** Activate the DI container for all dependencies
- **Caching:** Redis integration for performance
- **API Versioning:** Backward compatibility strategies

### **Advanced Features**
- **Multi-tenancy:** Organization-based data separation
- **Audit Logging:** Change tracking and compliance
- **Real-time Updates:** WebSocket integration
- **File Management:** Document and image handling
- **Reporting:** Data analytics and business intelligence

---

## 📞 Contact & Contribution

**Development Guidelines:**
1. **Follow Domain-First Design:** Start with domain modeling
2. **Maintain Layer Boundaries:** No cross-layer dependencies
3. **Use Value Objects:** Encapsulate business rules and validation
4. **Write Comprehensive Tests:** Cover business logic thoroughly
5. **Document Business Rules:** Keep domain knowledge explicit
6. **Type Safety First:** Leverage TypeScript for compile-time safety

**Architecture Decisions:**
- **Hexagonal over Layered:** Better testability and flexibility
- **Domain-First over Database-First:** Business logic drives design
- **Explicit over Implicit:** Clear contracts and interfaces
- **Composition over Inheritance:** Favor value objects and composition

For questions, improvements, or contributions, please follow the established patterns and contact the repository maintainer.
├── index.ts                       # Application entrypoint
├── package.json
├── tsconfig.json
└── .env                          # Environment configuration
```

---

## Architecture Layers

### 🏛️ **Domain Layer** (Core Business Logic)
**Purpose:** Contains the business logic, entities, and domain rules.

**Key Components:**
- **Entities:** `Patron` with rich domain behavior and validation
- **Value Objects:** `Email`, `PatronName`, `Charge`, `Role` with business rules
- **Repository Interfaces:** Abstract contracts for data persistence
- **Domain Errors:** Business rule violations and validation errors

**Dependencies:** None (completely isolated)

### 🎯 **Application Layer** (Use Cases & Orchestration)
**Purpose:** Orchestrates domain objects to fulfill business workflows.

**Key Components:**
- **Use Cases:** Business workflows implementing CQRS pattern
- **DTOs:** Data contracts for external communication
- **Commands/Queries:** Input models for different operations

**Dependencies:** Only depends on domain layer interfaces

### 🔧 **Infrastructure Layer** (External Concerns)
**Purpose:** Handles external systems, databases, web frameworks, and dependency injection.

**Key Components:**
- **HTTP Adapters:** Fastify controllers and routes with validation
- **Repository Implementations:** MongoDB/Mongoose data access
- **Database Models:** Mongoose schemas and documents
- **Dependency Injection:** Type-safe container with factory patterns
- **Configuration:** Environment-based settings management

**Dependencies:** Implements domain interfaces, uses application use cases

---

## 🚀 Dependency Injection System

### **Type-Safe DI Container**
```typescript
// Automatic dependency resolution with type safety
const container = DIContainer.getInstance()
const useCases = container.getPatronUseCases()

// Factory pattern for different environments
const testContainer = DIContainerFactory.createTestContainer({
  patronRepository: new MockPatronRepository()
})
```

### **Benefits:**
- ✅ **Type Safety:** Compile-time dependency checking
- ✅ **Testability:** Easy mock injection for unit tests
- ✅ **Flexibility:** Environment-specific configurations
- ✅ **SOLID Compliance:** Proper dependency inversion
- ✅ **Singleton Management:** Shared instances where appropriate

### **Dependency Flow:**
```
Controller → DI Container → Use Cases → Repository Interface → Repository Implementation
```

---

## 🎨 Domain-Driven Design Implementation

### **Rich Domain Models**
```typescript
// Named constructors for different creation scenarios
const patron = Patron.create({
  email: "john@example.com",
  givenName: "John",
  familyName: "Doe",
  role: "patron",
  charge: "President",
  renovationDate: new Date(),
  endingDate: new Date()
})

// Business logic methods
if (patron.canBeRenewed()) {
  const renewedPatron = patron.renew(newEndDate)
}
```

### **Value Objects with Business Rules**
```typescript
// Email validation with business rules
const email = new Email("john@example.com") // Validates format, domain, etc.

// Charge with normalization and validation
const charge = new Charge("President of the Board") // Validates and normalizes
```

### **Repository Pattern**
```typescript
// Domain interface (abstraction)
interface IPatronRepository {
  create(patron: Patron): Promise<Patron>
  findByEmail(email: string): Promise<Patron | null>
}

// Infrastructure implementation
class MongoosePatronRepository implements IPatronRepository {
  // MongoDB-specific implementation
}
```

---

## 🛠️ Development & Usage

### **Environment Setup**
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   # Create .env file with your settings
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/fundacio-molins
   PORT=3002
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

### **API Endpoints**
- `GET /healthz` - Health check
- `GET /api/v1/patrons` - List all patrons
- `POST /api/v1/patrons` - Create new patron
- `GET /api/v1/patrons/:id` - Get patron by ID
- `PUT /api/v1/patrons/:id` - Update patron
- `DELETE /api/v1/patrons/:id` - Delete patron

### **Example Request:**
```bash
curl -X POST http://localhost:3002/api/v1/patrons \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patron@fundacio.org",
    "givenName": "Maria",
    "familyName": "Garcia",
    "role": "patron",
    "charge": "Secretary",
    "renovationDate": "2025-01-01",
    "endingDate": "2029-01-01"
  }'
```

---

## 🧪 Testing Strategy

### **Unit Testing with DI**
```typescript
// Easy mock injection for isolated testing
const mockRepository = new MockPatronRepository()
const container = DIContainerFactory.createTestContainer({
  patronRepository: mockRepository
})
const useCase = container.get('createPatronUseCase')
```

### **Integration Testing**
```typescript
// Test with real database but controlled environment
const container = DIContainerFactory.createProductionContainer()
// Test actual workflows end-to-end
```

---

## 🔧 Extending the System

### **Adding New Entities**
1. Create entity in `src/domain/entities/`
2. Define repository interface in `src/domain/repositories/`
3. Implement repository in `src/infrastructure/repositories/`
4. Create use cases in `src/application/use-cases/`
5. Register dependencies in DI container
6. Add HTTP controllers and routes

### **Adding New Value Objects**
1. Create in appropriate `value-objects/` directory
2. Implement validation and business rules
3. Use domain errors for validation failures
4. Export from `index.ts` for clean imports

### **Configuring Dependencies**
```typescript
// Add to DIContainer.registerDependencies()
this.registerSingleton('newRepository', () => new NewRepositoryImpl())
this.registerSingleton('newUseCase', () =>
  new NewUseCase(this.get('newRepository'))
)
```

---

## 📊 Architecture Benefits

### **Maintainability**
- ✅ Clear separation of concerns
- ✅ Single responsibility principle
- ✅ Easy to locate and modify business logic

### **Testability**
- ✅ Dependency injection enables easy mocking
- ✅ Isolated unit testing of business logic
- ✅ Clear boundaries between layers

### **Flexibility**
- ✅ Easy to swap implementations
- ✅ Environment-specific configurations
- ✅ Plugin-based architecture ready

### **Scalability**
- ✅ Modular design supports team scaling
- ✅ Independent development of layers
- ✅ Easy to add new features and entities

---

## 📚 Key Patterns & Principles

- **Hexagonal Architecture:** Clean separation of concerns
- **Dependency Inversion:** High-level modules don't depend on low-level modules
- **Repository Pattern:** Abstract data access
- **Value Objects:** Encapsulate business rules and validation
- **Named Constructors:** Semantic entity creation methods
- **CQRS:** Separate read and write operations
- **Domain Events:** (Ready for implementation)
- **Factory Pattern:** Flexible object creation

---

## 🚀 Production Considerations

- **Environment Variables:** Use `.env` for configuration
- **Database Connections:** Connection pooling and monitoring
- **Error Handling:** Comprehensive error tracking and logging
- **Health Checks:** Built-in health monitoring at `/healthz`
- **Graceful Shutdown:** Proper resource cleanup on termination
- **Logging:** Structured logging with Pino/Fastify integration

---

## 📞 Contact & Contribution

For questions, improvements, or contributions, please contact the repository maintainer.

### **Development Guidelines:**
1. Follow SOLID principles
2. Maintain clear layer boundaries
3. Use dependency injection for all dependencies
4. Write comprehensive tests
5. Document business rules in domain layer
6. Keep infrastructure concerns separate from business logic
