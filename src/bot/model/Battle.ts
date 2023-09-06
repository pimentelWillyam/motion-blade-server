import type Servant from './Servant'

interface Battle {
  id: string
  map: number[][]
  participants: Servant[]
}

export default Battle
