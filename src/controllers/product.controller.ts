import { Created, OK } from "@/core/success.reponse"
import { Request, Response } from "express"
import ProductServices from "@/services/product.services"
class ProductController {
  createProduct = async (req: Request, res: Response) => {
    Created.send(res, {
      message: 'Create product success',
      metaData: await ProductServices.createProduct(req.body.product_type, req.body)
    })
  }
}

export default new ProductController()