import { IPatronRepository } from '../../../domain/repositories/patron/patron.repository.js'
import { DeletePatronCommand } from '../../dtos/patron/delete-patron.command.js'
import { NotFoundError } from '../../../infrastructure/common/error-utils.js'

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
