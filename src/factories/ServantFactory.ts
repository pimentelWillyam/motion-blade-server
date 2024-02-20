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

  constructor (private readonly randomNumberGenerator: RandomNumberGenerator, private readonly armorFactory: ArmorFactory, private readonly weaponFactory: WeaponFactory, id: string, masterId: string, name: string, fatherProfession: Profession, youthProfession: Profession, attributes: Attributes = { agility: 0, technique: 0, strength: 0, fortitude: 0 }) {
    this.id = id
    this.masterId = masterId
    this.name = name
    this.fatherProfession = fatherProfession
    this.youthProfession = youthProfession
    this.currentAttributes = attributes
    this.maximumAttributes = attributes
    this.combatCapabilities = { actionPoints: 0, movementPoints: 0, guard: 0, buff: 0, debuff: 0 }
    this.inventory = {
      primaryArmor: this.armorFactory.createArmorByType('roupa'),
      secondaryArmor: this.armorFactory.createArmorByType('roupa'),
      carriedWeapons: [],
      primaryWeapon: this.weaponFactory.createWeapon('mão nua'),
      secondaryWeapon: null,
      denars: 0
    }
    this.maestry = { bow: 0, crossbow: 0, bareHanded: 0, oneHanded: 0, twoHanded: 0, polearm: 0 }
    this.battleInfo = { isInBattle: false, battleId: 0, battleName: '', horizontalPosition: -1, verticalPosition: -1 }
  }

  getCurrentAttributes (): Attributes { return this.currentAttributes }
  getMaximumAttributes (): Attributes { return this.maximumAttributes }
  getMaestry (): Maestry { return this.maestry }
  getInventory (): Maestry { return this.maestry }

  rollAttributeOrMaestry (attributeOrMaestryToRoll: Attribute | MaestryType): number {
    switch (attributeOrMaestryToRoll) {
      case 'agilidade': return this.currentAttributes.agility + this.randomNumberGenerator.generate(1, 20)
      case 'tecnica': return this.currentAttributes.technique + this.randomNumberGenerator.generate(1, 20)
      case 'força': return this.currentAttributes.strength + this.randomNumberGenerator.generate(1, 10)
      case 'fortitude': return this.currentAttributes.fortitude + this.randomNumberGenerator.generate(1, 10)
      case 'mão nua': return this.maestry.bareHanded + this.randomNumberGenerator.generate(1, 10)
      case 'uma mão': return this.maestry.oneHanded + this.randomNumberGenerator.generate(1, 10)
      case 'duas mãos': return this.maestry.twoHanded + this.randomNumberGenerator.generate(1, 10)
      case 'haste': return this.maestry.polearm + this.randomNumberGenerator.generate(1, 10)
      case 'besta': return this.maestry.crossbow + this.randomNumberGenerator.generate(1, 10)
      case 'arco': return this.maestry.bow + this.randomNumberGenerator.generate(1, 10)
      default: throw new Error('Atributo ou maestria inválido')
    }
  }

  upgrade = (propertyToUpgrade: MaestryType | Attribute, quantityToUpgrade: number): void => {
    switch (propertyToUpgrade) {
      case 'agilidade': this.maximumAttributes.agility += quantityToUpgrade; this.currentAttributes.agility += quantityToUpgrade; break
      case 'tecnica': this.maximumAttributes.technique += quantityToUpgrade; this.currentAttributes.technique += quantityToUpgrade; break
      case 'força': this.maximumAttributes.strength += quantityToUpgrade; this.currentAttributes.strength += quantityToUpgrade; break
      case 'fortitude': this.maximumAttributes.fortitude += quantityToUpgrade; this.currentAttributes.fortitude += quantityToUpgrade; break
      case 'mão nua': this.maestry.bareHanded += quantityToUpgrade; break
      case 'uma mão': this.maestry.oneHanded += quantityToUpgrade; break
      case 'duas mãos': this.maestry.twoHanded += quantityToUpgrade; break
      case 'haste': this.maestry.polearm += quantityToUpgrade; break
      case 'besta': this.maestry.crossbow += quantityToUpgrade; break
      case 'arco': this.maestry.bow += quantityToUpgrade; break
      default:
        throw new Error('Propriedade de aprimoramento inválida')
    }
  }

  wearArmor = (armorTypeToWear: ArmorType): void => {
    switch (armorTypeToWear) {
      case 'palha':
        this.inventory.primaryArmor = this.armorFactory.createArmorByType('placa')
        this.inventory.secondaryArmor = this.armorFactory.createArmorByType('cota de malha')
        break

      case 'pouro':
        this.inventory.primaryArmor = this.armorFactory.createArmorByType('placa')
        this.inventory.secondaryArmor = this.armorFactory.createArmorByType('couro')
        break

      default:
        this.inventory.primaryArmor = this.armorFactory.createArmorByType(armorTypeToWear)
        break
    }
  }

  removeArmor = (): void => {
    this.inventory.primaryArmor = this.armorFactory.createArmorByType('roupa')
    this.inventory.secondaryArmor = this.armorFactory.createArmorByType('roupa')
  }

  addWeaponToInventory = (weaponType: WeaponType): void => {
    if (this.inventory.carriedWeapons.length >= 2) throw new Error(`O servo ${this.name} já está carregando muitas armas, jogue alguma fora para aumentar o espaço disponível`)
    this.inventory.primaryWeapon = this.weaponFactory.createWeapon('mão nua')
    this.inventory.secondaryWeapon = null
    this.inventory.carriedWeapons.push(this.weaponFactory.createWeapon(weaponType))
  }

  removeWeaponFromInventory = (weaponType: WeaponType): void => {
    for (let i = 0; i < 2; i++) {
      if (this.inventory.carriedWeapons[i] !== undefined && this.inventory.carriedWeapons[i].type === weaponType) {
        this.inventory.carriedWeapons.splice(i, 1)
      }
    }
    throw new Error(`O servo ${this.name} não possui nenhua arma do tipo ${weaponType} no seu inventário para que ele possa descartar`)
  }

  drawWeapon = (weaponType: WeaponType): void => {
    const weaponToBeDrawed = this.weaponFactory.createWeapon(weaponType)
    if (weaponToBeDrawed.type !== 'mão nua' && weaponToBeDrawed.needsTwoHandsToWield && (this.inventory.primaryWeapon.type !== 'mão nua' || this.inventory.secondaryWeapon != null)) throw new Error(`O servo ${this.name} está atualmente com as mãos ocupadas e não pode sacar um(a) ${weaponType}`)
    if (weaponToBeDrawed.type !== 'mão nua' && !weaponToBeDrawed.needsTwoHandsToWield && (this.inventory.secondaryWeapon != null)) throw new Error(`O servo ${this.name} não pode sacar um(a) ${weaponType} pois já está com as duas mãos ocupadas`)
    for (let i = 0; i < 2; i++) {
      if (this.inventory.carriedWeapons[i].type === weaponToBeDrawed.type) {
        if ((weaponToBeDrawed.type === 'escudo redondo' || weaponToBeDrawed.type === 'escudo' || weaponToBeDrawed.type === 'scutum') && (this.inventory.secondaryWeapon === null)) this.inventory.secondaryWeapon = weaponToBeDrawed
        else if (this.inventory.primaryWeapon.type === 'mão nua') this.inventory.primaryWeapon = weaponToBeDrawed
        else this.inventory.secondaryWeapon = weaponToBeDrawed
        this.inventory.carriedWeapons.splice(i, 1)
      }
    }
  }

  disarm = (): void => {
    if (this.inventory.primaryWeapon.needsTwoHandsToWield) {
      this.inventory.primaryWeapon = this.weaponFactory.createWeapon('mão nua')
    } else if (this.inventory.secondaryWeapon === null) {
      this.inventory.primaryWeapon = this.weaponFactory.createWeapon('mão nua')
    } else if (this.inventory.secondaryWeapon !== null && (this.inventory.secondaryWeapon.type === 'escudo redondo' || this.inventory.secondaryWeapon.type === 'escudo' || this.inventory.secondaryWeapon.type === 'scutum')) {
      this.inventory.primaryWeapon = this.weaponFactory.createWeapon('mão nua')
    } else if (this.inventory.secondaryWeapon !== null && (this.inventory.secondaryWeapon.type === 'escudo redondo' || this.inventory.secondaryWeapon.type === 'escudo' || this.inventory.secondaryWeapon.type === 'scutum')) {
      this.inventory.primaryWeapon = this.weaponFactory.createWeapon('mão nua')
    } else if (this.inventory.secondaryWeapon !== null && !(this.inventory.secondaryWeapon.type === 'escudo redondo' || this.inventory.secondaryWeapon.type === 'escudo' || this.inventory.secondaryWeapon.type === 'scutum')) {
      this.inventory.primaryWeapon = this.inventory.secondaryWeapon
      this.inventory.secondaryWeapon = null
    }
  }

  applyGuard = (guardToBeApplied: number): void => {
    this.combatCapabilities.guard = guardToBeApplied
  }

  buff = (buffValue: number): void => {
    this.combatCapabilities.buff += buffValue
  }

  removeBuff = (): void => {
    this.combatCapabilities.buff = 0
  }

  debuff = (debuffValue: number): void => {
    this.combatCapabilities.debuff -= debuffValue
  }

}

class ServantFactory {
  constructor (private readonly uuidGenerator: UuidGenerator, private readonly armorFactory: ArmorFactory, private readonly weaponFactory: WeaponFactory) {}

  create (masterId: string, name: string, fatherProfession: Profession, youthProfession: Profession, attributes: Attributes): Servant {
    return new Servant(this.uuidGenerator.generate(), masterId, name, fatherProfession, youthProfession, this.armorFactory.createArmorByType('roupa'), this.armorFactory.createArmorByType('roupa'), this.weaponFactory.createWeapon('mão nua'), attributes)
  }
}

export { ServantFactory, Servant }
