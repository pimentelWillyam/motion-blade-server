import type DamageType from '../../type/Damage'
import type MaestryType from '../../type/MaestryType'
import type WeaponType from '../../type/WeaponType'

class Spear {
  readonly type: WeaponType
  readonly maestryType: MaestryType
  readonly damageType: DamageType
  readonly strikable: boolean
  readonly throwable: boolean
  readonly shootable: boolean

  constructor () {
    this.type = 'lança'
    this.maestryType = 'haste'
    this.damageType = 'perfuração'
    this.strikable = true
    this.throwable = true
    this.shootable = false
  }
}

export default Spear
