import mongoose, { Schema } from "mongoose";
import { COLLECTION_NAME, DOCUMENT_NAME } from "@/types/const/const";
import { IProduct } from "@/types/product";
import { IClothing } from "@/types/product";
import { IElectronic } from "@/types/product";


const productSchema = new Schema<IProduct>({
  product_name: { type: String, required: true },
  product_thumb: { type: String, required: true },
  product_description: { type: String, required: true },
  product_price: { type: Number, required: true },
  product_quantity: { type: Number, required: true },
  product_type: { type: String, required: true },
  product_shop: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME.SHOP },
  product_attributes: { type: Schema.Types.Mixed, required: true },
}, {
  timestamps: true,
  collection: COLLECTION_NAME.PRODUCT
})

// define child schema 

const clothingSchema = new Schema<IClothing>({
  brand: { type: String, required: true },
  size: { type: String },
  material: { type: String },
  product_shop: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME.SHOP },
}, {
  timestamps: true,
  collection: COLLECTION_NAME.CLOTHING
})

const electronicSchema = new Schema<IElectronic>({
  manufacturer: { type: String, required: true },
  model: { type: String },
  color: { type: String },
  product_shop: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME.SHOP },
}, {
  timestamps: true,
  collection: COLLECTION_NAME.ELECTRONIC
})


export const Clothing = mongoose.model<IClothing>(DOCUMENT_NAME.CLOTHING, clothingSchema)
export const Electronic = mongoose.model<IElectronic>(DOCUMENT_NAME.ELECTRONIC, electronicSchema)
export const Product = mongoose.model<IProduct>(DOCUMENT_NAME.PRODUCT, productSchema)