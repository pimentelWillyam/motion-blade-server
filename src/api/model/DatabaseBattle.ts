import type TurnInfo from '../../bot/type/TurnInfo'

interface DatabaseBattle {
  id: string
  name: string
  participants_name_list: string[]
  turn_info: TurnInfo
  map: string[][]
}

export default DatabaseBattle
