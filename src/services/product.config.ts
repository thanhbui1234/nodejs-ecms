import ProductFactory from "./product.services"
import { PRODUCT_TYPE } from "@/types/const/const"
import { Clothing } from "./product.services"
import { Electronic } from "./product.services"
import { Furniture } from "./product.services"

ProductFactory.registerProduct(PRODUCT_TYPE.CLOTHING, Clothing)
ProductFactory.registerProduct(PRODUCT_TYPE.ELECTRONIC, Electronic)
ProductFactory.registerProduct(PRODUCT_TYPE.FURNITURE, Furniture)

export default ProductFactory