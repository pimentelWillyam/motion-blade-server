import type BattleInfo from '../../bot/type/BattleInfo'
import { type BattlePoints } from '../../bot/type/BattlePoints'
import type CombatCapabilities from '../../bot/type/CombatCapabilities'
import type Inventory from '../../bot/type/Inventory'
import type Maestry from '../../bot/type/Maestry'
import type Profession from '../../bot/type/Profession'
import type Attributes from '../type/Attributes'

interface DatabaseServant {
  id: string
  master_id: string
  name: string
  father_profession: Profession
  youth_profession: Profession
  current_attributes: Attributes
  maximum_attributes: Attributes
  combat_capabilities: CombatCapabilities
  battle_points: BattlePoints

  battle_info: BattleInfo
  inventory: Inventory
  maestry: Maestry
}

export default DatabaseServant
