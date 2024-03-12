import { type Servant } from '../../factories/ServantFactory'
import { type IServantSorter } from '../interface/IServantSorter'

class ServantSorter implements IServantSorter {
  initiativeServantBubbleSort (servantArray: Servant[]): Servant[] {
    for (let i = 0; i < servantArray.length; i++) {
      for (let j = 0; j < (servantArray.length - i - 1); j++) {
        if (servantArray[j].battlePoints.initiativePoints < servantArray[j + 1].battlePoints.initiativePoints) {
          const temp = servantArray[j]
          servantArray[j] = servantArray[j + 1]
          servantArray[j + 1] = temp
        }
      }
    }
    return servantArray
  }
}
export { ServantSorter }
