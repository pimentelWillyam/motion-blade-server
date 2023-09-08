import type DamageType from '../../type/Damage'
import type MaestryType from '../../type/MaestryType'
import type WeaponType from '../../type/WeaponType'

class Axe {
  readonly type: WeaponType
  readonly maestryType: MaestryType
  readonly damageType: DamageType
  readonly strikable: boolean
  readonly throwable: boolean
  readonly shootable: boolean

  constructor () {
    this.type = 'machado'
    this.maestryType = 'uma mão'
    this.damageType = 'corte'
    this.strikable = true
    this.throwable = true
    this.shootable = true
  }
}

export default Axe
