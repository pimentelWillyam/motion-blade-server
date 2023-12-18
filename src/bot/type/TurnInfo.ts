import { type Servant } from '../../factories/ServantFactory'

interface TurnInfo {
  servantsYetToPlay: Servant[] | undefined
  servantAboutToPlay: Servant | undefined

}

export default TurnInfo
