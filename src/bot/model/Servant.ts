import type Armor from '../type/Armor'
import type Profession from '../type/Profession'
import type Attributes from '../type/Attributes'
import type Maestry from '../type/Maestry'
import type Inventory from '../type/Inventory'
import { type Weapon } from '../../factories/WeaponFactory'

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
    this.inventory = { primaryArmor, secondaryArmor, carriedWeapons: [], primaryWeapon, secondaryWeapon: primaryWeapon, denars: 0 }
    this.maestry = { bow: 0, crossbow: 0, bareHanded: 0, oneHanded: 0, twoHanded: 0, polearm: 0 }
  }
}

export default Servant
