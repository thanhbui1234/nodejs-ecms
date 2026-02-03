// create token

import keyModels from '@/models/key.models'
import { Types } from 'mongoose'
type ID = Types.ObjectId | string

class KeyTokenService {
  static createTokenService = async ({ userId, refreshToken }: { userId: ID; refreshToken: string }) => {
    try {
      const filter = { user: userId }
      const update = {
        refreshTokenUsed: [],
        refreshToken
      }
      const options = { upsert: true, new: true }
      const tokens = await keyModels.findOneAndUpdate(filter, update, options)
      return tokens ? tokens.refreshToken : null
    } catch (error) {
      console.error('Error creating token:', error)
      throw error
    }
  }

  static getTokenService = async ({ userId }: { userId: ID }) => {
    try {
      // ussing TYPES.OBJECTID to avoid casting error
      return await keyModels.findOne({ user: userId }).lean()
    } catch (error) {
      console.error('Error getting token:', error)
      throw error
    }
  }

  static removeTokenService = async ({ keyId }: { keyId: any }) => {
    try {
      return await keyModels.deleteOne({ _id: keyId })
    } catch (error) {
      console.error('Error removing token:', error)
      throw error
    }
  }
  static findByRefreshToken = async ({ refreshToken }: { refreshToken: string }) => {
    return await keyModels.findOne({ refreshToken: refreshToken }).lean()
  }
  static removeTokenUseByUserId = async ({ userId }: { userId: ID }) => {
    return await keyModels.deleteOne({ user: new Types.ObjectId(userId) })
  }
  static findByRefreshTokenUsed = async ({ refreshToken }: { refreshToken: string }) => {
    return await keyModels.findOne({ refreshTokenUsed: refreshToken }).lean()
  }
  static updateRefreshToken = async ({ keyId, refreshToken, oldRefreshToken }: { keyId: ID; refreshToken: string; oldRefreshToken: string }) => {
    return await keyModels.updateOne({ _id: keyId }, { $set: { refreshToken: refreshToken }, $addToSet: { refreshTokenUsed: oldRefreshToken } })
  }
}

export default KeyTokenService
