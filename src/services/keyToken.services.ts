// create token

import keyModels from '@/models/key.models'

class KeyTokenService {
  static createTokenService = async ({
    userId,
    publicKey,
    privateKey
  }: {
    userId: any
    publicKey: any
    privateKey: any
  }) => {
    try {
      // publickey dang la rsa khong the luu duoc vao database nen phai chuyen qua hashstring
      const tokens = await keyModels.create({
        user: userId,
        publicKey,
        privateKey
      })
      return tokens ? tokens.publicKey : null
    } catch (error) {
      console.log(error)
    }
  }
}

export default KeyTokenService
