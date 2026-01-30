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
      console.log('keyid',keyId)
      return await keyModels.deleteOne({ _id: keyId })
    } catch (error) {
      console.error('Error removing token:', error)
      throw error
    }
  }
} 

export default KeyTokenService
