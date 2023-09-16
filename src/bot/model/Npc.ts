import type Armor from '../type/Armor'
import type Weapon from '../type/Weapon'
import type Profession from '../type/Profession'
import type Attributes from '../type/Attributes'
import type ArmorFetcher from '../fetchers/ArmorFetcher'
import type AttributesFetcher from '../fetchers/AttributesFetcher'
import type Maestry from '../type/Maestry'
import type WeaponFetcher from '../fetchers/WeaponFetcher'

class Npc {
  readonly id: string
  readonly masterId: string
  readonly name: string
  readonly fatherProfession: string
  readonly youthProfession: string
  currentAttributes: Attributes
  maximumAttributes: Attributes
  armor: Armor
  inventory: Weapon[]
  currentWeapon: Weapon
  maestry: Maestry

  constructor (id: string, masterId: string, name: string, fatherProfession: string, youthProfession: string, agility: number, technique: number, strength: number, fortitude: number, private readonly weaponFetcher: WeaponFetcher, private readonly attributesFetcher: AttributesFetcher, private readonly armorFetcher: ArmorFetcher) {
    this.id = id
    this.masterId = masterId
    this.name = name
    this.fatherProfession = fatherProfession
    this.youthProfession = youthProfession
    this.inventory = []
    this.currentWeapon = this.weaponFetcher.fetchWeaponByType('mão nua')
    if (fatherProfession === '' || youthProfession === '') {
      this.currentAttributes = { agility, technique, strength, fortitude, guard: 0, buff: 0, debuff: 0 }
      this.maximumAttributes = { agility, technique, strength, fortitude, guard: 0, buff: 0, debuff: 0 }
    } else {
      this.currentAttributes = this.attributesFetcher.fetchAttributesBasedOnBackground(fatherProfession as Profession, youthProfession as Profession)
      this.maximumAttributes = this.attributesFetcher.fetchAttributesBasedOnBackground(fatherProfession as Profession, youthProfession as Profession)
    }
    this.armor = this.armorFetcher.fetchArmorBasedOnFortitude(this.currentAttributes.fortitude)
    this.maestry = { bow: 0, crossbow: 0, bareHanded: 0, oneHanded: 0, twoHanded: 0, polearm: 0 }
  }
}

export default Npc
