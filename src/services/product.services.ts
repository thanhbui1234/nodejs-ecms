import { BadRequestError } from '@/core/error.response'
import { Product as ProductModel, Clothing as ClothingModel, Electronic as ElectronicModel } from '@/models/product.models'
import { PRODUCT_TYPE } from '@/types/const/const'
import { IClothing, IElectronic, IProduct } from '@/types/product'
import { Types } from 'mongoose'

class ProductFactory {
  static createProduct = async (type: PRODUCT_TYPE, payload: IProduct) => {
    switch (type) {
      case PRODUCT_TYPE.CLOTHING:
        return await new Clothing(payload).createProduct()
      case PRODUCT_TYPE.ELECTRONIC:
        return await new Electronic(payload).createProduct()
      default:
        throw new Error(`Invalid Product Types ${type}`)
    }
  }
}

// defined base product class
class Product {
  product_name: string
  product_thumb: string
  product_description: string
  product_price: number
  product_quantity: number
  product_type: string
  product_shop: Types.ObjectId
  product_attributes: IClothing | IElectronic

  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes
  }: IProduct) {
    if (!product_name) throw new BadRequestError('Product name is required')
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
  }

  async createProduct(product_id: Types.ObjectId) {
    return await ProductModel.create({ ...this, _id: product_id })
  }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {

  async createProduct() {
    const newClothing = await ClothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newClothing) throw new BadRequestError('Create new Clothing error')

    const newProduct = await super.createProduct(newClothing._id)
    if (!newProduct) throw new BadRequestError('Create new Product error')

    return newProduct
  }
}

// Define sub-class for different product types Electronic
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await ElectronicModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newElectronic) throw new BadRequestError('Create new Electronic error')

    const newProduct = await super.createProduct(newElectronic._id)
    if (!newProduct) throw new BadRequestError('Create new Product error')

    return newProduct
  }
}

export default ProductFactory