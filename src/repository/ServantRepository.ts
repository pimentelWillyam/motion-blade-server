import type { Servant } from '../factories/ServantFactory'
import type { PostgresDataSource } from '../data/PostgresDataSource'

class ServantRepository {
  constructor (readonly dataSource: PostgresDataSource) {}

  async create (servant: Servant): Promise<Servant> {
    return await this.dataSource.insertServantRegistry(servant)
  }

  async getAll (): Promise<Servant[]> {
    return await this.dataSource.fetchEveryServantRegistry()
  }

  async getByName (name: string): Promise<Servant | null> {
    return await this.dataSource.fetchServantBy('name', name)
  }

  async update (name: string, updatedServant: Servant): Promise<Servant | null> {
    return await this.dataSource.updateServantBy('name', name, updatedServant)
  }

  async delete (name: string): Promise<Servant | null> {
    return await this.dataSource.deleteServantBy('name', name)
  }
}

export default ServantRepository
