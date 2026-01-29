import { createTokenPair } from '@/auth/authUtil'
import { BadRequestError } from '@/core/error.response'
import shopModels from '@/models/shop.models'
import { AccessService, SignUpService } from '@/types/services'
import { getInfoData } from '@/utils'
import bcrypt from 'bcrypt'
import KeyTokenService from './keyToken.services'
enum RoleShop {
  SHOP = 'SHOP',
  WRITER = 'WRITER',
  EDITOR = 'EDITOR',
  ADMIN = 'ADMIN'
}
class AcessService implements AccessService {
  signUp = async ({ name, email, password }: SignUpService) => {
    const holderShop = await shopModels.findOne({ email }).lean()
    if (holderShop) {
      throw new BadRequestError('Email already exists in the system')
    }
    
    const passwordHash = await bcrypt.hash(password, 10)
    const newShop = await shopModels.create({ name, email, passwordHash, roles: [RoleShop.SHOP] })

    if (newShop) {
      const tokens = await createTokenPair({
        userId: newShop._id,
        email: newShop.email
      })

      const keyStore = await KeyTokenService.createTokenService({
        userId: newShop._id,
        refreshToken: tokens.refreshToken
      })

      if (!keyStore) {
        throw new BadRequestError('Failed to store refresh token')
      }
      console.log('create token success', tokens)
      return {
        code: 201,
        metaData: {
          shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
          tokens
        }
      }
    }
    
    return {
      code: 200,
      metaData: null
    }
  }
}

export default new AcessService()
