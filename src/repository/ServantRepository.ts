import type Servant from '../bot/model/Servant'
import type Armor from '../bot/type/Armor'
import type Attributes from '../bot/type/Attributes'
import type Profession from '../bot/type/Profession'
import type Weapon from '../bot/type/Weapon'
import type MemoryDataSource from '../data/MemoryDataSource'

class ServantRepository {
  constructor (readonly dataSource: MemoryDataSource) {}

  create (masterId: string, name: string, fatherProfession: Profession, youthProfession: Profession, armor: Armor, bareHand: Weapon, attributes: Attributes): Servant {
    return this.dataSource.insertServantRegistry(masterId, name, fatherProfession, youthProfession, armor, bareHand, attributes)
  }

  getAll (): Servant[] {
    return this.dataSource.fetchEveryServantRegistry()
  }

  get (name: string): Servant | null {
    return this.dataSource.fetchServantByName(name)
  }

  update (name: string, updatedServant: Servant): Servant | null {
    return this.dataSource.updateServantByName(name, updatedServant)
  }

  delete (name: string): Servant | null {
    return this.dataSource.deleteServantByName(name)
  }
}

export default ServantRepository
