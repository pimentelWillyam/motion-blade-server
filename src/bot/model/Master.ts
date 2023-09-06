import type Servant from './Servant'

interface Master {
  id: string
  name: string
  servantsOwnedIdList: string[]
}

export default Master
