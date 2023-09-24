import type UuidGenerator from '../bot/helper/UuidGenerator'
import type Attributes from '../bot/type/Attributes'
import type Inventory from '../bot/type/Inventory'
import type Maestry from '../bot/type/Maestry'
import type Profession from '../bot/type/Profession'
import { type Armor } from './ArmorFactory'
import { type Weapon } from './WeaponFactory'

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

  constructor (id: string, masterId: string, name: string, fatherProfession: Profession, youthProfession: Profession, armor: Armor, currentWeapon: Weapon, attributes: Attributes = { agility: 0, technique: 0, strength: 0, fortitude: 0 }) {
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
    this.inventory = { armor, carriedWeapons: [], currentWeapon, denars: 0 }
    this.maestry = { bow: 0, crossbow: 0, bareHanded: 0, oneHanded: 0, twoHanded: 0, polearm: 0 }
  }
}

class ServantFactory {
  constructor (private readonly uuidGenerator: UuidGenerator) {}

  create (masterId: string, name: string, fatherProfession: Profession, youthProfession: Profession, armor: Armor, currentWeapon: Weapon, attributes: Attributes): Servant {
    return new Servant(this.uuidGenerator.generate(), masterId, name, fatherProfession, youthProfession, armor, currentWeapon, attributes)
  }
}

export { ServantFactory, Servant }
