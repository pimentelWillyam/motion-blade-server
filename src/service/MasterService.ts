import { type UserType } from '../bot/type/UserType'
import { type MasterDTO, type Master, type MasterFactory } from '../factories/MasterFactory'
import type MasterRepository from '../repository/MasterRepository'

class MasterService {
  constructor (private readonly masterRepository: MasterRepository, private readonly masterFactory: MasterFactory) {}

  create = async (login: string, password: string, type: UserType): Promise<MasterDTO> => {
    if (!await this.masterExists(login)) {
      const master = this.masterFactory.create(login, password, type)
      return await this.masterRepository.create(master)
    }
    throw new Error('Já existe um servo com esse nome')
  }

  getAll = async (): Promise<MasterDTO[]> => {
    return await this.masterRepository.getAll()
  }

  get = async (name: string): Promise<Master> => {
    const fetchedMaster = await this.masterRepository.get(name)
    if (fetchedMaster != null) return this.masterFactory.createByDTO(fetchedMaster)
    throw new Error(`O servo ${name} não existe`)
  }

  masterExists = async (name: string): Promise<boolean> => {
    const fetchedMaster = await this.masterRepository.get(name)
    if (fetchedMaster != null) return true
    return false
  }

  update = async (name: string, contentToUpdate: Master): Promise<MasterDTO> => {
    const masterToBeUpdated = await this.masterRepository.update(name, contentToUpdate)
    if (masterToBeUpdated !== null) return masterToBeUpdated
    throw new Error('Não é possível atualizar um servo que não existe')
  }

  delete = async (name: string): Promise<MasterDTO> => {
    const masterToBeDeleted = await this.masterRepository.delete(name)
    if (masterToBeDeleted != null) return masterToBeDeleted
    throw new Error('Não é possível remover um servo que não existe')
  }
}

export default MasterService
