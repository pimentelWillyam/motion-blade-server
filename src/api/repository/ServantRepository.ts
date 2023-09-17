import type MemoryDataSource from "../../data/memory/MemoryDataSource"

class ServantRepository {
  constructor (readonly dataSource: MemoryDataSource) {}

  async create (id: string, message: string, date: string): Promise<IServantEntity> {
    const log = { id, date, message }
    await this.dataSource.insertCustomAttributesServantRegistry(masterId, name, fatherProfession, youthProfession, agility, technique, strength, fortitude)
    return log
  }

  async getAll (): Promise<IServantEntity[]> {
    return await this.dataSource.getEveryServantRegistry()
  }

  async get (id: string): Promise<IServantEntity | null> {
    const logList = await this.dataSource.getServantBy('id', id)
    const log = logList
    if (log == null) {
      return null
    }
    return log
  }
}

export default ServantRepository
