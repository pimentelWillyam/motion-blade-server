import type { Armor } from '../../factories/ArmorFactory'
import type { Weapon } from '../../factories/WeaponFactory'

interface Inventory {
  armor: Armor
  carriedWeapons: Weapon[]
  currentWeapon: Weapon
  denars: number
}

export default Inventory
