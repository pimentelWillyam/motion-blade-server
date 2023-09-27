import type IUuidGenerator from '../interface/IUuidGenerator'
import type IDateManager from '../interface/IDateManager'
import type LogRepository from '../repository/LogRepository'

class LogService {
  constructor (readonly LogRepository: LogRepository, readonly uuidGenerator: IUuidGenerator, readonly dateManager: IDateManager) {}

  // async create (message: string): Promise<ILogEntity> {
  //   return await this.LogRepository.create(this.uuidGenerator.generate(), message, this.dateManager.getCurrentDateTime())
  // }

  // async getAll (): Promise<ILogEntity[]> {
  //   return await this.LogRepository.getAll()
  // }

  // async get (id: string): Promise<ILogEntity | null> {
  //   return await this.LogRepository.get(id)
  // }
}

export default LogService
