
import type ILogRepository from '../interface/ILogRepository'
import type IUuidGenerator from '../interface/IUuidGenerator'
import type IDateManager from '../interface/IDateManager'
import type ILogEntity from '../interface/ILogEntity'
import type IMariadbDataSource from '../interface/IMariadbDataSource'

class LogRepository implements ILogRepository {
  constructor (readonly dataSource: IMariadbDataSource, readonly uuidGenerator: IUuidGenerator, readonly dateManager: IDateManager) {}

  async create (id: string, message: string, date: string): Promise<ILogEntity> {
    const log = { id, date, message }
    await this.dataSource.insertLogRegistry(log.id, log.date, log.message)
    return log
  }

  async getAll (): Promise<ILogEntity[]> {
    return await this.dataSource.getEveryLogRegistry()
  }

  async get (id: string): Promise<ILogEntity | null> {
    const logList = await this.dataSource.getLogBy('id', id)
    const log = logList
    if (log == null) {
      return null
    }
    return log
  }
}

export default LogRepository
