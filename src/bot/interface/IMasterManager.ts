import type Servant from '../model/Servant'

interface IMasterManager {
  createMaster: (id: string, name: string, servantList: Servant[]) => boolean
  deleteMaster: (id: string) => boolean
}

export default IMasterManager
