import { type UserType } from '../bot/type/UserType'

class User {
  readonly id: string
  readonly login: string
  readonly password: string
  readonly type: UserType
  readonly servantNameList: string[]

  constructor (id: string, login: string, password: string, type: UserType) {
    this.id = id
    this.login = login
    this.password = password
    this.type = type
    this.servantNameList = []
  }
}

class UserFactory {
  createUser (id: string, login: string, password: string, type: UserType): User {
    return new User(id, login, password, type)
  }
}

