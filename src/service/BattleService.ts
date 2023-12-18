import type { Battle, BattleDTO, BattleFactory } from '../factories/BattleFactory'
import type BattleRepository from '../repository/BattleRepository'

class BattleService {
  constructor (private readonly battleRepository: BattleRepository, private readonly battleFactory: BattleFactory) {}

  create = async (battleName: string): Promise<BattleDTO> => {
    if (!await this.battleExists(battleName)) {
      const battle = this.battleFactory.create(battleName)
      return await this.battleRepository.create(battle)
    }
    throw new Error('Já existe uma batalha com esse nome')
  }

  getAll = async (): Promise<BattleDTO[]> => {
    return await this.battleRepository.getAll()
  }

  get = async (battleName: string): Promise<Battle> => {
    const fetchedBattle = await this.battleRepository.getByName(battleName)
    if (fetchedBattle == null) throw new Error(`a batalha ${battleName} não existe`)
    const battle = this.battleFactory.create(fetchedBattle.name)
    battle.id = fetchedBattle.id
    battle.participantsList = fetchedBattle.participantsList
    battle.map = fetchedBattle.map
    battle.turnInfo = fetchedBattle.turnInfo
    return battle
  }

  battleExists = async (battleName: string): Promise<boolean> => {
    const fetchedBattle = await this.battleRepository.getByName(battleName)
    if (fetchedBattle != null) return true
    return false
  }

  update = async (battleName: string, contentToUpdate: BattleDTO): Promise<BattleDTO> => {
    const battleToBeUpdated = await this.battleRepository.update(battleName, contentToUpdate)
    if (battleToBeUpdated != null) return battleToBeUpdated
    throw new Error('Não é possível atualizar um servo que não existe')
  }

  delete = async (battleName: string): Promise<BattleDTO> => {
    const battleToBeDeleted = await this.battleRepository.delete(battleName)
    if (battleToBeDeleted != null) return battleToBeDeleted
    throw new Error('Não é possível remover uma batalha que não existe')
  }
}

export default BattleService
