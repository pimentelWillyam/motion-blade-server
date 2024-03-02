import type ArmorEvasionTestResult from '../bot/type/ArmorEvasionTestResult'
import type ArmorType from '../bot/type/ArmorType'
import type Attribute from '../bot/type/Attribute'
import type Attributes from '../bot/type/Attributes'
import { type BattlePoint } from '../bot/type/BattlePoint'
import { type BattlePoints } from '../bot/type/BattlePoints'
import type MaestryType from '../bot/type/MaestryType'
import type Profession from '../bot/type/Profession'
import type ServantLifeStatus from '../bot/type/ServantLifeStatus'
import type WeaponType from '../bot/type/WeaponType'
import type { ArmorFactory } from '../factories/ArmorFactory'
import { type ServantDTO, type Servant, type ServantFactory } from '../factories/ServantFactory'
import type { WeaponFactory } from '../factories/WeaponFactory'
import type AttributesFetcher from '../helper/AttributesFetcher'
import type ServantRepository from '../repository/ServantRepository'

class ServantService {
  constructor (private readonly servantRepository: ServantRepository, private readonly attributesFetcher: AttributesFetcher, private readonly servantFactory: ServantFactory, private readonly armorFactory: ArmorFactory, private readonly weaponFactory: WeaponFactory) {}

  create = async (masterId: string, name: string, fatherProfession: Profession, youthProfession: Profession, customCreation: boolean, attributes: Attributes = { agility: 0, technique: 0, strength: 0, fortitude: 0 }): Promise<ServantDTO> => {
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

  getAll = async (): Promise<ServantDTO[]> => {
    return await this.servantRepository.getAll()
  }

  get = async (name: string): Promise<Servant> => {
    const fetchedServant = await this.servantRepository.getByName(name)
    if (fetchedServant != null) return this.servantFactory.createThroughDto(fetchedServant)
    throw new Error(`O servo ${name} não existe`)
  }

  servantExists = async (name: string): Promise<boolean> => {
    const fetchedServant = await this.servantRepository.getByName(name)
    if (fetchedServant != null) return true
    return false
  }

  update = async (name: string, contentToUpdate: Servant): Promise<ServantDTO> => {
    const servantToBeUpdated = await this.servantRepository.update(name, contentToUpdate)
    if (servantToBeUpdated !== null) return servantToBeUpdated
    throw new Error('Não é possível atualizar um servo que não existe')
  }

  async rollTurnForServants (servantList: Servant[]): Promise<void> {
    for (let i = 0; i < servantList.length; i++) {
      console.log(servantList[0].generateBattlePoints())
      servantList[i].generateBattlePoints()
      await this.update(servantList[i].name, servantList[i])
    }
  }

  async rollTurnForServant (servantName: string): Promise<void> {
    const servant = await this.get(servantName)
    servant.generateBattlePoints()
    await this.update(servant.name, servant)
  }

  upgrade = async (name: string, propertyToUpgrade: MaestryType | Attribute, quantityToUpgrade: number): Promise<ServantDTO> => {
    const servantToUpgrade = await this.get(name)
    servantToUpgrade.upgrade(propertyToUpgrade, quantityToUpgrade)
    await this.servantRepository.update(name, servantToUpgrade)
    return servantToUpgrade
  }

  spendBattlePoints = async (name: string, battlePointToSpend: BattlePoint): Promise<void> => {
    const servant = await this.get(name)
    servant.spendBattlePoint(battlePointToSpend)
    await this.servantRepository.update(name, servant)
  }

  reduceBattlePoints = async (name: string): Promise<void> => {
    const servant = await this.get(name)
    servant.reduceBattlePoints()
    await this.servantRepository.update(name, servant)
  }

  generateServantBattlePoints = async (name: string): Promise<BattlePoints> => {
    const servant = await this.get(name)
    const generatedBattlePoints = servant.generateBattlePoints()
    await this.servantRepository.update(name, servant)
    return generatedBattlePoints
  }

  wearArmor = async (name: string, armorType: ArmorType): Promise<void> => {
    const servantToWearArmor = await this.get(name)
    servantToWearArmor.wearArmor(armorType)
    await this.servantRepository.update(servantToWearArmor.name, servantToWearArmor)
  }

  removeArmor = async (servant: Servant): Promise<void> => {
    servant.wearArmor('roupa')
    await this.servantRepository.update(servant.name, servant)
  }

  addWeaponToInventory = async (servantName: string, weaponType: WeaponType): Promise<void> => {
    const fetchedServant = await this.get(servantName)
    fetchedServant.addWeaponToInventory(weaponType)
    await this.servantRepository.update(servantName, fetchedServant)
  }

  drawWeapon = async (servantName: string, weaponType: WeaponType): Promise<void> => {
    const fetchedServant = await this.get(servantName)
    fetchedServant.drawWeapon(weaponType)
    await this.servantRepository.update(servantName, fetchedServant)
  }

  dropWeapon = async (servantName: string, weaponType: WeaponType): Promise<void> => {
    const fetchedServant = await this.get(servantName)
    fetchedServant.removeWeaponFromInventory(weaponType)
    await this.servantRepository.update(servantName, fetchedServant)
  }

  disarm = async (servantName: string): Promise<void> => {
    const fetchedServant = await this.get(servantName)
    fetchedServant.disarm()
    await this.servantRepository.update(servantName, fetchedServant)
  }

  delete = async (name: string): Promise<ServantDTO> => {
    const servantToBeDeleted = await this.servantRepository.delete(name)
    if (servantToBeDeleted != null) return servantToBeDeleted
    throw new Error('Não é possível remover um servo que não existe')
  }

  applyGuard = async (name: string, guardToBeApplied: number): Promise<void> => {
    const servant = await this.get(name)
    servant.applyGuard(guardToBeApplied)
    await this.servantRepository.update(name, servant)
  }

  buff = async (name: string, buffValue: number): Promise<void> => {
    const servant = await this.get(name)
    servant.buff(buffValue)
    await this.servantRepository.update(name, servant)
  }

  removeBuff = async (name: string): Promise<void> => {
    const servant = await this.get(name)
    servant.removeBuff()
    await this.servantRepository.update(name, servant)
  }

  debuff = async (name: string, debuffValue: number): Promise<void> => {
    const servant = await this.get(name)
    servant.debuff(debuffValue)
    await this.servantRepository.update(name, servant)
  }

  removeDebuff = async (name: string): Promise<void> => {
    const servant = await this.get(name)
    servant.removeDebuff()
    await this.servantRepository.update(name, servant)
  }

  armorEvasionTest = async (attackerName: string, attackerDiceResult: number, defenderName: string, defenderDiceResult: number): Promise<ArmorEvasionTestResult> => {
    const attacker = await this.get(attackerName)
    const defender = await this.get(defenderName)
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
        await this.delete(servant.name)
        return 'Dead'
      }
    }
    await this.servantRepository.update(servant.name, servant)
    return 'Alive'
  }

  heal = async (servantName: string): Promise<ServantDTO> => {
    const servantToBeUpdated = await this.get(servantName)
    if (servantToBeUpdated === null) throw new Error(`O servo ${servantName} não existe`)
    servantToBeUpdated.currentAttributes = servantToBeUpdated.maximumAttributes
    await this.servantRepository.update(servantName, servantToBeUpdated)
    return servantToBeUpdated
  }

  addDenars = async (servantName: string, addedMoney: number): Promise<ServantDTO> => {
    const servantToBeUpdated = await this.get(servantName)
    if (servantToBeUpdated === null) throw new Error(`O servo ${servantName} não existe`)
    servantToBeUpdated.inventory.denars += addedMoney
    await this.servantRepository.update(servantName, servantToBeUpdated)
    return servantToBeUpdated
  }

  removeDenars = async (servantName: string, deductedMoney: number): Promise<ServantDTO> => {
    const servantToBeUpdated = await this.get(servantName)
    if (servantToBeUpdated === null) throw new Error(`O servo ${servantName} não existe`)
    servantToBeUpdated.inventory.denars -= deductedMoney
    await this.servantRepository.update(servantName, servantToBeUpdated)
    return servantToBeUpdated
  }
}

export default ServantService
