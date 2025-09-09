import mongoose, { Schema, Document } from 'mongoose'
import type { IPatron } from '@/contexts/patron/domain/patron.interface.js'

// Mongoose document interface
export interface IPatronDocument extends IPatron, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
const patronSchema = new Schema<IPatronDocument>({
  givenName: {
    type: String,
    required: true,
    trim: true,
  },
  familyName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  charge: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  renovationDate: {
    type: Date,
    required: true,
  },
  endingDate: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
  collection: 'patrons',
})

// Indexes for better performance
patronSchema.index({ role: 1 })
patronSchema.index({ endingDate: 1 })

// Export the model
export const PatronModel = mongoose.model<IPatronDocument>('Patron', patronSchema)
