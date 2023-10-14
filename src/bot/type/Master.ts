import type Servant from './Servant'

interface Master {
  id: string
  name: string
  servantList: Servant[]
}

export default Master
