// enum status {
//   active = 'active',
//   inactive = 'inactive'
// }
export interface IShop {
  name: string
  email: string
  password: string
  status: string
  verify: boolean
  roles: string[]
}
