import { COLECTION_NAME, DOCUMENT_NAME } from '@/types/const/const'
import { IKey } from '@/types/models'
import mongoose, { Schema } from 'mongoose'

// Define the TypeScript interface

// Define the Mongoose schema
const KeySchema = new mongoose.Schema<IKey>(
  {
    user: {
      type: Schema.Types.ObjectId, // Use Schema.Types.ObjectId
      required: true,
      ref: DOCUMENT_NAME.SHOP // Use the ref constant from the constant file
    },
    privateKey: {
      type: String,
      required: true
    },
    publicKey: {
      type: String,
      required: true
    },
    refreshToken: {
      type: [String], // Correctly define the array type as [String]
      default: [],
      required: true
    }
  },
  {
    collection: COLECTION_NAME.KEY, // Use collection name from constant
    timestamps: true
  }
)

// Export the Mongoose model
export default mongoose.model<IKey>(COLECTION_NAME.SHOP, KeySchema)
