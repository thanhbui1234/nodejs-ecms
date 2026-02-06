import { Types } from 'mongoose'

export interface IProduct {
  product_name: string
  product_thumb: string
  product_description: string
  product_price: number
  product_quantity: number
  product_type: string
  product_shop: Types.ObjectId
  product_attributes: IClothing | IElectronic
}
export interface IClothing {
  brand: string
  size: string
  material: string
  product_shop: Types.ObjectId
}
export interface IElectronic {
  manufacturer: string
  model: string
  color: string
  product_shop: Types.ObjectId
}

