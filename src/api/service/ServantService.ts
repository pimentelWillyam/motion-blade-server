import type UuidGenerator from '../../bot/helper/UuidGenerator'
import type Servant from '../../bot/model/Servant'
import type Profession from '../../bot/type/Profession'
import type DateManager from '../../helper/DateManager'
import type ServantRepository from '../repository/ServantRepository'

class ServantService {
  constructor (readonly servantRepository: ServantRepository, readonly uuidGenerator: UuidGenerator, readonly dateManager: DateManager) {}

  create (masterId: string, name: string, fatherProfession: Profession, youthProfession: Profession): Servant {
    return this.servantRepository.create(masterId, name, fatherProfession, youthProfession)
  }

  async getAll (): Promise<IServantEntity[]> {
    return await this.ServantRepository.getAll()
  }

  async get (id: string): Promise<IServantEntity | null> {
    return await this.ServantRepository.get(id)
  }
}

export default ServantService
