import type Servant from '../../bot/model/Servant'
import type Profession from '../../bot/type/Profession'
import type MemoryDataSource from '../../data/memory/MemoryDataSource'

class ServantRepository {
  constructor (readonly dataSource: MemoryDataSource) {}

  create (masterId: string, name: string, fatherProfession: Profession, youthProfession: Profession): Servant {
    return this.dataSource.insertServantRegistry(masterId, name, fatherProfession, youthProfession)
  }

  // async createCustomServant (masterId: string, id: string, name: string, fatherProfession: string, youthProfession: string): Promise<IServantEntity> {
  //   const log = { id, date, message }
  //   await this.dataSource.insertCustomAttributesServantRegistry(masterId, name, fatherProfession, youthProfession, agility, technique, strength, fortitude)
  //   return log
  // }

  getAll (): Servant[] {
    return this.dataSource.fetchEveryServantRegistry()
  }

  get (name: string): Servant | null {
    return this.dataSource.fetchServantByName(name)
  }
}

export default ServantRepository
