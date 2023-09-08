import type DamageType from '../../type/Damage'
import type MaestryType from '../../type/MaestryType'
import type WeaponType from '../../type/WeaponType'

class BareHand {
  readonly type: WeaponType
  readonly maestryType: MaestryType
  readonly damageType: DamageType
  readonly strikable: boolean
  readonly throwable: boolean
  readonly shootable: boolean

  constructor () {
    this.type = 'mão nua'
    this.maestryType = 'mão nua'
    this.damageType = 'impacto'
    this.strikable = true
    this.throwable = true
    this.shootable = true
  }
}

export default BareHand
