import type PostgresDataSource from '../data/PostgresDataSource'
import type { Battle } from '../factories/BattleFactory'

class BattleRepository {
  constructor (readonly dataSource: PostgresDataSource) {}

  async create (battle: Battle): Promise<Battle> {
    return await this.dataSource.insertBattleRegistry(battle)
  }

  async getAll (): Promise<Battle[]> {
    return await this.dataSource.fetchEveryBattleRegistry()
  }

  async getByName (name: string): Promise<Battle | null> {
    return await this.dataSource.fetchBattleBy('name', name)
  }

  async update (name: string, updatedBattle: Battle): Promise<Battle | null> {
    return await this.dataSource.updateBattleBy('name', name, updatedBattle)
  }

  async delete (name: string): Promise<Battle | null> {
    return await this.dataSource.deleteBattleBy('name', name)
  }
}

export default BattleRepository
