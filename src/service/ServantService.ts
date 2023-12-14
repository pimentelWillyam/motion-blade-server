import type ArmorEvasionTestResult from '../bot/type/ArmorEvasionTestResult'
import type ArmorType from '../bot/type/ArmorType'
import type Attribute from '../bot/type/Attribute'
import type Attributes from '../bot/type/Attributes'
import type Inventory from '../bot/type/Inventory'
import type Maestry from '../bot/type/Maestry'
import type MaestryType from '../bot/type/MaestryType'
import type Profession from '../bot/type/Profession'
import type ServantLifeStatus from '../bot/type/ServantLifeStatus'
import type WeaponType from '../bot/type/WeaponType'
import type { ArmorFactory } from '../factories/ArmorFactory'
import { type Servant, type ServantFactory } from '../factories/ServantFactory'
import type { WeaponFactory } from '../factories/WeaponFactory'
import type AttributesFetcher from '../helper/AttributesFetcher'
import type ServantRepository from '../repository/ServantRepository'

class ServantService {
  constructor (private readonly servantRepository: ServantRepository, private readonly attributesFetcher: AttributesFetcher, private readonly servantFactory: ServantFactory, private readonly armorFactory: ArmorFactory, private readonly weaponFactory: WeaponFactory) {}

  create = async (masterId: string, name: string, fatherProfession: Profession, youthProfession: Profession, customCreation: boolean, attributes: Attributes = { agility: 0, technique: 0, strength: 0, fortitude: 0 }): Promise<Servant> => {
    if (!await this.servantExists(name)) {
      if (!customCreation) {
        attributes = this.attributesFetcher.fetchAttributesBasedOnBackground(fatherProfession, youthProfession)
        const servant = this.servantFactory.create(masterId, name, fatherProfession, youthProfession, attributes)
        return await this.servantRepository.create(servant)
      }
      const servant = this.servantFactory.create(masterId, name, fatherProfession, youthProfession, attributes)
      return await this.servantRepository.create(servant)
    }
    throw new Error('Já existe um servo com esse nome')
  }

  getAll = async (): Promise<Servant[]> => {
    return await this.servantRepository.getAll()
  }

  get = async (name: string): Promise<Servant> => {
    const fetchedServant = await this.servantRepository.getByName(name)
    if (fetchedServant != null) return fetchedServant
    throw new Error(`O servo ${name} não existe`)
  }

  servantExists = async (name: string): Promise<boolean> => {
    const fetchedServant = await this.servantRepository.getByName(name)
    if (fetchedServant != null) return true
    return false
  }

  getCurrentAttributes = async (name: string): Promise<Attributes> => {
    const fetchedServant = await this.servantRepository.getByName(name)
    if (fetchedServant != null) return fetchedServant.currentAttributes
    throw new Error(`O servo ${name} não existe`)
  }

  getMaximumAttributes = async (name: string): Promise<Attributes> => {
    const fetchedServant = await this.servantRepository.getByName(name)
    if (fetchedServant != null) return fetchedServant.maximumAttributes
    throw new Error(`O servo ${name} não existe`)
  }

  getMaestry = async (name: string): Promise<Maestry> => {
    const fetchedServant = await this.servantRepository.getByName(name)
    if (fetchedServant != null) return fetchedServant.maestry
    throw new Error(`O servo ${name} não existe`)
  }

  getInventory = async (name: string): Promise<Inventory> => {
    const fetchedServant = await this.servantRepository.getByName(name)
    if (fetchedServant != null) return fetchedServant.inventory
    throw new Error(`O servo ${name} não existe`)
  }

  update = async (name: string, contentToUpdate: Servant): Promise<Servant> => {
    const servantToBeUpdated = await this.servantRepository.update(name, contentToUpdate)
    if (servantToBeUpdated != null) return servantToBeUpdated
    throw new Error('Não é possível atualizar um servo que não existe')
  }

  rollTurnForServants (servantList: Servant[]): void {
    console.log('oi')
  }

  upgrade = async (name: string, propertyToUpgrade: MaestryType | Attribute, quantityToUpgrade: number): Promise<Servant> => {
    const contentToUpgrade = await this.servantRepository.getByName(name)
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
    await this.servantRepository.update(name, contentToUpgrade)
    return contentToUpgrade
  }

  wearArmor = async (servant: Servant, armorType: ArmorType): Promise<Servant> => {
    switch (armorType) {
      case 'palha':
        servant.inventory.primaryArmor = this.armorFactory.createArmorByType('placa')
        servant.inventory.secondaryArmor = this.armorFactory.createArmorByType('cota de malha')
        break

      case 'pouro':
        servant.inventory.primaryArmor = this.armorFactory.createArmorByType('placa')
        servant.inventory.secondaryArmor = this.armorFactory.createArmorByType('couro')
        break

      default:
        servant.inventory.primaryArmor = this.armorFactory.createArmorByType(armorType)
        break
    }
    await this.servantRepository.update(servant.name, servant)
    return servant
  }

  removeArmor = async (servant: Servant): Promise<Servant> => {
    const clothArmor = this.armorFactory.createArmorByType('roupa')
    servant.inventory.primaryArmor = clothArmor
    servant.inventory.secondaryArmor = clothArmor
    await this.servantRepository.update(servant.name, servant)
    return servant
  }

  keepWeapon = async (servantName: string, weaponType: WeaponType): Promise<Servant> => {
    const fetchedServant = await this.servantRepository.getByName(servantName)
    if (fetchedServant === null) throw new Error(`O servo ${servantName} não existe`)
    else if (fetchedServant.inventory.carriedWeapons.length >= 2) throw new Error(`O servo ${fetchedServant.name} já está carregando muitas armas, jogue alguma fora para aumentar o espaço disponível`)
    fetchedServant.inventory.primaryWeapon = this.weaponFactory.createWeapon('mão nua')
    fetchedServant.inventory.secondaryWeapon = null
    fetchedServant.inventory.carriedWeapons.push(this.weaponFactory.createWeapon(weaponType))
    await this.servantRepository.update(servantName, fetchedServant)
    return fetchedServant
  }

  drawWeapon = async (servantName: string, weaponType: WeaponType): Promise<Servant> => {
    const fetchedServant = await this.servantRepository.getByName(servantName)
    const weaponToBeDrawed = this.weaponFactory.createWeapon(weaponType)
    if (fetchedServant === null) throw new Error('Não é possível encontrar um servo que não existe')
    if (weaponToBeDrawed.type !== 'mão nua' && weaponToBeDrawed.needsTwoHandsToWield && (fetchedServant.inventory.primaryWeapon.type !== 'mão nua' || fetchedServant.inventory.secondaryWeapon != null)) throw new Error(`O servo ${fetchedServant.name} está atualmente com as mãos ocupadas e não pode sacar um(a) ${weaponType}`)
    if (weaponToBeDrawed.type !== 'mão nua' && !weaponToBeDrawed.needsTwoHandsToWield && (fetchedServant.inventory.secondaryWeapon != null)) throw new Error(`O servo ${fetchedServant.name} não pode sacar um(a) ${weaponType} pois já está com as duas mãos ocupadas`)
    for (let i = 0; i < 2; i++) {
      if (fetchedServant.inventory.carriedWeapons[i].type === weaponToBeDrawed.type) {
        if ((weaponToBeDrawed.type === 'escudo redondo' || weaponToBeDrawed.type === 'escudo' || weaponToBeDrawed.type === 'scutum') && (fetchedServant.inventory.secondaryWeapon === null)) fetchedServant.inventory.secondaryWeapon = weaponToBeDrawed
        else if (fetchedServant.inventory.primaryWeapon.type === 'mão nua') fetchedServant.inventory.primaryWeapon = weaponToBeDrawed
        else fetchedServant.inventory.secondaryWeapon = weaponToBeDrawed
        fetchedServant.inventory.carriedWeapons.splice(i, 1)
        await this.servantRepository.update(servantName, fetchedServant)
        return fetchedServant
      }
    }
    throw new Error(`O servo ${servantName} não possui nenhuma arma do tipo ${weaponType}`)
  }

  dropWeapon = async (servantName: string, weaponType: WeaponType): Promise<Servant> => {
    const fetchedServant = await this.servantRepository.getByName(servantName)
    if (fetchedServant === null) throw new Error(`O servo ${servantName} não existe`)
    for (let i = 0; i < 2; i++) {
      if (fetchedServant.inventory.carriedWeapons[i] !== undefined && fetchedServant.inventory.carriedWeapons[i].type === weaponType) {
        fetchedServant.inventory.carriedWeapons.splice(i, 1)
        await this.servantRepository.update(servantName, fetchedServant)
        return fetchedServant
      }
    }
    throw new Error(`O servo ${servantName} não possui nenhua arma do tipo ${weaponType} para que ele possa descartar`)
  }

  disarm = async (servantToBeDisarmed: Servant): Promise<Servant> => {
    if (servantToBeDisarmed.inventory.primaryWeapon.needsTwoHandsToWield) {
      servantToBeDisarmed.inventory.primaryWeapon = this.weaponFactory.createWeapon('mão nua')
    } else if (servantToBeDisarmed.inventory.secondaryWeapon === null) {
      servantToBeDisarmed.inventory.primaryWeapon = this.weaponFactory.createWeapon('mão nua')
    } else if (servantToBeDisarmed.inventory.secondaryWeapon !== null && (servantToBeDisarmed.inventory.secondaryWeapon.type === 'escudo redondo' || servantToBeDisarmed.inventory.secondaryWeapon.type === 'escudo' || servantToBeDisarmed.inventory.secondaryWeapon.type === 'scutum')) {
      servantToBeDisarmed.inventory.primaryWeapon = this.weaponFactory.createWeapon('mão nua')
    } else if (servantToBeDisarmed.inventory.secondaryWeapon !== null && (servantToBeDisarmed.inventory.secondaryWeapon.type === 'escudo redondo' || servantToBeDisarmed.inventory.secondaryWeapon.type === 'escudo' || servantToBeDisarmed.inventory.secondaryWeapon.type === 'scutum')) {
      servantToBeDisarmed.inventory.primaryWeapon = this.weaponFactory.createWeapon('mão nua')
    } else if (servantToBeDisarmed.inventory.secondaryWeapon !== null && !(servantToBeDisarmed.inventory.secondaryWeapon.type === 'escudo redondo' || servantToBeDisarmed.inventory.secondaryWeapon.type === 'escudo' || servantToBeDisarmed.inventory.secondaryWeapon.type === 'scutum')) {
      servantToBeDisarmed.inventory.primaryWeapon = servantToBeDisarmed.inventory.secondaryWeapon
      servantToBeDisarmed.inventory.secondaryWeapon = null
    }
    await this.servantRepository.update(servantToBeDisarmed.name, servantToBeDisarmed)
    return servantToBeDisarmed
  }

  delete = async (name: string): Promise<Servant> => {
    const servantToBeDeleted = await this.servantRepository.delete(name)
    if (servantToBeDeleted != null) return servantToBeDeleted
    throw new Error('Não é possível remover um servo que não existe')
  }

  applyGuard = async (name: string, guardToBeApplied: number): Promise<Servant> => {
    const servant = await this.servantRepository.getByName(name)
    if (servant != null) {
      servant.combatCapabilities.guard = guardToBeApplied
      await this.servantRepository.update(name, servant)
      return servant
    }
    throw new Error('Não é possível aplicar guarda em um servo que não existe')
  }

  buff = async (name: string, buffValue: number): Promise<Servant> => {
    const servant = await this.servantRepository.getByName(name)
    if (servant != null) {
      servant.combatCapabilities.buff += buffValue
      await this.servantRepository.update(name, servant)
      return servant
    }
    throw new Error('Não é possível bufar um servo que não existe')
  }

  removeBuff = async (name: string): Promise<Servant> => {
    const servant = await this.servantRepository.getByName(name)
    if (servant != null) {
      servant.buff = 0
      await this.servantRepository.update(name, servant)
      return servant
    }
    throw new Error('Não é possível bufar um servo que não existe')
  }

  debuff = async (name: string, debuffValue: number): Promise<Servant> => {
    const servant = await this.servantRepository.getByName(name)
    if (servant != null) {
      servant.debuff -= debuffValue
      await this.servantRepository.update(name, servant)
      return servant
    }
    throw new Error('Não é possível bufar um servo que não existe')
  }

  removeDebuff = async (name: string): Promise<Servant> => {
    const servant = await this.servantRepository.getByName(name)
    if (servant != null) {
      servant.debuff = 0
      await this.servantRepository.update(name, servant)
      return servant
    }
    throw new Error('Não é possível bufar um servo que não existe')
  }

  armorEvasionTest = (attacker: Servant, attackerDiceResult: number, defender: Servant, defenderDiceResult: number): ArmorEvasionTestResult => {
    if (attacker.currentAttributes.technique + attackerDiceResult > defender.currentAttributes.technique + defenderDiceResult) return 'Evaded armor'
    else return 'Hit armor'
  }

  armorTakesDamage = async (defender: Servant, armorToRecieveDamage: 'primary' | 'secondary', damageToDeal: number): Promise<{ type: 'roupa' | 'couro' | 'cota de malha' | 'placa' | 'pouro' | 'palha', haveBeenBroken: boolean }> => {
    const armorStatus: { type: 'roupa' | 'couro' | 'cota de malha' | 'placa' | 'pouro' | 'palha', haveBeenBroken: boolean } = { haveBeenBroken: false, type: 'roupa' }
    if (armorToRecieveDamage === 'primary' && defender.inventory.primaryArmor.condition - damageToDeal <= 0) {
      armorStatus.type = defender.inventory.primaryArmor.type
      armorStatus.haveBeenBroken = true
      defender.inventory.primaryArmor = defender.inventory.secondaryArmor
      defender.inventory.secondaryArmor = this.armorFactory.createArmorByType('roupa')
    } else if (armorToRecieveDamage === 'secondary' && defender.inventory.secondaryArmor.condition - damageToDeal <= 0) {
      armorStatus.type = defender.inventory.secondaryArmor.type
      armorStatus.haveBeenBroken = true
      defender.inventory.secondaryArmor = this.armorFactory.createArmorByType('roupa')
    } else if (armorToRecieveDamage === 'primary' && defender.inventory.primaryArmor.condition - damageToDeal > 0) defender.inventory.primaryArmor.condition -= damageToDeal
    else if (armorToRecieveDamage === 'secondary' && defender.inventory.secondaryArmor.condition - damageToDeal > 0)defender.inventory.secondaryArmor.condition -= damageToDeal
    await this.update(defender.name, defender)
    return armorStatus
  }

  dealDamage = async (servant: Servant, damageToDeal: number): Promise<ServantLifeStatus> => {
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
        await this.servantRepository.update(servant.name, servant)
        return 'Dead'
      }
    }
    await this.servantRepository.update(servant.name, servant)
    return 'Alive'
  }

  heal = async (servantName: string): Promise<Servant> => {
    const servantToBeUpdated = await this.servantRepository.getByName(servantName)
    if (servantToBeUpdated === null) throw new Error(`O servo ${servantName} não existe`)
    servantToBeUpdated.currentAttributes = servantToBeUpdated.maximumAttributes
    await this.servantRepository.update(servantName, servantToBeUpdated)
    return servantToBeUpdated
  }

  addDenars = async (servantName: string, addedMoney: number): Promise<Servant> => {
    const servantToBeUpdated = await this.servantRepository.getByName(servantName)
    if (servantToBeUpdated === null) throw new Error(`O servo ${servantName} não existe`)
    servantToBeUpdated.inventory.denars += addedMoney
    await this.servantRepository.update(servantName, servantToBeUpdated)
    return servantToBeUpdated
  }

  removeDenars = async (servantName: string, deductedMoney: number): Promise<Servant> => {
    const servantToBeUpdated = await this.servantRepository.getByName(servantName)
    if (servantToBeUpdated === null) throw new Error(`O servo ${servantName} não existe`)
    servantToBeUpdated.inventory.denars -= deductedMoney
    await this.servantRepository.update(servantName, servantToBeUpdated)
    return servantToBeUpdated
  }
}

export default ServantService
