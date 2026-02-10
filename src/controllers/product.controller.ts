import { Created, OK } from "@/core/success.reponse"
import { Request, Response } from "express"
import ProductServices from "@/services/product.config"
class ProductController {
  createProduct = async (req: Request, res: Response) => {
    Created.send(res, {
      message: 'Create product success',
      metaData: await ProductServices.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: (req as any).user.userId
      })
    })
  }

  findAllDraftsForShop = async (req: Request, res: Response) => {
    OK.send(res, {
      message: 'Find all drafts for shop success',
      metaData: await ProductServices.findAllDraftpForShop({ product_shop: (req as any).user.userId })
    })
  }

  findAllPublishedForShop = async (req: Request, res: Response) => {
    OK.send(res, {
      message: 'Find all published for shop success',
      metaData: await ProductServices.findAllPublishForShop({ product_shop: (req as any).user.userId })
    })
  }

  publishProductByShop = async (req: Request, res: Response) => {
    OK.send(res, {
      message: 'Publish product success',
      metaData: {
        modifiedCount: await ProductServices.publishProductByShop({ product_shop: (req as any).user.userId, product_id: req.params.id })
      }
    })
  }

  unPublishProductByShop = async (req: Request, res: Response) => {
    OK.send(res, {
      message: 'Unpublish product success',
      metaData: {
        modifiedCount: await ProductServices.unPublishProductByShop({ product_shop: (req as any).user.userId, product_id: req.params.id })
      }
    })
  }

  getListSearchProduct = async (req: Request, res: Response) => {
    OK.send(res, {
      message: 'Get list search product success',
      metaData: await ProductServices.searchProduct({ keySearch: req.params.keySearch })
    })
  }
}

export default new ProductController()