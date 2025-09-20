import { IPatronRepository } from '@/contexts/user/patron/domain/patron.repository.js'
import { NotFoundError } from '@/shared/errors.js'
import { DeletePatronCommand } from '@/contexts/user/patron/application/dtos/delete-patron.command.js'

import { container } from '@/contexts/user/patron/infrastructure/di/patron.container.js'

export class DeletePatronUseCase {
  private patronRepository: IPatronRepository = container.resolve<IPatronRepository>('patronRepository')

  async execute(command: DeletePatronCommand): Promise<void> {
    const patron = await this.patronRepository.findById(command.id)

    if (!patron) {
      throw new NotFoundError(`Patron with id ${command.id} not found`)
    }

    const deleted = await this.patronRepository.delete(command.id)

    if (!deleted) {
      throw new Error(`Failed to delete patron with id ${command.id}`)
    }
  }
}
