import type { IPatronRepository } from '../../domain/patron/patron.repository.js'
import { Patron } from '../../domain/patron/patron.js'
import { PatronModel, type IPatronDocument } from '../models/patron.model.js'
import {
  getErrorMessage,
  DatabaseError,
  ConflictError,
} from '../common/error-utils.js'

export class MongoosePatronRepository implements IPatronRepository {
  // Convert Mongoose document to domain entity
  private toDomainEntity(doc: IPatronDocument): Patron {
    return new Patron(
      doc.charge,
      doc.name,
      doc.email,
      doc.role,
      doc.renovationDate,
      doc.endingDate,
    )
  }

  async findById(id: string): Promise<Patron | null> {
    try {
      const doc = await PatronModel.findById(id).exec()
      return doc ? this.toDomainEntity(doc) : null
    } catch (error) {
      throw new DatabaseError(`Failed to find patron by id: ${getErrorMessage(error)}`)
    }
  }

  async find(filter: Record<string, unknown> = {}): Promise<Patron[]> {
    try {
      const docs = await PatronModel.find(filter).exec()
      return docs.map(doc => this.toDomainEntity(doc))
    } catch (error) {
      throw new DatabaseError(`Failed to find patrons: ${getErrorMessage(error)}`)
    }
  }

  async findOne(filter: Record<string, unknown>): Promise<Patron | null> {
    try {
      const doc = await PatronModel.findOne(filter).exec()
      return doc ? this.toDomainEntity(doc) : null
    } catch (error) {
      throw new DatabaseError(`Failed to find patron: ${getErrorMessage(error)}`)
    }
  }

  async create(patronData: Omit<Patron, '_id'>): Promise<Patron> {
    try {
      const doc = new PatronModel(patronData)
      const savedDoc = await doc.save()
      return this.toDomainEntity(savedDoc)
    } catch (error) {
      // Check for duplicate key error (MongoDB error code 11000)
      if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
        throw new ConflictError('Patron with this email already exists')
      }
      throw new DatabaseError(`Failed to create patron: ${getErrorMessage(error)}`)
    }
  }

  async update(id: string, patronData: Partial<Patron>): Promise<Patron | null> {
    try {
      const doc = await PatronModel.findByIdAndUpdate(
        id,
        { $set: patronData },
        { new: true, runValidators: true },
      ).exec()

      return doc ? this.toDomainEntity(doc) : null
    } catch (error) {
      throw new DatabaseError(`Failed to update patron: ${getErrorMessage(error)}`)
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await PatronModel.findByIdAndDelete(id).exec()
      return result !== null
    } catch (error) {
      throw new DatabaseError(`Failed to delete patron: ${getErrorMessage(error)}`)
    }
  }
}
