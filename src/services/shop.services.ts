import { BadRequestError } from "@/core/error.response"
import shopModels from "@/models/shop.models"
import { getInfoData } from "@/utils"
class ShopService {
  
  findByEmailShopService = async ({ email, unCheckEmailFound = false }: { email: string, unCheckEmailFound?: boolean }) => {
      const shop = await shopModels.findOne({ email }).lean()
      if (!shop && !unCheckEmailFound) {
        throw new BadRequestError('Email not found')
      }
      return shop
  }
  createShopService = async ({ name, email, password, roles }: { name: string, email: string, password: string, roles: string[] }) => {
    const newShop = await shopModels.create({ name, email, password, roles })
    if (!newShop) {
      throw new BadRequestError('Failed to create shop')
    }
    return getInfoData({ fields: ['_id', 'name', 'email', 'roles'], object: newShop })
  }
}

export default new ShopService()