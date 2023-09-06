import type IServant from './IServant'

interface IBattle {
  id: string
  map: [number, number]
  participants: IServant[]
}

export default IBattle
