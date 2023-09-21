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

  getAll (): Servant[] {
    return this.servantRepository.getAll()
  }

  get (id: string): Servant | null {
    return this.servantRepository.get(id)
  }
}

export default ServantService
