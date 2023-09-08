import type DamageType from '../../type/Damage'
import type MaestryType from '../../type/MaestryType'
import type WeaponType from '../../type/WeaponType'

class Crossbow {
  readonly type: WeaponType
  readonly maestryType: MaestryType
  readonly damageType: DamageType
  readonly strikable: boolean
  readonly throwable: boolean
  readonly shootable: boolean

  constructor () {
    this.type = 'besta'
    this.maestryType = 'besta'
    this.damageType = 'perfuração'
    this.strikable = false
    this.throwable = false
    this.shootable = true
  }
}

export default Crossbow
