import type Armor from '../type/Armor'
import type Weapon from '../type/Weapon'
import type Profession from '../type/Profession'
import type Attributes from '../type/Attributes'
import type ArmorFetcher from '../fetchers/ArmorFetcher'
import type AttributesFetcher from '../fetchers/AttributesFetcher'
import type Maestry from '../type/Maestry'
import type WeaponFetcher from '../fetchers/WeaponFetcher';

class Servant {
  readonly id: string
  readonly masterId: string
  readonly name: string
  readonly fatherProfession: Profession
  readonly youthProfession: Profession
  attributes: Attributes
  fullHealth: Attributes
  armor: Armor
  weaponList: Weapon[]
  currentWeapon: Weapon
  maestry: Maestry

  constructor (id: string, masterId: string, name: string, fatherProfession: Profession, youthProfession: Profession, private readonly weaponFetcher: WeaponFetcher, private readonly attributesFetcher: AttributesFetcher, private readonly armorFetcher: ArmorFetcher) {
    this.id = id
    this.masterId = masterId
    this.name = name
    this.fatherProfession = fatherProfession
    this.youthProfession = youthProfession
    this.weaponList = [weaponFetcher.fetchWeaponByType('mão nua'), weaponFetcher.fetchWeaponByType('mão nua'), weaponFetcher.fetchWeaponByType('mão nua')]
    this.currentWeapon = this.weaponList[0]
    this.attributes = this.attributesFetcher.fetchAttributesBasedOnBackground(fatherProfession, youthProfession)
    this.fullHealth = this.attributes
    this.armor = this.armorFetcher.fetchArmorBasedOnFortitude(this.attributes.fortitude)
    this.maestry = { bow: 0, crossbow: 0, nakedHanded: 0, oneHanded: 0, twoHanded: 0, polearm: 0 }
  }
}

export default Servant
