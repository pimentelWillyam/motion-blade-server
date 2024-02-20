import type UuidGenerator from '../bot/helper/UuidGenerator'
import type ArmorType from '../bot/type/ArmorType'
import type Attribute from '../bot/type/Attribute'
import type Attributes from '../bot/type/Attributes'
import type BattleInfo from '../bot/type/BattleInfo'
import type CombatCapabilities from '../bot/type/CombatCapabilities'
import type Inventory from '../bot/type/Inventory'
import type Maestry from '../bot/type/Maestry'
import type MaestryType from '../bot/type/MaestryType'
import type Profession from '../bot/type/Profession'
import type WeaponType from '../bot/type/WeaponType'
import RandomNumberGenerator from '../bot/helper/RandomNumberGenerator'
import { type ArmorFactory } from './ArmorFactory'
import { type WeaponFactory } from './WeaponFactory'

class Servant {
  readonly id: string
  readonly masterId: string
  readonly name: string
  readonly fatherProfession: Profession
  readonly youthProfession: Profession
  currentAttributes: Attributes
  maximumAttributes: Attributes
  combatCapabilities: CombatCapabilities
  inventory: Inventory
  maestry: Maestry
  battleInfo: BattleInfo

  constructor (id: string, masterId: string, name: string, fatherProfession: Profession, youthProfession: Profession, primaryArmor: Armor, secondaryArmor: Armor, primaryWeapon: Weapon, attributes: Attributes = { agility: 0, technique: 0, strength: 0, fortitude: 0 }) {
    this.id = id
    this.masterId = masterId
    this.name = name
    this.fatherProfession = fatherProfession
    this.youthProfession = youthProfession
    this.currentAttributes = attributes
    this.maximumAttributes = attributes
    this.combatCapabilities = { actionPoints: 0, movementPoints: 0, guard: 0, buff: 0, debuff: 0 }
    this.inventory = { primaryArmor, secondaryArmor, carriedWeapons: [], primaryWeapon, secondaryWeapon: null, denars: 0 }
    this.maestry = { bow: 0, crossbow: 0, bareHanded: 0, oneHanded: 0, twoHanded: 0, polearm: 0 }
    this.battleInfo = { isInBattle: false, battleId: 0, battleName: '', horizontalPosition: -1, verticalPosition: -1 }
  }
}

class ServantFactory {
  constructor (private readonly uuidGenerator: UuidGenerator, private readonly armorFactory: ArmorFactory, private readonly weaponFactory: WeaponFactory) {}

  create (masterId: string, name: string, fatherProfession: Profession, youthProfession: Profession, attributes: Attributes): Servant {
    return new Servant(this.uuidGenerator.generate(), masterId, name, fatherProfession, youthProfession, this.armorFactory.createArmorByType('roupa'), this.armorFactory.createArmorByType('roupa'), this.weaponFactory.createWeapon('mão nua'), attributes)
  }
}

export { ServantFactory, Servant }
