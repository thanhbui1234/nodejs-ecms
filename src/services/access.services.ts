import bcrypt from 'bcrypt'
import crypto from 'crypto'
import shopModels from '@/models/shop.models'
import { AccessService, SignUpService } from '@/types/services'
enum RoleShop {
  SHOP = 'SHOP',
  WRITER = 'WRITER',
  EDITOR = 'EDITOR',
  ADMIN = 'ADMIN'
}
class AcessService implements AccessService {
  signUp = async ({ name, email, password, roles }: SignUpService) => {
    try {
      const holderShop = await shopModels.findOne({ email }).lean()
      if (holderShop) {
        return { code: 'xxx', message: 'Email already exist' }
      }
      /// tham số thứ 2 truyền vào password và số  10 có nghĩa là thuật toán sẽ phực tạp hơn đồng nghiễn với việc tốn cpu giải quyết hơn
      const passwordHash = await bcrypt.hash(password, 10)
      const newShop = await shopModels.create({ name, email, passwordHash, roles: [RoleShop.SHOP] })

      if (newShop) {
        // created private key, publich key
        // publich key dung để verify token // sẽ lưu trong hệ thống
        // private key dung tạo xong sẽ đẩy cho người dùng  , dùng để xài token
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 4096
        })
        console.log('privateKey', privateKey)
        console.log('publicKey', publicKey)
      }
    } catch (error: unknown) {
      return { code: 'xxx', message: 'Internal server error' }
    }
  }
}

export default new AcessService()
