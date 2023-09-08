import type DamageType from '../../type/Damage'
import type MaestryType from '../../type/MaestryType'
import type WeaponType from '../../type/WeaponType'

class Hammer {
  readonly type: WeaponType
  readonly maestryType: MaestryType
  readonly damageType: DamageType
  readonly strikable: boolean
  readonly throwable: boolean
  readonly shootable: boolean

  constructor () {
    this.type = 'martelo'
    this.maestryType = 'uma mão'
    this.damageType = 'impacto'
    this.strikable = true
    this.throwable = false
    this.shootable = false
  }
}

export default Hammer
