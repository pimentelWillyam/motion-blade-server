import type { Master, MasterDTO } from '../factories/MasterFactory'
import type { PostgresDataSource } from '../data/PostgresDataSource'

class MasterRepository {
  constructor (readonly dataSource: PostgresDataSource) {}

  async create (master: Master): Promise<MasterDTO> {
    return await this.dataSource.insertMasterRegistry(master)
  }

  async getAll (): Promise<MasterDTO[]> {
    return await this.dataSource.fetchEveryMasterRegistry()
  }

  async get (login: string): Promise<MasterDTO | null> {
    return await this.dataSource.fetchMasterBy('login', login)
  }

  async update (name: string, updatedMaster: Master): Promise<MasterDTO | null> {
    return await this.dataSource.updateMasterBy('login', name, updatedMaster)
  }

  async delete (login: string): Promise<MasterDTO | null> {
    return await this.dataSource.deleteMasterBy('login', login)
  }
}

export default MasterRepository
