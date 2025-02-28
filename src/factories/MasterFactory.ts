import type UuidGenerator from '../bot/helper/UuidGenerator'
import { type UserType } from '../bot/type/UserType'

interface MasterDTO {
  readonly id: string
  readonly login: string
  password: string
  type: UserType
  servantNameList: string[]
}

class Master {
  readonly id: string
  readonly login: string
  password: string
  type: UserType
  servantNameList: string[]

  constructor (id: string, login: string, password: string, type: UserType) {
    this.id = id
    this.login = login
    this.password = password
    this.type = type
    this.servantNameList = []
  }
}

class MasterFactory {
  constructor (private readonly uuidGenerator: UuidGenerator) {}

  create (login: string, password: string, type: UserType): Master {
    return new Master(this.uuidGenerator.generate(), login, password, type)
  }

  createByDTO (master: MasterDTO): Master {
    return new Master(master.id, master.login, master.password, master.type)
  }
}

export { MasterFactory, type MasterDTO, Master }
