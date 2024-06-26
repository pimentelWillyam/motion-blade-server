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
import { type BattlePoints } from '../bot/type/BattlePoints'
import { type BattlePoint } from '../bot/type/BattlePoint'

interface ServantDTO {
  readonly id: string
  readonly masterId: string
  readonly name: string
  readonly fatherProfession: Profession
  readonly youthProfession: Profession
  currentAttributes: Attributes
  maximumAttributes: Attributes
  combatCapabilities: CombatCapabilities
  battlePoints: BattlePoints
  inventory: Inventory
  maestry: Maestry
  battleInfo: BattleInfo
}

class Servant {
  readonly id: string
  readonly masterId: string
  readonly name: string
  readonly fatherProfession: Profession
  readonly youthProfession: Profession
  currentAttributes: Attributes
  maximumAttributes: Attributes
  combatCapabilities: CombatCapabilities
  battlePoints: BattlePoints
  inventory: Inventory
  maestry: Maestry
  battleInfo: BattleInfo

  constructor (private readonly randomNumberGenerator: RandomNumberGenerator, private readonly armorFactory: ArmorFactory, private readonly weaponFactory: WeaponFactory, servant: ServantDTO) {
    this.id = servant.id
    this.masterId = servant.masterId
    this.name = servant.name
    this.fatherProfession = servant.fatherProfession
    this.youthProfession = servant.youthProfession
    this.currentAttributes = servant.currentAttributes
    this.maximumAttributes = servant.maximumAttributes
    this.combatCapabilities = servant.combatCapabilities
    this.battlePoints = servant.battlePoints
    this.inventory = servant.inventory
    this.maestry = servant.maestry
    this.battleInfo = servant.battleInfo
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

  private rollInitiative (): number {
    return this.currentAttributes.agility + this.randomNumberGenerator.generate(1, 20)
  }

  private rollActionPoints (): number {
    return 1 + ((this.currentAttributes.agility + this.randomNumberGenerator.generate(1, 10)) / 10)
  }

  private rollMovementPoints (): number {
    return 1 + ((this.currentAttributes.agility + this.randomNumberGenerator.generate(1, 10)) / 10)
  }

  generateBattlePoints (): BattlePoints {
    this.battlePoints.initiativePoints = this.rollInitiative()
    this.battlePoints.actionPoints += this.rollActionPoints()
    this.battlePoints.movementPoints += this.rollMovementPoints()
    return this.battlePoints
  }

  spendBattlePoint (battlePointToSpend: BattlePoint): void {
    switch (battlePointToSpend) {
      case 'action': this.battlePoints.actionPoints--; return
      case 'movement': this.battlePoints.movementPoints--; return
      default:
        throw new Error('Ponto de batalha inválido')
    }
  }

  reduceBattlePoints (): void {
    this.battlePoints.initiativePoints = 0
    this.battlePoints.actionPoints -= Math.floor(this.battlePoints.actionPoints)
    this.battlePoints.movementPoints -= Math.floor(this.battlePoints.movementPoints)
  }

  removeBattleInfo (): void {
    this.battleInfo.battleName = ''
    this.battleInfo.horizontalPosition = -1
    this.battleInfo.verticalPosition = -1
    this.battleInfo.battleId = -1
    this.battleInfo.isInBattle = false
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

  removeDebuff = (): void => {
    this.combatCapabilities.debuff = 0
  }

  sufferDamage = (damageToSuffer: number): void => {
    let damageNotDealt = damageToSuffer
    while (damageNotDealt !== 0) {
      if (this.currentAttributes.agility !== 0 && this.currentAttributes.agility >= damageNotDealt) {
        this.currentAttributes.agility -= damageNotDealt
        damageNotDealt = 0
      } else if (this.currentAttributes.agility !== 0 && this.currentAttributes.agility < damageNotDealt) {
        damageNotDealt -= this.currentAttributes.agility
        this.currentAttributes.agility = 0
      } else if (this.currentAttributes.technique !== 0 && this.currentAttributes.technique >= damageNotDealt) {
        this.currentAttributes.technique -= damageNotDealt
        damageNotDealt = 0
      } else if (this.currentAttributes.technique !== 0 && this.currentAttributes.technique < damageNotDealt) {
        damageNotDealt -= this.currentAttributes.technique
        this.currentAttributes.technique = 0
      } else if (this.currentAttributes.strength !== 0 && this.currentAttributes.strength >= damageNotDealt) {
        this.currentAttributes.strength -= damageNotDealt
        damageNotDealt = 0
      } else if (this.currentAttributes.strength !== 0 && this.currentAttributes.strength < damageNotDealt) {
        damageNotDealt -= this.currentAttributes.strength
        this.currentAttributes.strength = 0
      } else if (this.currentAttributes.fortitude !== 0 && this.currentAttributes.fortitude >= damageNotDealt) {
        this.currentAttributes.fortitude -= damageNotDealt
        damageNotDealt = 0
      } else if (this.currentAttributes.fortitude !== 0 && this.currentAttributes.fortitude < damageNotDealt) {
        damageNotDealt -= this.currentAttributes.fortitude
        this.currentAttributes.fortitude = 0
      } else if (this.currentAttributes.agility === 0 && this.currentAttributes.technique === 0 && this.currentAttributes.strength === 0 && this.currentAttributes.fortitude === 0) return
    }
  }

  heal = (quantityToHeal: number): void => {
    let healingPointsNotUsed = quantityToHeal
    while (healingPointsNotUsed !== 0 || this.currentAttributes !== this.maximumAttributes) {
      if (healingPointsNotUsed <= this.maximumAttributes.fortitude - this.currentAttributes.fortitude) { this.currentAttributes.fortitude = healingPointsNotUsed; return }
      if (healingPointsNotUsed > this.maximumAttributes.fortitude - this.currentAttributes.fortitude) {
        this.currentAttributes.fortitude = healingPointsNotUsed - this.maximumAttributes.fortitude + this.currentAttributes.fortitude
        healingPointsNotUsed -= this.maximumAttributes.fortitude + this.currentAttributes.fortitude
      }
      if (healingPointsNotUsed <= this.maximumAttributes.strength - this.currentAttributes.strength) { this.currentAttributes.strength = healingPointsNotUsed; return }
      if (healingPointsNotUsed > this.maximumAttributes.strength - this.currentAttributes.strength) {
        this.currentAttributes.strength = healingPointsNotUsed - this.maximumAttributes.strength + this.currentAttributes.fortitude
        healingPointsNotUsed -= this.maximumAttributes.strength + this.currentAttributes.strength
      }
      if (healingPointsNotUsed <= this.maximumAttributes.technique - this.currentAttributes.technique) { this.currentAttributes.technique = healingPointsNotUsed; return }
      if (healingPointsNotUsed > this.maximumAttributes.technique - this.currentAttributes.technique) {
        this.currentAttributes.technique = healingPointsNotUsed - this.maximumAttributes.technique + this.currentAttributes.fortitude
        healingPointsNotUsed -= this.maximumAttributes.technique + this.currentAttributes.technique
      }
      if (healingPointsNotUsed <= this.maximumAttributes.agility - this.currentAttributes.agility) { this.currentAttributes.agility = healingPointsNotUsed; return }
      if (healingPointsNotUsed > this.maximumAttributes.agility - this.currentAttributes.agility) {
        this.currentAttributes.agility = healingPointsNotUsed - this.maximumAttributes.agility + this.currentAttributes.fortitude
        healingPointsNotUsed -= this.maximumAttributes.agility + this.currentAttributes.agility
      }
    }
  }

  addDenars = (denarsToAdd: number): void => {
    this.inventory.denars += denarsToAdd
  }

  removeDenars = (servantName: string, deductedMoney: number): void => {
    this.inventory.denars -= deductedMoney
  }
}

class ServantFactory {
  constructor (private readonly randomNumberGenerator = new RandomNumberGenerator(), private readonly uuidGenerator: UuidGenerator, private readonly armorFactory: ArmorFactory, private readonly weaponFactory: WeaponFactory) {}

  create (masterId: string, name: string, fatherProfession: Profession, youthProfession: Profession, attributes: Attributes): Servant {
    const servant: ServantDTO = {
      id: this.uuidGenerator.generate(),
      masterId,
      name,
      fatherProfession,
      youthProfession,
      currentAttributes: attributes,
      maximumAttributes: attributes,
      combatCapabilities: { guard: 0, buff: 0, debuff: 0 },
      battlePoints: { initiativePoints: 0, movementPoints: 0, actionPoints: 0 },
      inventory: {
        primaryArmor: this.armorFactory.createArmorByType('roupa'),
        secondaryArmor: this.armorFactory.createArmorByType('roupa'),
        carriedWeapons: [],
        primaryWeapon: this.weaponFactory.createWeapon('mão nua'),
        secondaryWeapon: null,
        denars: 0
      },
      maestry: { bow: 0, crossbow: 0, bareHanded: 0, oneHanded: 0, twoHanded: 0, polearm: 0 },
      battleInfo: { isInBattle: false, battleId: 0, battleName: '', horizontalPosition: -1, verticalPosition: -1 }
    }
    return new Servant(this.randomNumberGenerator, this.armorFactory, this.weaponFactory, servant)
  }

  createThroughDto (servant: ServantDTO): Servant {
    return new Servant(this.randomNumberGenerator, this.armorFactory, this.weaponFactory, servant)
  }
}

export { ServantFactory, Servant, type ServantDTO }
