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
  handlerRefreshToken: ({ refreshToken }: { refreshToken: string }) => Promise<any>
}
