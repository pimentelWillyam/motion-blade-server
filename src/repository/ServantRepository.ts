import type { Servant, ServantDTO } from '../factories/ServantFactory'
import type { PostgresDataSource } from '../data/PostgresDataSource'

class ServantRepository {
  constructor (readonly dataSource: PostgresDataSource) {}

  async create (servant: Servant): Promise<ServantDTO> {
    return await this.dataSource.insertServantRegistry(servant)
  }

  async getAll (): Promise<ServantDTO[]> {
    return await this.dataSource.fetchEveryServantRegistry()
  }

  async getAllByUser (login: string): Promise<ServantDTO[]> {
    return await this.dataSource.fetchEveryServantRegistryByUser(login)
  }

  async getByName (name: string): Promise<ServantDTO | null> {
    return await this.dataSource.fetchServantBy('name', name)
  }

  async update (name: string, updatedServant: Servant): Promise<ServantDTO | null> {
    return await this.dataSource.updateServantBy('name', name, updatedServant)
  }

  async delete (name: string): Promise<ServantDTO | null> {
    return await this.dataSource.deleteServantBy('name', name)
  }
}

export default ServantRepository
