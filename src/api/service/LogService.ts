import type IUuidGenerator from '../interface/IUuidGenerator'
import type IDateManager from '../interface/IDateManager'
import type ILogRepository from '../interface/ILogRepository'
import type ILogEntity from '../interface/ILogEntity'
import type ILogService from '../interface/ILogService'

class LogService implements ILogService {
  constructor (readonly LogRepository: ILogRepository, readonly uuidGenerator: IUuidGenerator, readonly dateManager: IDateManager) {}

  async create (message: string): Promise<ILogEntity> {
    return await this.LogRepository.create(this.uuidGenerator.generate(), message, this.dateManager.getCurrentDateTime())
  }

  async getAll (): Promise<ILogEntity[]> {
    return await this.LogRepository.getAll()
  }

  async get (id: string): Promise<ILogEntity | null> {
    return await this.LogRepository.get(id)
  }
}

export default LogService
