import type { IPatronRepository } from '../../domain/repositories/patron/patron.repository.js'
import { Patron } from '../../domain/entities/patron/patron.entity.js'
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
      doc.givenName,
      doc.familyName,
      doc.email,
      doc.role,
      doc.renovationDate,
      doc.endingDate,
    )
  }

  async findAll(): Promise<Patron[]> {
    try {
      const docs = await PatronModel.find().exec()
      return docs.map(doc => this.toDomainEntity(doc))
    } catch (error) {
      throw new DatabaseError(`Failed to find all patrons: ${getErrorMessage(error)}`)
    }
  }

  async findByEmail(email: string): Promise<Patron | null> {
    try {
      const doc = await PatronModel.findOne({ email }).exec()
      return doc ? this.toDomainEntity(doc) : null
    } catch (error) {
      throw new DatabaseError(`Failed to find patron by email: ${getErrorMessage(error)}`)
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

  async create(patronData: Omit<Patron, 'id'>): Promise<Patron> {
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

  async findBySearchTerm(searchTerm: string, options?: {
    page?: number
    limit?: number
    role?: string
    isActive?: boolean
  }): Promise<{ patrons: Patron[], total: number }> {
    try {
      const page = options?.page || 1
      const limit = options?.limit || 10
      const skip = (page - 1) * limit

      // Build query filter
      const filter: Record<string, unknown> = {}

      // Search in givenName, familyName, email, or charge
      if (searchTerm) {
        filter.$or = [
          { givenName: { $regex: searchTerm, $options: 'i' } },
          { familyName: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } },
          { charge: { $regex: searchTerm, $options: 'i' } },
        ]
      }

      // Filter by role
      if (options?.role) {
        filter.role = options.role
      }

      // Filter by active status (based on endingDate)
      if (options?.isActive !== undefined) {
        if (options.isActive) {
          filter.endingDate = { $gte: new Date() }
        } else {
          filter.endingDate = { $lt: new Date() }
        }
      }

      const [docs, total] = await Promise.all([
        PatronModel.find(filter).skip(skip).limit(limit).exec(),
        PatronModel.countDocuments(filter),
      ])

      return {
        patrons: docs.map(doc => this.toDomainEntity(doc)),
        total,
      }
    } catch (error) {
      throw new DatabaseError(`Failed to search patrons: ${getErrorMessage(error)}`)
    }
  }
}
