import type IBattleManager from '../interface/IBattleManager'
import type Master from '../model/Master'
import type Servant from '../model/Servant'

class BattleManager implements IBattleManager {
  createBattle = (masterParticipantList: Master[], servantParticipantList: Servant): boolean => {
    return true
  }

  deleteBattle = (id: string): boolean => {
    return true
  }
}

export default BattleManager
