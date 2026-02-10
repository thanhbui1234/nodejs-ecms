import { BadRequestError } from '@/core/error.response'
import {
  Product as ProductModel,
  Clothing as ClothingModel,
  Electronic as ElectronicModel,
  Furniture as FurnitureModel
} from '@/models/product.models'
import { PRODUCT_TYPE } from '@/types/const/const'
import { IClothing, IElectronic, IFurniture, IProduct } from '@/types/product'
import { Types } from 'mongoose'
import { ProductRepository } from '@/models/repositories/product.repo'

class ProductFactory {
  static productRegistry: Record<string, typeof Product> = {}

  static registerProduct(type: PRODUCT_TYPE, productClass: typeof Product) {
    ProductFactory.productRegistry[type] = productClass
  }

  static async createProduct(type: PRODUCT_TYPE, payload: IProduct) {
    const productClass = ProductFactory.productRegistry[type]
    if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)
    return await new productClass(payload).createProduct()
  }

  static async findAllDraftpForShop({ product_shop, limit = 50, skip = 0 }: { product_shop: Types.ObjectId, limit?: number, skip?: number }) {
    const query = { product_shop: product_shop, isDraft: true }
    return await ProductRepository.findAllDrafShop({ query, limit, skip })
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }: { product_shop: Types.ObjectId, limit?: number, skip?: number }) {
    const query = { product_shop: product_shop, isPublished: true }
    return await ProductRepository.findAllPublishShop({ query, limit, skip })
  }

  static async publishProductByShop({ product_shop, product_id }: { product_shop: Types.ObjectId, product_id: string }) {
    return await ProductRepository.publishProductByShop({ product_shop, product_id: new Types.ObjectId(product_id) })
  }

  static async unPublishProductByShop({ product_shop, product_id }: { product_shop: Types.ObjectId, product_id: string }) {
    return await ProductRepository.unPublishProductByShop({ product_shop, product_id: new Types.ObjectId(product_id) })
  }

  static async searchProduct({ keySearch }: { keySearch: string }) {
    return await ProductRepository.searchProduct({ keySearch })
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
  product_attributes: IClothing | IElectronic | IFurniture

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

  async createProduct(product_id?: Types.ObjectId) {
    return await ProductModel.create({ ...this, _id: product_id })
  }
}

// Define sub-class for different product types Clothing
export class Clothing extends Product {
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
export class Electronic extends Product {
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

// Define sub-class for different product types Furniture
export class Furniture extends Product {
  async createProduct() {
    const newFurniture = await FurnitureModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newFurniture) throw new BadRequestError('Create new Furniture error')

    const newProduct = await super.createProduct(newFurniture._id)
    if (!newProduct) throw new BadRequestError('Create new Product error')

    return newProduct
  }
}

// Register products


export default ProductFactory