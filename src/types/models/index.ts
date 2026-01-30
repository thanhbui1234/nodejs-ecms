// enum status {
//   active = 'active',
//   inactive = 'inactive'
// }
import { Types } from 'mongoose'
export interface IShop {
  name: string
  email: string
  password: string
  status: string
  verify: boolean
  roles: string[]
}

export interface IKey {
  user: Types.ObjectId,
  refreshToken: string
  refreshTokenUsed: Types.ObjectId[]
}

export interface IApiKey {
  key: string
  status: boolean
  permissions: string[]
}
