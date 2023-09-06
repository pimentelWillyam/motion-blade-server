import type Master from '../model/Master'
import type Servant from '../model/Servant'

interface IBattleManager {
  createBattle: (masterParticipantList: Master[], servantParticipantList: Servant) => boolean
  deleteBattle: (id: string) => boolean

}

export default IBattleManager
