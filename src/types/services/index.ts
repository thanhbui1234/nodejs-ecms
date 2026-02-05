import { IKey } from '../models'
import { Types } from 'mongoose'
export type SignUpService = {
  name: string
  email: string
  password: string
  roles: string[]
}

export interface AccessService {
  signUp: ({ name, email, password, roles }: SignUpService) => Promise<any>
  login: ({ email, password }: { email: string, password: string }) => Promise<any>
  logout: ({ keyStore }: { keyStore: any }) => Promise<any>
  handlerRefreshToken: ({ refreshToken, keyStore, user }: { refreshToken: string, keyStore: IKey, user: Types.ObjectId }) => Promise<any>
}
