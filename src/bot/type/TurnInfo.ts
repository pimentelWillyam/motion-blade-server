import { type Servant } from '../../factories/ServantFactory'

interface TurnInfo {
  servantsYetToPlay: Servant[]
  servantAboutToPlay: Servant | undefined

}

export default TurnInfo
