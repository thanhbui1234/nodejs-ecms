import { COLLECTION_NAME, DOCUMENT_NAME } from '@/types/const/const'
import { IShop } from '@/types/models'
import mongoose, { Schema } from 'mongoose'
// Declare the Schema of the Mongo model

const shopSchema = new mongoose.Schema<IShop>(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 32
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String
      // required: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false
    },
    roles: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME.SHOP
  }
)

export default mongoose.model(DOCUMENT_NAME.SHOP, shopSchema)
