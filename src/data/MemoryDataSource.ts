import Servant from '../bot/model/Servant'
import type Profession from '../bot/type/Profession'
import type UuidGenerator from '../bot/helper/UuidGenerator'
import type Weapon from '../bot/type/Weapon'
import type Armor from '../bot/type/Armor'
import type Attributes from '../bot/type/Attributes'

class MemoryDataSource {
  private servantList: Servant[] = []

  constructor (private readonly uuidGenerator: UuidGenerator) {}

  readonly start = (): void => {
    this.createServantTable()
  }

  private readonly createServantTable = (): void => {
    this.servantList = []
  }

  insertServantRegistry = (masterId: string, name: string, fatherProfession: Profession, youthProfession: Profession, armor: Armor, bareHand: Weapon, attributes: Attributes): Servant => {
    const servant: Servant = new Servant(this.uuidGenerator.generate(), masterId, name, fatherProfession, youthProfession, armor, bareHand, attributes)
    this.servantList.push(servant)
    return servant
  }

  fetchEveryServantRegistry = (): Servant[] => {
    return this.servantList
  }

  fetchServantByName = (name: string): Servant | null => {
    for (let i = 0; i < this.servantList.length; i++) {
      if (this.servantList[i].name === name) return this.servantList[i]
    }
    return null
  }

  updateServantByName = (name: string, updatedServant: Servant): Servant => {
    for (let i = 0; i < this.servantList.length; i++) {
      if (this.servantList[i].name === name) {
        // if (contentToUpdate.currentAttributes !== undefined) this.servantList[i].currentAttributes = contentToUpdate.currentAttributes
        // if (contentToUpdate.currentWeapon !== undefined) this.servantList[i].currentWeapon = contentToUpdate.currentWeapon
        // if (contentToUpdate.armor !== undefined) this.servantList[i].armor = contentToUpdate.armor
        // if (contentToUpdate.currentAttributes !== undefined) this.servantList[i].currentAttributes = contentToUpdate.currentAttributes
        // if (contentToUpdate.maximumAttributes !== undefined) this.servantList[i].maximumAttributes = contentToUpdate.maximumAttributes
        // if (contentToUpdate.maestry !== undefined) this.servantList[i].maestry = contentToUpdate.maestry
        this.servantList[i] = updatedServant
        return this.servantList[i]
      }
    }
    throw new Error('Servo não encontrado')
  }

  deleteServantByName = (name: string): Servant => {
    for (let i = 0; i < this.servantList.length; i++) {
      if (this.servantList[i].name === name) {
        const deletedServer = this.servantList[i]
        this.servantList.splice(i, 1)
        return deletedServer
      }
    }
    throw new Error('Servo não encontrado')
  }
}

export default MemoryDataSource
