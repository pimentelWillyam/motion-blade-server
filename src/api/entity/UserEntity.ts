import type IUser from '../interface/IUserEntity'

class UserEntity implements IUser {
  constructor (id: string, login: string, password: string, email: string, type: string) {
    this.id = id
    this.login = login
    this.password = password
    this.email = email
    this.type = type
  }

  id!: string
  login!: string
  password!: string
  email!: string
  type!: string
}

export default UserEntity
