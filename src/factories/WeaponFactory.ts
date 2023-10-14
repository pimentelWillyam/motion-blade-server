import type WeaponType from '../bot/type/WeaponType'
import type MaestryType from '../bot/type/MaestryType'
import type Damage from '../bot/type/Damage'

class Weapon {
  readonly type: WeaponType
  readonly maestryType: MaestryType
  readonly strikable: boolean
  readonly throwable: boolean
  readonly shootable: boolean
  readonly needsTwoHandsToWield: boolean
  readonly damage: Damage
  readonly hittingBuff: number
  readonly defendingBuff: number

  constructor (type: WeaponType, maestryType: MaestryType, strikable: boolean, throwable: boolean, shootable: boolean, needsTwoHandsToWield: boolean, damage: Damage, hittingBuff: number, defendingBuff: number) {
    this.type = type
    this.maestryType = maestryType
    this.strikable = strikable
    this.throwable = throwable
    this.shootable = shootable
    this.needsTwoHandsToWield = needsTwoHandsToWield
    this.damage = damage
    this.hittingBuff = hittingBuff
    this.defendingBuff = defendingBuff
  }
}

class WeaponFactory {
  createWeapon (weaponType: WeaponType): Weapon {
    if (weaponType === 'mão nua') return new Weapon(weaponType, 'uma mão', true, true, false, true, { cloth: 2, leather: 0, chainmail: -6, plate: -10 }, 2, -5)

    else if (weaponType === 'faca') return new Weapon(weaponType, 'uma mão', true, true, false, false, { cloth: 4, leather: 2, chainmail: -2, plate: -10 }, 4, -4)
    else if (weaponType === 'adaga') return new Weapon(weaponType, 'uma mão', true, false, false, false, { cloth: 5, leather: 3, chainmail: -1, plate: -7 }, 3, -3)
    else if (weaponType === 'gladio') return new Weapon(weaponType, 'uma mão', true, false, false, false, { cloth: 6, leather: 4, chainmail: 3, plate: -6 }, 0, -1)
    else if (weaponType === 'facão') return new Weapon(weaponType, 'uma mão', true, false, false, false, { cloth: 5, leather: 3, chainmail: -7, plate: -10 }, 1, -1)
    else if (weaponType === 'sabre') return new Weapon(weaponType, 'uma mão', true, false, false, false, { cloth: 6, leather: 4, chainmail: -4, plate: -10 }, 0, 0)
    else if (weaponType === 'espada') return new Weapon(weaponType, 'uma mão', true, false, false, false, { cloth: 5, leather: 4, chainmail: -3, plate: -9 }, 0, 0)

    else if (weaponType === 'machadinha') return new Weapon(weaponType, 'uma mão', true, true, false, false, { cloth: 4, leather: 3, chainmail: -2, plate: -4 }, 1, -1)
    else if (weaponType === 'machado') return new Weapon(weaponType, 'uma mão', true, false, false, false, { cloth: 5, leather: 4, chainmail: -1, plate: -3 }, 0, 0)

    else if (weaponType === 'clava') return new Weapon(weaponType, 'uma mão', true, false, false, false, { cloth: 3, leather: 1, chainmail: 0, plate: 1 }, 0, 0)
    else if (weaponType === 'maça') return new Weapon(weaponType, 'uma mão', true, false, false, false, { cloth: 4, leather: 3, chainmail: 2, plate: 1 }, 0, 0)
    else if (weaponType === 'maça estrelada') return new Weapon(weaponType, 'uma mão', true, false, false, false, { cloth: 5, leather: 4, chainmail: 3, plate: 1 }, 0, 0)

    else if (weaponType === 'espada bastarda') return new Weapon(weaponType, 'uma mão', true, false, false, true, { cloth: 5, leather: 4, chainmail: -3, plate: -5 }, 0, 0)
    else if (weaponType === 'katana') return new Weapon(weaponType, 'uma mão', true, false, false, true, { cloth: 5, leather: 4, chainmail: -3, plate: -5 }, 3, 0)
    else if (weaponType === 'claymore') return new Weapon(weaponType, 'uma mão', true, false, false, true, { cloth: 7, leather: 5, chainmail: -2, plate: -1 }, -1, -1)
    else if (weaponType === 'zweihander') return new Weapon(weaponType, 'uma mão', true, false, false, true, { cloth: 8, leather: 6, chainmail: -1, plate: 0 }, -3, -3)

    else if (weaponType === 'machado de batalha') return new Weapon(weaponType, 'uma mão', true, false, false, true, { cloth: 7, leather: 6, chainmail: 1, plate: -1 }, -3, -3)

    else if (weaponType === 'maça pesada') return new Weapon(weaponType, 'uma mão', true, false, false, true, { cloth: 6, leather: 5, chainmail: 3, plate: 5 }, -3, -3)
    else if (weaponType === 'martelo pesado') return new Weapon(weaponType, 'uma mão', true, false, false, true, { cloth: 7, leather: 6, chainmail: 4, plate: 6 }, -5, -5)

    else if (weaponType === 'bastao') return new Weapon(weaponType, 'uma mão', true, true, false, false, { cloth: 3, leather: 1, chainmail: -4, plate: -7 }, 3, -3)
    else if (weaponType === 'lança') return new Weapon(weaponType, 'uma mão', true, true, false, false, { cloth: 6, leather: 4, chainmail: 3, plate: -6 }, 3, -3)
    else if (weaponType === 'lança montada') return new Weapon(weaponType, 'uma mão', true, true, false, false, { cloth: 4, leather: 3, chainmail: 2, plate: 1 }, 3, -3)
    else if (weaponType === 'sarissa') return new Weapon(weaponType, 'uma mão', true, false, false, false, { cloth: 6, leather: 4, chainmail: 3, plate: -6 }, 5, -5)
    else if (weaponType === 'alabarda') return new Weapon(weaponType, 'uma mão', true, false, false, true, { cloth: 7, leather: 4, chainmail: 3, plate: 2 }, 5, -5)

    else if (weaponType === 'arco curto') return new Weapon(weaponType, 'uma mão', false, false, true, true, { cloth: 4, leather: 2, chainmail: -2, plate: -10 }, 3, -10)
    else if (weaponType === 'arco') return new Weapon(weaponType, 'uma mão', false, false, true, true, { cloth: 5, leather: 3, chainmail: -1, plate: -7 }, 0, -10)
    else if (weaponType === 'arco longo') return new Weapon(weaponType, 'uma mão', false, false, true, true, { cloth: 6, leather: 4, chainmail: 2, plate: -3 }, -5, -10)

    else if (weaponType === 'besta') return new Weapon(weaponType, 'uma mão', false, false, true, true, { cloth: 4, leather: 2, chainmail: 0, plate: -3 }, 1, -10)
    else if (weaponType === 'besta pesada') return new Weapon(weaponType, 'uma mão', false, false, true, true, { cloth: 6, leather: 5, chainmail: 4, plate: 2 }, -3, 10)

    else if (weaponType === 'escudo redondo') return new Weapon(weaponType, 'uma mão', false, false, false, false, { cloth: 0, leather: 0, chainmail: 0, plate: 0 }, 0, 4)
    else if (weaponType === 'escudo') return new Weapon(weaponType, 'uma mão', false, false, false, false, { cloth: 0, leather: 0, chainmail: 0, plate: 0 }, -1, 6)
    else if (weaponType === 'scutum') return new Weapon(weaponType, 'uma mão', false, false, false, false, { cloth: 0, leather: 0, chainmail: 0, plate: 0 }, -3, 7)
    else throw new Error(`Não existe uma arma do tipo ${weaponType as string}`)
  }
}

export { WeaponFactory, Weapon }
