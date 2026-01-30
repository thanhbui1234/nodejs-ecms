import { createTokenPair } from '@/auth/authUtil'
import { BadRequestError, UnauthorizedError } from '@/core/error.response'
import { AccessService, SignUpService } from '@/types/services'
import { getInfoData } from '@/utils'
import bcrypt from 'bcrypt'
import KeyTokenService from './keyToken.services'
import ShopService from './shop.services'
import { Types } from 'mongoose'
enum RoleShop {
  SHOP = 'SHOP',
  WRITER = 'WRITER',
  EDITOR = 'EDITOR',
  ADMIN = 'ADMIN'
}
class AcessService implements AccessService {
  logout = async ({ keyStore }: { keyStore: any }) => {
    console.log('keysore',keyStore)
    const delKey = await KeyTokenService.removeTokenService({ keyId: keyStore })
    console.log(delKey,'delKey')
    return {
      code: 200,
      metaData: delKey
    }
  }
  login = async ({ email, password }: { email: string, password: string }) => {
    const holderShop = await ShopService.findByEmailShopService({ email })
    if (!holderShop) {
      throw new BadRequestError('Email or password is incorrect')
    }
    const isMatch = await bcrypt.compare(password, holderShop.password)
    
    if (!isMatch) {
      throw new UnauthorizedError('Invalid password')
    }

    const tokens = await createTokenPair({
      userId: holderShop._id,
      email: holderShop.email
    })
    await KeyTokenService.createTokenService({
      userId: holderShop._id,
      refreshToken: tokens.refreshToken
    })

    return {
      shop: getInfoData({ fields: ['_id', 'name', 'email'], object: holderShop }),
      tokens
    }
  }
  signUp = async ({ name, email, password }: SignUpService) => {
    const holderShop = await ShopService.findByEmailShopService({ email, unCheckEmailFound: true })
    if (holderShop) {
      throw new BadRequestError('Email already exists in the system')
    }
    
    const passwordHash = await bcrypt.hash(password, 10)
    const newShop = await ShopService.createShopService({ name, email, password: passwordHash, roles: [RoleShop.SHOP] })

    if (newShop) {
      const tokens = await createTokenPair({
        userId: newShop._id as Types.ObjectId,
        email: newShop.email
      })

      const keyStore = await KeyTokenService.createTokenService({
        userId: newShop._id as Types.ObjectId,
        refreshToken: tokens.refreshToken
      })

      if (!keyStore) {
        throw new BadRequestError('Failed to store refresh token')
      }
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
