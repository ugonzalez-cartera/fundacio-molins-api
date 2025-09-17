import {
  createContainer,
  asClass,
  InjectionMode,
  Lifetime,
  type AwilixContainer,
} from 'awilix'

// Infrastructure
import { MongoosePatronRepository } from '@/contexts/patron/infrastructure/mongoose-patron.repository.js'

// Use Cases
import { CreatePatronUseCase } from '@/contexts/patron/application/use-cases/create-patron.use-case.js'
import { GetPatronUseCase } from '@/contexts/patron/application/use-cases/get-patron.use-case.js'
import { UpdatePatronUseCase } from '@/contexts/patron/application/use-cases/update-patron.use-case.js'
import { DeletePatronUseCase } from '@/contexts/patron/application/use-cases/delete-patron.use-case.js'
import { ListPatronsUseCase } from '@/contexts/patron/application/use-cases/list-patrons.use-case.js'

// Controllers
import { PatronController } from '@/contexts/patron/infrastructure/adapters/http/patron.controller.js'

// Types for DI container
export interface DIContainer {
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
    injectionMode: InjectionMode.PROXY,
    strict: true,
  })

  // Register services
  container.register({
    // Repository
    patronRepository: asClass(MongoosePatronRepository, {
      lifetime: Lifetime.SINGLETON,
    }),

    // Use Cases
    createPatronUseCase: asClass(CreatePatronUseCase),
    getPatronUseCase: asClass(GetPatronUseCase),
    updatePatronUseCase: asClass(UpdatePatronUseCase),
    deletePatronUseCase: asClass(DeletePatronUseCase),
    listPatronsUseCase: asClass(ListPatronsUseCase),

    // Controller
    patronController: asClass(PatronController),
  })

  return container
}

// Export singleton container instance
export const container = createDIContainer()
