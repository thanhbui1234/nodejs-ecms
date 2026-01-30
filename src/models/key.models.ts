import { COLLECTION_NAME, DOCUMENT_NAME } from '@/types/const/const'
import { IKey } from '@/types/models'
import mongoose, { Schema } from 'mongoose'

// Define the TypeScript interface

// Define the Mongoose schema
const KeySchema = new mongoose.Schema<IKey>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: DOCUMENT_NAME.SHOP
    },
    refreshToken: {
      type: String,
      required: true
    },
    refreshTokenUsed: {
      type: [Schema.Types.ObjectId],
      default: []
    },
  },
  {
    collection: COLLECTION_NAME.KEY,
    timestamps: true
  }
)

// Export the Mongoose model
export default mongoose.model<IKey>(DOCUMENT_NAME.KEY, KeySchema)
