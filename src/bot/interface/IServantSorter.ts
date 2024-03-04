import { type Servant } from '../../factories/ServantFactory'

interface IServantSorter {
  initiativeServantBubbleSort: (array: Servant[]) => Servant[]
}

export type { IServantSorter }
