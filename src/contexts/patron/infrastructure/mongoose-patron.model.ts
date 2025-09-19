import mongoose, { Schema, Document, Types } from 'mongoose'

// Mongoose document interface - infrastructure concern
export interface IPatronDocument extends Document {
  _id: Types.ObjectId
  givenName: string
  familyName: string
  email: string
  position: string
  role: string
  renovationDate: Date
  endingDate: Date
  createdAt: Date
  updatedAt: Date
}

// Mongoose schema
const patronSchema = new Schema<IPatronDocument>({
  givenName: {
    type: String,
    trim: true,
  },
  familyName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  position: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    trim: true,
  },
  renovationDate: {
    type: Date,
  },
  endingDate: {
    type: Date,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
  collection: 'patrons',
})

export const PatronModel = mongoose.model<IPatronDocument>('Patron', patronSchema)
