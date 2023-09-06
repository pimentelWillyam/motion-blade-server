import type ILogEntity from '../interface/ILogEntity'
import type IMariadbDataSource from './IMariadbDataSource'

interface ILogRepository {
  readonly dataSource: IMariadbDataSource

  create: (id: string, message: string, date: string) => Promise<ILogEntity>
  getAll: () => Promise<ILogEntity[]>
  get: (id: string) => Promise<ILogEntity | null>
}

export default ILogRepository
