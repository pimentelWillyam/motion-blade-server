import type AttributesFetcher from '../../bot/fetchers/AttributesFetcher'
import Servant from '../../bot/model/Servant'
import type Profession from '../../bot/type/Profession'
import type WeaponFetcher from '../../bot/fetchers/WeaponFetcher'
import type ArmorFetcher from '../../bot/fetchers/ArmorFetcher'
import type UuidGenerator from '../../bot/helper/UuidGenerator'

class MemoryDataSource {
  private servantList: Servant[] = []

  constructor (private readonly uuidGenerator: UuidGenerator, private readonly weaponFetcher: WeaponFetcher, private readonly attributesFetcher: AttributesFetcher, private readonly armorFetcher: ArmorFetcher) {}

  readonly start = (): void => {
    this.createServantTable()
  }

  private readonly createServantTable = (): void => {
    this.servantList = []
  }

  insertServantRegistry = (masterId: string, name: string, fatherProfession: Profession, youthProfession: Profession): Servant => {
    const servant: Servant = new Servant(this.uuidGenerator.generate(), masterId, name, fatherProfession, youthProfession, this.weaponFetcher, this.attributesFetcher, this.armorFetcher)
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

  updateServantByName = (name: string, contentToUpdate: Servant): Servant => {
    for (let i = 0; i < this.servantList.length; i++) {
      if (this.servantList[i].name === name) {
        if (contentToUpdate.weaponList !== undefined) this.servantList[i].weaponList = contentToUpdate.weaponList
        if (contentToUpdate.currentWeapon !== undefined) this.servantList[i].currentWeapon = contentToUpdate.currentWeapon
        if (contentToUpdate.armor !== undefined) this.servantList[i].armor = contentToUpdate.armor
        if (contentToUpdate.currentAttributes !== undefined) this.servantList[i].currentAttributes = contentToUpdate.currentAttributes
        if (contentToUpdate.maximumAttributes !== undefined) this.servantList[i].maximumAttributes = contentToUpdate.maximumAttributes
        if (contentToUpdate.maestry !== undefined) this.servantList[i].maestry = contentToUpdate.maestry
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
