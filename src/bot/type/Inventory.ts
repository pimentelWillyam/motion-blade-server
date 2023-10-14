import type { Armor } from '../../factories/ArmorFactory'
import type { Weapon } from '../../factories/WeaponFactory'

interface Inventory {
  primaryArmor: Armor
  secondaryArmor: Armor
  carriedWeapons: Weapon[]
  primaryWeapon: Weapon
  secondaryWeapon: Weapon | null
  denars: number
}

export default Inventory
