import { COLLECTION_NAME } from '@/types/const/const'
import { IApiKey } from '@/types/models'
import mongoose from 'mongoose'

// Define the TypeScript interface

// Define the Mongoose schema
const ApiKeySchema = new mongoose.Schema<IApiKey>(
  {
    key: {
      type: String,
      required: true
    },
    status: {
      type: Boolean,
      default: true
    },
    permissions: {
      type: [String],
      required: true,
      enum: ['0000', '1111', '2222']
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME.API_KEY // Use collection name from constant
  }
)

// Export the Mongoose model
export default mongoose.model<IApiKey>(COLLECTION_NAME.API_KEY, ApiKeySchema)
