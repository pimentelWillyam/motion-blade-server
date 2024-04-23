import { type UserType } from '../bot/type/UserType'

class Master {
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

class MasterFactory {
  createMaster (id: string, login: string, password: string, type: UserType): Master {
    return new Master(id, login, password, type)
  }
}

export { MasterFactory, Master }
