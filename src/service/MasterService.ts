import { type UserType } from '../bot/type/UserType'
import { type MasterDTO, type Master, type MasterFactory } from '../factories/MasterFactory'
import type MasterRepository from '../repository/MasterRepository'

class MasterService {
  constructor (private readonly masterRepository: MasterRepository, private readonly masterFactory: MasterFactory) {}

  create = async (login: string, password: string, type: UserType): Promise<MasterDTO> => {
    console.log('bateu aqui')
    if (!await this.masterExists(login)) {
      console.log('bateu aqui')

      const master = this.masterFactory.create(login, password, type)
      return await this.masterRepository.create(master)
    }
    throw new Error('Já existe um servo com esse nome')
  }

  getAll = async (): Promise<MasterDTO[]> => {
    return await this.masterRepository.getAll()
  }

  get = async (login: string): Promise<Master> => {
    const fetchedMaster = await this.masterRepository.get(login)
    console.log(fetchedMaster)
    if (fetchedMaster != null) return this.masterFactory.createByDTO(fetchedMaster)
    throw new Error(`O servo ${login} não existe`)
  }

  masterExists = async (login: string): Promise<boolean> => {
    const fetchedMaster = await this.masterRepository.get(login)
    if (fetchedMaster != null) return true
    return false
  }

  update = async (login: string, contentToUpdate: Master): Promise<MasterDTO> => {
    const masterToBeUpdated = await this.masterRepository.update(login, contentToUpdate)
    if (masterToBeUpdated !== null) return masterToBeUpdated
    throw new Error('Não é possível atualizar um servo que não existe')
  }

  delete = async (login: string): Promise<MasterDTO> => {
    const masterToBeDeleted = await this.masterRepository.delete(login)
    if (masterToBeDeleted != null) return masterToBeDeleted
    throw new Error('Não é possível remover um servo que não existe')
  }
}

export default MasterService
