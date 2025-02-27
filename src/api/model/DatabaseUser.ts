import { type Battle } from '../../factories/BattleFactory'
import { type Servant } from '../../factories/ServantFactory'

interface DatabaseUser {
  id: string
  login: string
  password: string
  servant_list: Servant[]
  battle_list: Battle[]
}

export default DatabaseUser
