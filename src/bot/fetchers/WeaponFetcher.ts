import type Weapon from '../type/Weapon'
import type WeaponType from '../type/WeaponType'
import type Axe from '../model/weapons/Axe'
import type BareHand from '../model/weapons/BareHand'
import type BastardSword from '../model/weapons/BastardSword'
import type BattleAxe from '../model/weapons/BattleAxe'
import type Bow from '../model/weapons/Bow'
import type Crossbow from '../model/weapons/Crossbow'
import type Dagger from '../model/weapons/Dagger'
import type Hammer from '../model/weapons/Hammer'
import type Mace from '../model/weapons/Mace'
import type Spear from '../model/weapons/Spear'
import type Staff from '../model/weapons/Staff'
import type Sword from '../model/weapons/Sword'

class WeaponFetcher {
  constructor (private readonly axe: Axe, private readonly bareHand: BareHand, private readonly bastardSword: BastardSword, private readonly battleAxe: BattleAxe,
    private readonly bow: Bow, private readonly crossbow: Crossbow, private readonly dagger: Dagger, private readonly hammer: Hammer, private readonly mace: Mace,
    private readonly spear: Spear, private readonly staff: Staff, private readonly sword: Sword) {}

  fetchWeaponByType = (weaponType: WeaponType): Weapon => {
    if (weaponType === 'machado') return this.axe
    else if (weaponType === 'mão nua') return this.bareHand
    else if (weaponType === 'espada bastarda') return this.bastardSword
    else if (weaponType === 'machado de batalha') return this.battleAxe
    else if (weaponType === 'arco') return this.bow
    else if (weaponType === 'besta') return this.crossbow
    else if (weaponType === 'adaga') return this.dagger
    else if (weaponType === 'martelo') return this.hammer
    else if (weaponType === 'maça') return this.mace
    else if (weaponType === 'lança') return this.spear
    else if (weaponType === 'bastão') return this.staff
    else if (weaponType === 'espada') return this.sword
    else {
      throw new Error('Tipo de arma inválido')
    }
  }
}

export default WeaponFetcher
