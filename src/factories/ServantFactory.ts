import type UuidGenerator from '../bot/helper/UuidGenerator'
import type Attributes from '../bot/type/Attributes'
import type Inventory from '../bot/type/Inventory'
import type Maestry from '../bot/type/Maestry'
import type Profession from '../bot/type/Profession'
import { type ArmorFactory, type Armor } from './ArmorFactory'
import { type WeaponFactory, type Weapon } from './WeaponFactory'

class Servant {
  readonly id: string
  readonly masterId: string
  readonly name: string
  readonly fatherProfession: Profession
  readonly youthProfession: Profession
  currentAttributes: Attributes
  maximumAttributes: Attributes
  guard: number
  buff: number
  debuff: number
  inventory: Inventory
  maestry: Maestry

  constructor (id: string, masterId: string, name: string, fatherProfession: Profession, youthProfession: Profession, primaryArmor: Armor, secondaryArmor: Armor, primaryWeapon: Weapon, attributes: Attributes = { agility: 0, technique: 0, strength: 0, fortitude: 0 }) {
    this.id = id
    this.masterId = masterId
    this.name = name
    this.fatherProfession = fatherProfession
    this.youthProfession = youthProfession
    this.currentAttributes = attributes
    this.maximumAttributes = attributes
    this.guard = 0
    this.buff = 0
    this.debuff = 0
    this.inventory = { primaryArmor, secondaryArmor, carriedWeapons: [], primaryWeapon, secondaryWeapon: null, denars: 0 }
    this.maestry = { bow: 0, crossbow: 0, bareHanded: 0, oneHanded: 0, twoHanded: 0, polearm: 0 }
  }
}

class ServantFactory {
  constructor (private readonly uuidGenerator: UuidGenerator, private readonly armorFactory: ArmorFactory, private readonly weaponFactory: WeaponFactory) {}

  create (masterId: string, name: string, fatherProfession: Profession, youthProfession: Profession, attributes: Attributes): Servant {
    return new Servant(this.uuidGenerator.generate(), masterId, name, fatherProfession, youthProfession, this.armorFactory.createArmorByType('roupa'), this.armorFactory.createArmorByType('roupa'), this.weaponFactory.createWeapon('mão nua'), attributes)
  }
}

export { ServantFactory, Servant }
