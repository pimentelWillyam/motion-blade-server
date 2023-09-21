import type UuidGenerator from '../../bot/helper/UuidGenerator'
import type Servant from '../../bot/model/Servant'
import type Profession from '../../bot/type/Profession'
import type DateManager from '../../helper/DateManager'
import type ServantRepository from '../repository/ServantRepository'

class ServantService {
  constructor (readonly ServantRepository: IServantRepository, readonly uuidGenerator: IUuidGenerator, readonly dateManager: IDateManager) {}

  async create (message: string): Promise<IServantEntity> {
    return await this.ServantRepository.create(this.uuidGenerator.generate(), message, this.dateManager.getCurrentDateTime())
  }

  async getAll (): Promise<IServantEntity[]> {
    return await this.ServantRepository.getAll()
  }

  async get (id: string): Promise<IServantEntity | null> {
    return await this.ServantRepository.get(id)
  }
}

export default ServantService
