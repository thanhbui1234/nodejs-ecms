export type SignUpService = {
  name: string
  email: string
  password: string
  roles: string[]
}
export interface AccessService {
  signUp: ({ name, email, password, roles }: SignUpService) => Promise<any>
}
