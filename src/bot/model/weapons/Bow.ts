import type DamageType from '../../type/Damage'
import type MaestryType from '../../type/MaestryType'
import type WeaponType from '../../type/WeaponType'

class Bow {
  readonly type: WeaponType
  readonly maestryType: MaestryType
  readonly damageType: DamageType
  readonly strikable: boolean
  readonly throwable: boolean
  readonly shootable: boolean

  constructor () {
    this.type = 'arco'
    this.maestryType = 'arco'
    this.damageType = 'perfuração'
    this.strikable = false
    this.throwable = false
    this.shootable = true
  }
}

export default Bow
