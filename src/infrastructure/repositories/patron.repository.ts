import type { IPatronRepository } from '../../domain/patron/patron.repository.js'
import { Patron } from '../../domain/patron/patron.js'
import { PatronModel, type IPatronDocument } from '../models/patron.model.js'

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
      throw new Error(`Failed to find patron by id: ${error.message}`)
    }
  }

  async find(filter: Record<string, unknown> = {}): Promise<Patron[]> {
    try {
      const docs = await PatronModel.find(filter).exec()
      return docs.map(doc => this.toDomainEntity(doc))
    } catch (error) {
      throw new Error(`Failed to find patrons: ${error.message}`)
    }
  }

  async findOne(filter: Record<string, unknown>): Promise<Patron | null> {
    try {
      const doc = await PatronModel.findOne(filter).exec()
      return doc ? this.toDomainEntity(doc) : null
    } catch (error) {
      throw new Error(`Failed to find patron: ${error.message}`)
    }
  }

  async create(patronData: Omit<Patron, '_id'>): Promise<Patron> {
    try {
      const doc = new PatronModel(patronData)
      const savedDoc = await doc.save()
      return this.toDomainEntity(savedDoc)
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Patron with this email already exists')
      }
      throw new Error(`Failed to create patron: ${error.message}`)
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
      throw new Error(`Failed to update patron: ${error.message}`)
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await PatronModel.findByIdAndDelete(id).exec()
      return result !== null
    } catch (error) {
      throw new Error(`Failed to delete patron: ${error.message}`)
    }
  }
}
