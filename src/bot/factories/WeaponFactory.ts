import type WeaponType from '../type/WeaponType'
import type MaestryType from '../type/MaestryType'
import type Damage from '../type/Damage'

class Weapon {
  readonly type: WeaponType
  readonly maestryType: MaestryType
  readonly damageType: Damage
  readonly strikable: boolean
  readonly throwable: boolean
  readonly shootable: boolean

  constructor (type: WeaponType, maestryType: MaestryType, damageType: Damage, strikable: boolean, throwable: boolean, shootable: boolean) {
    this.type = type
    this.maestryType = maestryType
    this.damageType = damageType
    this.strikable = strikable
    this.throwable = throwable
    this.shootable = shootable
  }
}

class WeaponFactory {
  createWeapon (weaponType: WeaponType): Weapon {
    if (weaponType === 'adaga') return new Weapon(weaponType, 'uma mão', 'corte', true, true, false)
    else if (weaponType === 'arco') return new Weapon(weaponType, 'arco', 'perfuração', false, false, true)
    else if (weaponType === 'bastão') return new Weapon(weaponType, 'haste', 'impacto', true, false, false)
    else if (weaponType === 'besta') return new Weapon(weaponType, 'besta', 'perfuração', false, false, true)
    else if (weaponType === 'espada') return new Weapon(weaponType, 'uma mão', 'corte', true, false, false)
    else if (weaponType === 'espada bastarda') return new Weapon(weaponType, 'duas mãos', 'corte', true, false, false)
    else if (weaponType === 'lança') return new Weapon(weaponType, 'haste', 'perfuração', true, true, false)
    else if (weaponType === 'machado') return new Weapon(weaponType, 'uma mão', 'corte', true, true, false)
    else if (weaponType === 'machado de batalha') return new Weapon(weaponType, 'duas mãos', 'corte', true, false, false)
    else if (weaponType === 'martelo') return new Weapon(weaponType, 'uma mão', 'impacto', true, false, false)
    else if (weaponType === 'maça') return new Weapon(weaponType, 'uma mão', 'impacto', true, false, false)
    else if (weaponType === 'mão nua') return new Weapon(weaponType, 'uma mão', 'impacto', true, false, false)
    else throw new Error('Tipo de arma inválido')
  }
}

export default WeaponFactory
