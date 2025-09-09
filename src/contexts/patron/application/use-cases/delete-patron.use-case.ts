import { IPatronRepository } from '@/contexts/patron/domain/patron.repository.js'
import { NotFoundError } from '@/shared/errors.js'
import { DeletePatronCommand } from '@/contexts/patron/application/dtos/patron/delete-patron.command.js'

export class DeletePatronUseCase {
  constructor(private readonly patronRepository: IPatronRepository) {}

  async execute(command: DeletePatronCommand): Promise<void> {
    const patron = await this.patronRepository.findOne({ id: command.id })

    if (!patron) {
      throw new NotFoundError(`Patron with id ${command.id} not found`)
    }

    const deleted = await this.patronRepository.delete(command.id)

    if (!deleted) {
      throw new Error(`Failed to delete patron with id ${command.id}`)
    }
  }
}
