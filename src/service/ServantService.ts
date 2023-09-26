import type Servant from '../bot/model/Servant'
import type ArmorEvasionTestResult from '../bot/type/ArmorEvasionTestResult'
import type ArmorType from '../bot/type/ArmorType'
import type AttackTestResult from '../bot/type/AttackTestResult'
import type AttackType from '../bot/type/AttackType'
import type Attribute from '../bot/type/Attribute'
import type Attributes from '../bot/type/Attributes'
import type Inventory from '../bot/type/Inventory'
import type Maestry from '../bot/type/Maestry'
import type MaestryType from '../bot/type/MaestryType'
import type Profession from '../bot/type/Profession'
import type ServantLifeStatus from '../bot/type/ServantLifeStatus'
import type Weapon from '../bot/type/Weapon'
import type WeaponType from '../bot/type/WeaponType'
import type { ArmorFactory } from '../factories/ArmorFactory'
import type { ServantFactory } from '../factories/ServantFactory'
import type { WeaponFactory } from '../factories/WeaponFactory'
import type AttributesFetcher from '../helper/AttributesFetcher'
import type ServantRepository from '../repository/ServantRepository'

class ServantService {
  constructor (private readonly servantRepository: ServantRepository, private readonly attributesFetcher: AttributesFetcher, private readonly armorFactory: ArmorFactory, private readonly weaponFactory: WeaponFactory) {}

  create = (masterId: string, name: string, fatherProfession: Profession, youthProfession: Profession, customCreation: boolean, attributes: Attributes = { agility: 0, technique: 0, strength: 0, fortitude: 0 }): Servant => {
    if (this.servantRepository.get(name) == null) {
      if (!customCreation) {
        attributes = this.attributesFetcher.fetchAttributesBasedOnBackground(fatherProfession, youthProfession)
        return this.servantRepository.create(masterId, name, fatherProfession, youthProfession, this.armorFactory.createArmorByFortitude(attributes.fortitude), this.weaponFactory.createWeapon('mão nua'), attributes)
      }
      return this.servantRepository.create(masterId, name, fatherProfession, youthProfession, this.armorFactory.createArmorByFortitude(attributes.fortitude), this.weaponFactory.createWeapon('mão nua'), attributes)
    }
    throw new Error('Já existe um servo com esse nome')
  }

  getAll = (): Servant[] => {
    return this.servantRepository.getAll()
  }

  get = (name: string): Servant => {
    const fetchedServant = this.servantRepository.get(name)
    if (fetchedServant != null) return fetchedServant
    throw new Error(`O servo ${name} não existe`)
  }

  servantExists = (name: string): boolean => {
    const fetchedServant = this.servantRepository.get(name)
    if (fetchedServant != null) return true
    return false
  }

  getCurrentAttributes = (name: string): Attributes => {
    const fetchedServant = this.servantRepository.get(name)
    if (fetchedServant != null) return fetchedServant.currentAttributes
    throw new Error(`O servo ${name} não existe`)
  }

  getMaximumAttributes = (name: string): Attributes => {
    const fetchedServant = this.servantRepository.get(name)
    if (fetchedServant != null) return fetchedServant.maximumAttributes
    throw new Error(`O servo ${name} não existe`)
  }

  getMaestry = (name: string): Maestry => {
    const fetchedServant = this.servantRepository.get(name)
    if (fetchedServant != null) return fetchedServant.maestry
    throw new Error(`O servo ${name} não existe`)
  }

  getInventory = (name: string): Inventory => {
    const fetchedServant = this.servantRepository.get(name)
    if (fetchedServant != null) return fetchedServant.inventory
    throw new Error(`O servo ${name} não existe`)
  }

  update = (name: string, contentToUpdate: Servant): Servant => {
    const servantToBeUpdated = this.servantRepository.update(name, contentToUpdate)
    if (servantToBeUpdated != null) return servantToBeUpdated
    throw new Error('Não é possível atualizar um servo que não existe')
  }

  upgrade = (name: string, propertyToUpgrade: MaestryType | Attribute, quantityToUpgrade: number): Servant => {
    const contentToUpgrade = this.servantRepository.get(name)
    if (contentToUpgrade === null) throw new Error('Não é possível atualizar um servo que não existe')
    if (propertyToUpgrade === 'agilidade') {
      contentToUpgrade.maximumAttributes.agility += quantityToUpgrade
      contentToUpgrade.currentAttributes.agility += quantityToUpgrade
    } else if (propertyToUpgrade === 'tecnica') {
      contentToUpgrade.maximumAttributes.technique += quantityToUpgrade
      contentToUpgrade.currentAttributes.technique += quantityToUpgrade
    } else if (propertyToUpgrade === 'força') {
      contentToUpgrade.maximumAttributes.strength += quantityToUpgrade
      contentToUpgrade.currentAttributes.strength += quantityToUpgrade
    } else if (propertyToUpgrade === 'fortitude') {
      contentToUpgrade.maximumAttributes.fortitude += quantityToUpgrade
      contentToUpgrade.currentAttributes.fortitude += quantityToUpgrade
    } else if (propertyToUpgrade === 'mão nua') {
      contentToUpgrade.maestry.bareHanded += quantityToUpgrade
    } else if (propertyToUpgrade === 'uma mão') {
      contentToUpgrade.maestry.oneHanded += quantityToUpgrade
    } else if (propertyToUpgrade === 'duas mãos') {
      contentToUpgrade.maestry.twoHanded += quantityToUpgrade
    } else if (propertyToUpgrade === 'haste') {
      contentToUpgrade.maestry.polearm += quantityToUpgrade
    } else if (propertyToUpgrade === 'arco') {
      contentToUpgrade.maestry.bow += quantityToUpgrade
    } else if (propertyToUpgrade === 'besta') {
      contentToUpgrade.maestry.crossbow += quantityToUpgrade
    } else throw new Error('Ofereça um atributo ou maestria válido')
    this.servantRepository.update(name, contentToUpgrade)
    return contentToUpgrade
  }

  wearArmor = (servant: Servant, armorType: ArmorType): Servant => {
    const armorToBeUsed = this.armorFactory.createArmorByType(armorType)
    if (servant.maximumAttributes.fortitude < armorToBeUsed.minimumFortitude) throw new Error(`O servo ${servant.name} não possui fortitude o suficiente para usar uma armadura de ${armorType}`)
    servant.inventory.armor = armorToBeUsed
    this.servantRepository.update(servant.name, servant)
    return servant
  }

  removeArmor = (servant: Servant): Servant => {
    servant.inventory.armor = this.armorFactory.createArmorByType('roupa')
    this.servantRepository.update(servant.name, servant)
    return servant
  }

  keepWeapon = (servantName: string, weaponType: WeaponType): Servant => {
    const fetchedServant = this.servantRepository.get(servantName)
    if (fetchedServant === null) throw new Error(`O servo ${servantName} não existe`)
    else if (fetchedServant.inventory.carriedWeapons.length >= 2) throw new Error(`O servo ${fetchedServant.name} já está carregando muitas armas, jogue alguma fora para aumentar o espaço disponível`)
    fetchedServant.inventory.carriedWeapons.push(this.weaponFactory.createWeapon(weaponType))
    fetchedServant.inventory.currentWeapon = this.weaponFactory.createWeapon('mão nua')
    this.servantRepository.update(servantName, fetchedServant)
    return fetchedServant
  }

  drawWeapon = (servantName: string, weaponType: WeaponType): Servant => {
    const fetchedServant = this.servantRepository.get(servantName)
    if (fetchedServant === null) throw new Error('Não é possível encontrar um servo que não existe')
    for (let i = 0; i < 2; i++) {
      if (fetchedServant.inventory.carriedWeapons[i] !== undefined && fetchedServant.inventory.carriedWeapons[i].type === weaponType) {
        fetchedServant.inventory.currentWeapon = fetchedServant.inventory.carriedWeapons[i]
        fetchedServant.inventory.carriedWeapons.splice(i, 1)
        this.servantRepository.update(servantName, fetchedServant)
        return fetchedServant
      }
    }
    throw new Error(`O servo ${servantName} não possui nenhuma arma do tipo ${weaponType}`)
  }

  dropWeapon = (servantName: string, weaponType: WeaponType): Servant => {
    const fetchedServant = this.servantRepository.get(servantName)
    if (fetchedServant === null) throw new Error(`O servo ${servantName} não existe`)
    for (let i = 0; i < 2; i++) {
      if (fetchedServant.inventory.carriedWeapons[i] !== undefined && fetchedServant.inventory.carriedWeapons[i].type === weaponType) {
        console.log(fetchedServant.inventory.carriedWeapons[i].type)
        fetchedServant.inventory.carriedWeapons.splice(i, 1)
        this.servantRepository.update(servantName, fetchedServant)
        return fetchedServant
      }
    }
    throw new Error(`O servo ${servantName} não possui nenhua arma do tipo ${weaponType} para que ele possa descartar`)
  }

  delete = (name: string): Servant => {
    const servantToBeDeleted = this.servantRepository.delete(name)
    if (servantToBeDeleted != null) return servantToBeDeleted
    throw new Error('Não é possível remover um servo que não existe')
  }

  applyGuard (name: string, guardToBeApplied: number): Servant {
    const servant = this.servantRepository.get(name)
    if (servant != null) {
      servant.guard = guardToBeApplied
      this.servantRepository.update(name, servant)
      return servant
    }
    throw new Error('Não é possível aplicar guarda em um servo que não existe')
  }

  buff (name: string, buffValue: number): Servant {
    const servant = this.servantRepository.get(name)
    if (servant != null) {
      servant.buff += buffValue
      this.servantRepository.update(name, servant)
      return servant
    }
    throw new Error('Não é possível bufar um servo que não existe')
  }

  removeBuff (name: string): Servant {
    const servant = this.servantRepository.get(name)
    if (servant != null) {
      servant.buff = 0
      this.servantRepository.update(name, servant)
      return servant
    }
    throw new Error('Não é possível bufar um servo que não existe')
  }

  debuff (name: string, debuffValue: number): Servant {
    const servant = this.servantRepository.get(name)
    if (servant != null) {
      servant.debuff += debuffValue
      this.servantRepository.update(name, servant)
      return servant
    }
    throw new Error('Não é possível bufar um servo que não existe')
  }

  removeDebuff (name: string): Servant {
    const servant = this.servantRepository.get(name)
    if (servant != null) {
      servant.debuff = 0
      this.servantRepository.update(name, servant)
      return servant
    }
    throw new Error('Não é possível bufar um servo que não existe')
  }

  attack (attacker: Servant, attackerDiceResult: number, defender: Servant, defenderDiceResult: number, attackType: AttackType): AttackTestResult {
    if (attackType === 'strike') return this.strike(attacker, attackerDiceResult, defender, defenderDiceResult)
    else if (attackType === 'throw') return this.throw(attacker, attackerDiceResult, defender, defenderDiceResult)
    else if (attackType === 'shoot') return this.shoot(attacker, attackerDiceResult, defender, defenderDiceResult)
    else throw new Error('Tipo de ataque inválido')
  }

  strike (attacker: Servant, attackerDiceResult: number, defender: Servant, defenderDiceResult: number): AttackTestResult {
    let attackerTestResult
    let defenderTestResult
    attacker.guard = 0
    this.servantRepository.update(attacker.name, attacker)
    if (defender.currentAttributes.agility > defender.currentAttributes.technique + defender.guard) {
      attackerTestResult = attacker.currentAttributes.agility + attacker.buff - attacker.debuff + attackerDiceResult
      defenderTestResult = defender.currentAttributes.agility + defender.buff - defender.debuff + defenderDiceResult
      if (attacker.inventory.currentWeapon.type === 'mão nua') defenderTestResult += 5
      if (defender.inventory.currentWeapon.type === 'mão nua') attackerTestResult += 5
      if (defenderTestResult >= attackerTestResult * 2) {
        return 'Contra-ataque'
      } else if (defenderTestResult >= attackerTestResult) return 'Desvio'
      else return 'Acerto'
    } else {
      attackerTestResult = attacker.currentAttributes.agility + attacker.buff - attacker.debuff + attackerDiceResult
      defenderTestResult = defender.currentAttributes.technique + defender.guard + defender.buff - defender.debuff + defenderDiceResult
      if (attacker.inventory.currentWeapon.type === 'mão nua') defenderTestResult += 5
      if (defender.inventory.currentWeapon.type === 'mão nua') attackerTestResult += 5
      if (defenderTestResult >= attackerTestResult * 2) return ('Desarme')
      else if (defenderTestResult >= attackerTestResult) return ('Defesa')
      else return 'Acerto'
    }
  }

  throw (attacker: Servant, attackerDiceResult: number, defender: Servant, defenderDiceResult: number): AttackTestResult {
    let attackerTestResult
    let defenderTestResult
    attacker.guard = 0
    this.servantRepository.update(attacker.name, attacker)
    if (defender.currentAttributes.agility > defender.currentAttributes.technique + defender.guard) {
      attackerTestResult = attacker.currentAttributes.technique + attacker.buff - attacker.debuff + attackerDiceResult
      defenderTestResult = defender.currentAttributes.agility + defender.buff - defender.debuff + defenderDiceResult
      if (!attacker.inventory.currentWeapon.throwable) throw new Error(`Não é possível lançar a arma que o servo ${attacker.name} possui em mãos`)
      if (defender.inventory.currentWeapon.type === 'mão nua') attackerTestResult += 5
      if (defenderTestResult >= attackerTestResult * 2) {
        return 'Desequilíbrio'
      } else if (defenderTestResult >= attackerTestResult) return 'Erro'
      else return 'Acerto'
    } else {
      attackerTestResult = attacker.currentAttributes.technique + attacker.buff - attacker.debuff + attackerDiceResult
      defenderTestResult = defender.currentAttributes.technique + defender.guard + defender.buff - defender.debuff + defenderDiceResult
      if (defender.inventory.currentWeapon.type === 'mão nua') attackerTestResult += 5
      if (defenderTestResult >= attackerTestResult * 2) return 'Desequilíbrio'
      else if (defenderTestResult >= attackerTestResult) return 'Defesa'
      else return 'Acerto'
    }
  }

  shoot (attacker: Servant, attackerDiceResult: number, defender: Servant, defenderDiceResult: number): AttackTestResult {
    let attackerTestResult
    let defenderTestResult
    attacker.guard = 0
    this.servantRepository.update(attacker.name, attacker)
    if (defender.currentAttributes.agility > defender.currentAttributes.technique + defender.guard) {
      attackerTestResult = attacker.currentAttributes.technique + attacker.buff - attacker.debuff + attackerDiceResult
      defenderTestResult = defender.currentAttributes.agility + defender.buff - defender.debuff + defenderDiceResult
      if (defender.inventory.currentWeapon.type === 'mão nua') attackerTestResult += 5
      if (defenderTestResult >= attackerTestResult * 2) {
        return 'Recarga demorada'
      } else if (defenderTestResult >= attackerTestResult) return 'Desvio'
      else return 'Acerto'
    } else {
      attackerTestResult = attacker.currentAttributes.technique + attacker.buff - attacker.debuff + attackerDiceResult
      defenderTestResult = defender.currentAttributes.technique + defender.guard + defender.buff - defender.debuff + defenderDiceResult
      if (defender.inventory.currentWeapon.type === 'mão nua') attackerTestResult += 5
      if (defenderTestResult >= attackerTestResult * 2) return ('Recarga demorada')
      else if (defenderTestResult >= attackerTestResult) return ('Desvio')
      else return 'Acerto'
    }
  }

  armorEvasionTest (attacker: Servant, attackerDiceResult: number, defender: Servant, defenderDiceResult: number): ArmorEvasionTestResult {
    if (attacker.currentAttributes.technique + attackerDiceResult > defender.currentAttributes.technique + defenderDiceResult) return 'Evaded armor'
    else return 'Hit armor'
  }

  getDamageToDeal (attacker: Servant, attackerDiceResult: number, attackerWeapon: Weapon, defender: Servant, defenderArmorType: ArmorType, defenderDiceResult: number): number {
    console.log('dado do atacante:', attackerDiceResult)
    console.log('dado do defensor:', defenderDiceResult)
    console.log('fortitude do defensor:', defender.currentAttributes.fortitude)
    console.log('tipo de arma do atacante:', attackerWeapon.type)
    console.log('tipo de armadura do defensor:', defenderArmorType)
    console.log('mastria na arma usada = ', this.getAttackerMaestryFromWeaponUsed(attacker, attackerWeapon))
    let attackerTestResult = attacker.currentAttributes.strength + attackerDiceResult
    const defenderTestResult = defender.currentAttributes.fortitude + defenderDiceResult
    attackerTestResult += this.getAttackerMaestryFromWeaponUsed(attacker, attackerWeapon)
    attackerTestResult += this.getWeaponArmourDamageRelation(attacker.inventory.currentWeapon, defenderArmorType)
    console.log(attackerTestResult)
    console.log(defenderTestResult)
    return attackerTestResult - defenderTestResult
  }

  getAttackerMaestryFromWeaponUsed (attacker: Servant, weapon: Weapon): number {
    if (weapon.type === 'mão nua') return attacker.maestry.bareHanded
    else if (weapon.type === 'machado' || weapon.type === 'adaga' || weapon.type === 'martelo' || weapon.type === 'maça' || weapon.type === 'espada') return attacker.maestry.oneHanded
    else if (weapon.type === 'espada bastarda' || weapon.type === 'machado de batalha') return attacker.maestry.twoHanded
    else if (weapon.type === 'lança' || weapon.type === 'bastão') return attacker.maestry.polearm
    else if (weapon.type === 'arco') return attacker.maestry.bow
    else if (weapon.type === 'besta') return attacker.maestry.crossbow
    else throw new Error('Tipo de arma inválido')
  }

  getWeaponArmourDamageRelation (weapon: Weapon, defenderArmorType: ArmorType): number {
    if (weapon.damageType === 'corte' && defenderArmorType === 'roupa') return 6
    if (weapon.damageType === 'corte' && defenderArmorType === 'couro') return 4
    if (weapon.damageType === 'corte' && defenderArmorType === 'cota de malha') return 2
    if (weapon.damageType === 'corte' && defenderArmorType === 'placa') return -3
    if (weapon.damageType === 'perfuração' && defenderArmorType === 'roupa') return 6
    if (weapon.damageType === 'perfuração' && defenderArmorType === 'couro') return 5
    if (weapon.damageType === 'perfuração' && defenderArmorType === 'cota de malha') return -1
    if (weapon.damageType === 'perfuração' && defenderArmorType === 'placa') return -1
    if (weapon.damageType === 'impacto' && defenderArmorType === 'roupa') return 5
    if (weapon.damageType === 'impacto' && defenderArmorType === 'couro') return 3
    if (weapon.damageType === 'impacto' && defenderArmorType === 'cota de malha') return 1
    if (weapon.damageType === 'impacto' && defenderArmorType === 'placa') return 0
    else throw new Error('Tipo de dano inválido')
  }

  dealDamage (servant: Servant, damageToDeal: number): ServantLifeStatus {
    let damageNotDealt = damageToDeal
    while (damageNotDealt !== 0) {
      if (servant.currentAttributes.agility !== 0 && servant.currentAttributes.agility >= damageNotDealt) {
        servant.currentAttributes.agility -= damageNotDealt
        damageNotDealt = 0
      } else if (servant.currentAttributes.agility !== 0 && servant.currentAttributes.agility < damageNotDealt) {
        damageNotDealt -= servant.currentAttributes.agility
        servant.currentAttributes.agility = 0
      } else if (servant.currentAttributes.technique !== 0 && servant.currentAttributes.technique >= damageNotDealt) {
        servant.currentAttributes.technique -= damageNotDealt
        damageNotDealt = 0
      } else if (servant.currentAttributes.technique !== 0 && servant.currentAttributes.technique < damageNotDealt) {
        damageNotDealt -= servant.currentAttributes.technique
        servant.currentAttributes.technique = 0
      } else if (servant.currentAttributes.strength !== 0 && servant.currentAttributes.strength >= damageNotDealt) {
        servant.currentAttributes.strength -= damageNotDealt
        damageNotDealt = 0
      } else if (servant.currentAttributes.strength !== 0 && servant.currentAttributes.strength < damageNotDealt) {
        damageNotDealt -= servant.currentAttributes.strength
        servant.currentAttributes.strength = 0
      } else if (servant.currentAttributes.fortitude !== 0 && servant.currentAttributes.fortitude >= damageNotDealt) {
        servant.currentAttributes.fortitude -= damageNotDealt
        damageNotDealt = 0
      } else if (servant.currentAttributes.fortitude !== 0 && servant.currentAttributes.fortitude < damageNotDealt) {
        damageNotDealt -= servant.currentAttributes.fortitude
        servant.currentAttributes.fortitude = 0
      } else if (servant.currentAttributes.agility === 0 && servant.currentAttributes.technique === 0 && servant.currentAttributes.strength === 0 && servant.currentAttributes.fortitude === 0) {
        this.servantRepository.delete(servant.name)
        return 'Dead'
      }
    }
    console.log(servant)
    this.servantRepository.update(servant.name, servant)
    return 'Alive'
  }

  heal (servantName: string): Servant {
    const servantToBeUpdated = this.servantRepository.get(servantName)
    if (servantToBeUpdated === null) throw new Error(`O servo ${servantName} não existe`)
    servantToBeUpdated.currentAttributes = servantToBeUpdated.maximumAttributes
    this.servantRepository.update(servantName, servantToBeUpdated)
    return servantToBeUpdated
  }
}

export default ServantService
