import bcrypt from 'bcrypt'
import crypto from 'crypto'
import shopModels from '@/models/shop.models'
import { AccessService, SignUpService } from '@/types/services'
import KeyTokenService from './keyToken.services'
import { createTokenPair } from '@/auth/authUtil'
import { getInfoData } from '@/utils'
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
        // created private key, public key
        // public key dung để verify token // sẽ lưu trong hệ thống
        // private key  tạo xong sẽ đẩy cho người

        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'spki',
            format: 'pem' //
          },
          privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
          }
        })
        //public key cryptoGraphy Standar ! tieu chuan cho rsa

        const publicKeyString = await KeyTokenService.createTokenService({
          userId: newShop._id,
          publicKey
        })
        if (!publicKeyString) {
          return { code: 'xxx1', message: 'public key  error' }
        }

        const publicKeyObject = crypto.createPublicKey(publicKeyString)
        console.log('publicKeyObject', publicKeyObject)

        const tokens = await createTokenPair({ userId: newShop._id, email: newShop.email }, publicKeyObject, privateKey)
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
