import {
  createContainer,
  asClass,
  InjectionMode,
  type AwilixContainer,
} from 'awilix'

// Infrastructure
import { MongoosePatronRepository } from '@/contexts/user/patron/infrastructure/mongoose-patron.repository.js'

// Use Cases
import {
  CreatePatronUseCase,
  GetPatronUseCase,
  UpdatePatronUseCase,
  DeletePatronUseCase,
  ListPatronsUseCase,
} from '@/contexts/user/patron/application/use-cases/index.js'

// Controllers
import { PatronController } from '@/contexts/user/patron/infrastructure/adapters/http/patron.controller.js'

// Types for DI container
export type DIContainer = {
  // Repositories
  patronRepository: MongoosePatronRepository

  // Use Cases
  createPatronUseCase: CreatePatronUseCase
  getPatronUseCase: GetPatronUseCase
  updatePatronUseCase: UpdatePatronUseCase
  deletePatronUseCase: DeletePatronUseCase
  listPatronsUseCase: ListPatronsUseCase

  // Controllers
  patronController: PatronController
}

export function createDIContainer(): AwilixContainer<DIContainer> {
  const container = createContainer<DIContainer>({
    injectionMode: InjectionMode.CLASSIC,
    strict: true,
  })

  // Register repositories
  container.register({
    patronRepository: asClass(MongoosePatronRepository).singleton(),
  })

  // Register use cases
  container.register({
    createPatronUseCase: asClass(CreatePatronUseCase).scoped(),
    getPatronUseCase: asClass(GetPatronUseCase).scoped(),
    updatePatronUseCase: asClass(UpdatePatronUseCase).scoped(),
    deletePatronUseCase: asClass(DeletePatronUseCase).scoped(),
    listPatronsUseCase: asClass(ListPatronsUseCase).scoped(),
  })

  // Register controllers
  container.register({
    patronController: asClass(PatronController).scoped(),
  })

  return container
}

// Export singleton container instance
export const container = createDIContainer()
