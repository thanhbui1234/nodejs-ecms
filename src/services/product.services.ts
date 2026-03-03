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
import { convertToBoolean, convertToNumber, getSelectData, removeUndefinedObject, updateNestedObjectParser } from '@/utils'


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

  static async findAllProduct({ limit = 50, page = 1, sort = 'ctime', ...filter }: any) {
    const cleanLimit = convertToNumber(limit) || 50
    const cleanPage = convertToNumber(page) || 1

    // Convert boolean strings in filter
    if (filter.isPublished !== undefined) {
      filter.isPublished = convertToBoolean(filter.isPublished)
    }

    // Remove undefined values to avoid polluting the mongo query
    const cleanFilter = removeUndefinedObject(filter)
    console.log(cleanFilter, 'cleanFilter')

    const select = ['product_name', 'product_price', 'product_thumb']
    const cleanSelect = getSelectData(select)

    return await ProductRepository.findAllProduct({
      limit: cleanLimit,
      page: cleanPage,
      filter: cleanFilter,
      sort,
      select: cleanSelect
    })
  }

  static async findDetailProduct({ product_id }: { product_id: string }) {
    return await ProductRepository.findOneProduct({ product_id })
  }

  static async updateProduct({ product_id, bodyUpdate, type }: { product_id: string, bodyUpdate: any, type?: PRODUCT_TYPE }) {
    let productType = type

    /**
     * @description
     * 1. Nếu không truyền type từ param hoặc body, ta phải query DB để lấy product_type của sản phẩm hiện tại.
     * 2. Việc này giúp hệ thống biết chính xác cần gọi class nào (Clothing, Electronic, Furniture...) để xử lý update.
     */
    if (!productType) {
      const product = await ProductRepository.findOneProduct({ product_id })
      if (!product) throw new BadRequestError('Product not found')
      productType = product.product_type as PRODUCT_TYPE
    }

    const productClass = ProductFactory.productRegistry[productType]
    if (!productClass) throw new BadRequestError(`Invalid Product Types ${productType}`)

    // Khởi tạo instance với bodyUpdate. Lưu ý: ép kiểu any để bypass constructor check nếu bodyUpdate thiếu trường bắt buộc
    return await new productClass(bodyUpdate as any).updateProduct(product_id, bodyUpdate)
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

  // update product
  async updateProduct(productId: string, bodyUpdate: any) {
    return await ProductRepository.updateProductId({ product_id: productId, bodyUpdate, model: ProductModel })
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

  async updateProduct(productId: string, bodyUpdate: any) {
    // 1. Remove attr has null or undefined
    const objectParams = removeUndefinedObject(bodyUpdate)

    // 2. Check where need to update
    if (objectParams.product_attributes) {
      // update child
      await ProductRepository.updateProductId({
        product_id: productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: ClothingModel
      })
    }

    const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
    return updateProduct
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

  async updateProduct(productId: string, bodyUpdate: any) {
    // 1. Remove attr has null or undefined
    const objectParams = removeUndefinedObject(bodyUpdate)

    // 2. Check where need to update
    if (objectParams.product_attributes) {
      // update child
      await ProductRepository.updateProductId({
        product_id: productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: ElectronicModel
      })
    }

    const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
    return updateProduct
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

  async updateProduct(productId: string, bodyUpdate: any) {
    // 1. Remove attr has null or undefined
    const objectParams = removeUndefinedObject(bodyUpdate)

    // 2. Check where need to update
    if (objectParams.product_attributes) {
      // update child
      await ProductRepository.updateProductId({
        product_id: productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: FurnitureModel
      })
    }

    const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
    return updateProduct
  }
}

// Register products


export default ProductFactory