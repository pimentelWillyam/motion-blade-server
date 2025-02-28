import type UuidGenerator from '../bot/helper/UuidGenerator'
import { type Servant } from './ServantFactory'
import { type Battle } from './BattleFactory'

interface UserDTO {
  readonly id: string
  readonly login: string
  password: string
  servantList: Servant[]
  battleList: Battle[]
}

class User {
  readonly id: string
  readonly login: string
  password: string
  servantList: Servant[]
  battleList: Battle[]

  constructor (user: UserDTO) {
    this.id = user.id
    this.login = user.login
    this.password = user.password
    this.servantList = user.servantList
    this.battleList = user.battleList
  }
}

class UserFactory {
  constructor (private readonly uuidGenerator: UuidGenerator) {}

  create (login: string, password: string): User {
    const user: UserDTO = {
      id: this.uuidGenerator.generate(),
      login,
      password,
      servantList: [],
      battleList: []
    }
    return new User(user)
  }

  createThroughDto (user: UserDTO): User {
    return new User(user)
  }
}

export { UserFactory, User, type UserDTO }
