import type IMasterManager from '../interface/IMasterManager'
import type Servant from '../model/Servant'

class MasterManager implements IMasterManager {
  createMaster = (id: string, name: string, servantList: Servant[]): boolean => {
    return true
  }

  deleteMaster = (id: string): boolean => {
    return true
  }
}

export default MasterManager
