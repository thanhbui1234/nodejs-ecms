// create token

import keyModels from '@/models/key.models'

class KeyTokenService {
  static createTokenService = async ({ userId, refreshToken }: { userId: any; refreshToken: string }) => {
    try {
      const token = await keyModels.create({
        user: userId,
        refreshToken
      })
      return token ? token.refreshToken : null
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

export default KeyTokenService
