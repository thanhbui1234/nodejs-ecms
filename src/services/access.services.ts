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
    // try {
    const holderShop = await shopModels.findOne({ email }).lean()
    if (holderShop) {
      throw new BadRequestError('Email already exists ')
    }
    /// tham số thứ 2 truyền vào password và số  10 có nghĩa là thuật toán sẽ phực tạp hơn đồng nghiễn với việc tốn cpu giải quyết hơn
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
        return { code: 'xxx1', message: 'Failed to store refresh token' }
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
    // if not create shop
    return {
      code: 200,
      metaData: null
    }
    // } catch (error: unknown) {
    //   return { code: 'xxx', message: `${error}` }
    // }
  }
}

export default new AcessService()
