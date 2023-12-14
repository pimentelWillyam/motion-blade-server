import type { Battle, BattleFactory } from '../factories/BattleFactory'
import type BattleRepository from '../repository/BattleRepository'

class BattleService {
  constructor (private readonly battleRepository: BattleRepository, private readonly battleFactory: BattleFactory) {}

  create = async (battleName: string): Promise<Battle> => {
    if (!await this.battleExists(battleName)) {
      const battle = this.battleFactory.create(battleName)
      return await this.battleRepository.create(battle)
    }
    throw new Error('Já existe uma batalha com esse nome')
  }

  getAll = async (): Promise<Battle[]> => {
    return await this.battleRepository.getAll()
  }

  get = async (battleName: string): Promise<Battle> => {
    const fetchedBattle = await this.battleRepository.getByName(battleName)
    if (fetchedBattle != null) return fetchedBattle
    throw new Error(`a batalha ${battleName} não existe`)
  }

  battleExists = async (battleName: string): Promise<boolean> => {
    const fetchedBattle = await this.battleRepository.getByName(battleName)
    if (fetchedBattle != null) return true
    return false
  }

  update = async (battleName: string, contentToUpdate: Battle): Promise<Battle> => {
    const battleToBeUpdated = await this.battleRepository.update(battleName, contentToUpdate)
    if (battleToBeUpdated != null) return battleToBeUpdated
    throw new Error('Não é possível atualizar um servo que não existe')
  }

  delete = async (battleName: string): Promise<Battle> => {
    const battleToBeDeleted = await this.battleRepository.delete(battleName)
    if (battleToBeDeleted != null) return battleToBeDeleted
    throw new Error('Não é possível remover uma batalha que não existe')
  }
}

export default BattleService
