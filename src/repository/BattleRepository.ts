import type { PostgresDataSource } from '../data/PostgresDataSource'
import type { BattleDTO } from '../factories/BattleFactory'

class BattleRepository {
  constructor (readonly dataSource: PostgresDataSource) {}

  async create (battle: BattleDTO): Promise<BattleDTO> {
    return await this.dataSource.insertBattleRegistry(battle)
  }

  async getAll (): Promise<BattleDTO[]> {
    return await this.dataSource.fetchEveryBattleRegistry()
  }

  async getByName (name: string): Promise<BattleDTO | null> {
    return await this.dataSource.fetchBattleBy('name', name)
  }

  async update (name: string, updatedBattle: BattleDTO): Promise<BattleDTO | null> {
    return await this.dataSource.updateBattleBy('name', name, updatedBattle)
  }

  async delete (name: string): Promise<BattleDTO | null> {
    return await this.dataSource.deleteBattleBy('name', name)
  }
}

export default BattleRepository
