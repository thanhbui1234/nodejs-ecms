import { createTokenPair } from '@/auth/authUtil'
import shopModels from '@/models/shop.models'
import { AccessService, SignUpService } from '@/types/services'
import { getInfoData } from '@/utils'
import bcrypt from 'bcrypt'
import crypto from 'node:crypto'
import KeyTokenService from './keyToken.services'
enum RoleShop {
  SHOP = 'SHOP',
  WRITER = 'WRITER',
  EDITOR = 'EDITOR',
  ADMIN = 'ADMIN'
}
class AcessService implements AccessService {
  signUp = async ({ name, email, password }: SignUpService) => {
    try {
      console.log('password', password)
      const holderShop = await shopModels.findOne({ email }).lean()
      if (holderShop) {
        return { code: 'xxx', message: 'Email already exist' }
      }
      /// tham số thứ 2 truyền vào password và số  10 có nghĩa là thuật toán sẽ phực tạp hơn đồng nghiễn với việc tốn cpu giải quyết hơn
      const passwordHash = await bcrypt.hash(password, 10)
      const newShop = await shopModels.create({ name, email, passwordHash, roles: [RoleShop.SHOP] })

      if (newShop) {
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        //public key cryptoGraphy Standar ! tieu chuan cho rsa

        const keyStore = await KeyTokenService.createTokenService({
          userId: newShop._id,
          publicKey,
          privateKey
        })

        if (!keyStore) {
          return { code: 'xxx1', message: 'public key  error' }
        }

        const tokens = await createTokenPair({ userId: newShop._id, email: newShop.email }, publicKey, privateKey)
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
    } catch (error: unknown) {
      return { code: 'xxx', message: `${error}` }
    }
  }
}

export default new AcessService()
