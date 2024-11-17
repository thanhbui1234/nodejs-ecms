// create token

import keyModels from '@/models/key.models'

class KeyTokenService {
  static createTokenService = async ({ userId, publicKey }: { userId: any; publicKey: any }) => {
    try {
      // publickey dang la rsa khong the luu duoc vao database nen phai chuyen qua hashstring
      const publicKeyString = publicKey.toString()
      console.log('publicKeyString', publicKeyString)
      const tokens = await keyModels.create({
        user: userId,
        publicKey: publicKeyString
      })
      console.log('tokens', tokens)
      return tokens ? tokens.publicKey : null
    } catch (error) {
      console.log(error)
    }
  }
}

export default KeyTokenService
