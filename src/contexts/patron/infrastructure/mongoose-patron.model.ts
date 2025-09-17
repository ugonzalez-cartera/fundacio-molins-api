import mongoose, { Schema, Document, Types } from 'mongoose'

// Mongoose document interface - infrastructure concern
export interface IPatronDocument extends Document {
  _id: Types.ObjectId  // Mongoose uses _id
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
  position: {
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

export const PatronModel = mongoose.model<IPatronDocument>('Patron', patronSchema)
