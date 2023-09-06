import type ILogEntity from './ILogEntity'

interface ILogService {
  create: (message: string) => Promise<ILogEntity>
  getAll: () => Promise<ILogEntity[]>
  get: (id: string) => Promise<ILogEntity | null>
}

export default ILogService
