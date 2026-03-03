import { NotFoundError } from '@/core/error.response'
import { Product as ProductModel, Electronic as ElectronicModel, Furniture as FurnitureModel, Clothing as ClothingModel } from '@/models/product.models'
import { unGetSelectData } from '@/utils'
import { Types } from 'mongoose'

const findAllDrafShop = async ({ query, limit, skip, sort }: { query: any, limit: number, skip: number, sort?: string }) => {
    return await queryProduct({ query, limit, skip, sort })
}

const publishProductByShop = async ({ product_shop, product_id }: { product_shop: Types.ObjectId, product_id: Types.ObjectId }) => {
    const foundProduct = await ProductModel.findOne({ _id: product_id, product_shop: product_shop })
    if (!foundProduct) throw new NotFoundError('Product not found')

    const { modifiedCount } = await ProductModel.updateOne(
        { _id: foundProduct._id, product_shop: foundProduct.product_shop },
        {
            $set: {
                isPublished: true,
                isDraft: false
            }
        }
    )

    return modifiedCount
}

const unPublishProductByShop = async ({ product_shop, product_id }: { product_shop: Types.ObjectId, product_id: Types.ObjectId }) => {
    const foundProduct = await ProductModel.findOne({ _id: product_id, product_shop: product_shop })
    if (!foundProduct) throw new NotFoundError('Product not found')

    const { modifiedCount } = await ProductModel.updateOne(
        { _id: foundProduct._id, product_shop: foundProduct.product_shop },
        {
            $set: {
                isPublished: false,
                isDraft: true
            }
        }
    )

    return modifiedCount
}

const findAllPublishShop = async ({ query, limit, skip, sort }: { query: any, limit: number, skip: number, sort?: string }) => {
    return await queryProduct({ query, limit, skip, sort })
}

type SortOrder = Record<string, 1 | -1>

const SORT_MAP: Record<string, SortOrder> = {
    ctime: { _id: -1 }, // newest created first (ObjectId embeds timestamp)
    ctime_asc: { _id: 1 }, // oldest created first
}

const DEFAULT_SORT: SortOrder = { updatedAt: -1 }

const queryProduct = async ({ query, limit, skip, sort, select }: { query: any, limit: number, skip: number, sort?: string, select?: any }) => {
    const sortOrder: SortOrder = sort ? (SORT_MAP[sort] ?? DEFAULT_SORT) : DEFAULT_SORT
    const products = await ProductModel.find(query)
        .sort(sortOrder)
        .skip(skip)
        .limit(limit)
        .select(select)
        .populate('product_shop', 'name email -_id')
        .lean()
    return products
}

const searchProduct = async ({ keySearch }: { keySearch: string }) => {
    const products = await ProductModel.find({
        isPublished: true,
        $text: {
            $search: keySearch
        }
    }, {
        score: { $meta: 'textScore' }
    })
        .sort({ score: { $meta: 'textScore' } })
        .lean()
    return products
}

const findAllProduct = async ({ limit, page, filter, sort, select }: { limit: number, page: number, filter: any, sort?: string, select?: any }) => {
    const skip = (page - 1) * limit
    return await queryProduct({ query: filter, limit, skip, sort, select })
}

const findOneProduct = async ({ product_id }: { product_id: string }) => {
    const unSelect = ['__v']
    const product = await ProductModel.findById(product_id).select(unGetSelectData(unSelect)).lean()
    if (!product) throw new NotFoundError('Product not found')
    return product
}

const updateProductId = async ({ product_id, bodyUpdate, isNew = true, model }: { product_id: string, bodyUpdate: any, isNew?: boolean, model: any }) => {
    return await model.findOneAndUpdate({ _id: product_id }, bodyUpdate, { new: isNew })
}

export const ProductRepository = {
    findAllDrafShop,
    publishProductByShop,
    findAllPublishShop,
    searchProduct,
    unPublishProductByShop,
    findAllProduct,
    findOneProduct,
    updateProductId
}