import type IBattle from "../interface/IBattle"
import type IServant from "../interface/IServant"

class Battle implements IBattle {
  constructor(readonly id: string, readonly map: number[][], readonly participants: IServant[]) {
    this.id = id
    this.map = map
    this.participants = participants
  }
}

export default Battle