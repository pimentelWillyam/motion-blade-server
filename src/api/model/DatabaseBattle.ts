import { type Servant } from '../../factories/ServantFactory'
import type TurnInfo from '../../bot/type/TurnInfo'

interface DatabaseBattle {
  id: string
  name: string
  participants_list: Servant[]
  turnInfo: TurnInfo
  map: string[][]
}

export default DatabaseBattle
