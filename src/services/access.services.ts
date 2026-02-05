import { createTokenPair, verifyJWT } from '@/auth/authUtil'
import { BadRequestError, ForbiddenError, UnauthorizedError } from '@/core/error.response'
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
  // check token has used ?
  handlerRefreshToken = async ({ refreshToken, keyStore, user }: { refreshToken: string, keyStore: any, user: any }) => {

    const {userId, email} = user

    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.removeTokenUseByUserId({ userId: userId })
      throw new ForbiddenError('Forbidden error !! pls login again')
    }

    if(keyStore.refreshToken !== refreshToken) {
      await KeyTokenService.removeTokenUseByUserId({ userId: userId })
      throw new UnauthorizedError('Unauthorized error !! pls login again')
    }

    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token is required')
    }

    const foundToken = await KeyTokenService.findByRefreshTokenUsed({ refreshToken: refreshToken })

    if (foundToken) {
      const { userId } = await verifyJWT(refreshToken)
      // xoat token da duoc su dung trong key Store 
      await KeyTokenService.removeTokenUseByUserId({ userId: userId })
      throw new ForbiddenError('Forbidden error !! pls login again')
    }
    // tim token trong key store co ton tai khong 
    const holderToken = await KeyTokenService.findByRefreshToken({ refreshToken: refreshToken })
    if (!holderToken) {
      throw new UnauthorizedError('Shop is not register or not correct 1')
    }

    const foundShop = await ShopService.findByEmailShopService({ email: email })
    if (!foundShop) {
      throw new UnauthorizedError('Shop is not register or not c orrect2 ')
    }
    // create 1 cap token moi 
    const newTokens = await createTokenPair({
      userId: userId,
      email: email
    })

    await KeyTokenService.updateRefreshToken({
      keyId: holderToken._id,
      refreshToken: newTokens.refreshToken,
      oldRefreshToken: refreshToken
    })
    return {
      shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
      tokens: newTokens
    }
  }

  logout = async ({ keyStore }: { keyStore: any }) => {
    const delKey = await KeyTokenService.removeTokenService({ keyId: keyStore })
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
