import mongoose, { Schema } from "mongoose";
import { COLLECTION_NAME, DOCUMENT_NAME } from "@/types/const/const";
import { IFurniture, IProduct } from "@/types/product";
import { IClothing } from "@/types/product";
import { IElectronic } from "@/types/product";
import slugify from "slugify";


const productSchema = new Schema<IProduct>({
  product_name: { type: String, required: true },
  product_thumb: { type: String, required: true },
  product_description: { type: String, required: true },
  product_price: { type: Number, required: true },
  product_quantity: { type: Number, required: true },
  product_type: { type: String, required: true },
  product_shop: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME.SHOP },
  product_slug: { type: String },
  product_attributes: { type: Schema.Types.Mixed, required: true },
  //more
  product_ratingAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must be at most 5'],
    set: (val: number) => Math.round(val * 10) / 10
  },
  product_variations: { type: [Schema.Types.Mixed], default: [] as any[] },
  // when select is false , the field will not be returned in the response if we use find or findOne
  isDraft: { type: Boolean, default: true, index: true, select: false }, // chungs ta se danh index vao truong nay vi no se su dung nhieu nhat
  isPublished: { type: Boolean, default: false, index: true, select: false }, // khi product duoc published thi no se duoc danh index vao truong nay vi no se su dung nhieu nhat

}, {
  timestamps: true,
  collection: COLLECTION_NAME.PRODUCT
})

productSchema.index({ product_name: 'text', product_description: 'text' })
productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true })
  next()
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

const furnitureSchema = new Schema<IFurniture>({
  brand: { type: String, required: true },
  size: { type: String },
  material: { type: String },
  product_shop: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME.SHOP },
}, {
  timestamps: true,
  collection: COLLECTION_NAME.FURNITURE
})

export const Clothing = mongoose.model<IClothing>(DOCUMENT_NAME.CLOTHING, clothingSchema)
export const Electronic = mongoose.model<IElectronic>(DOCUMENT_NAME.ELECTRONIC, electronicSchema)
export const Furniture = mongoose.model<IFurniture>(DOCUMENT_NAME.FURNITURE, furnitureSchema)
export const Product = mongoose.model<IProduct>(DOCUMENT_NAME.PRODUCT, productSchema)