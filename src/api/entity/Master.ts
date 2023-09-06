import type IMaster from "../interface/IMaster";
import type IServant from "../interface/IServant";

class Master implements IMaster {
  servantList: IServant[]
  constructor(readonly id: string, readonly name: string, servantList: IServant[]) {
    this.id = id
    this.name = name
    this.servantList = servantList
  }
}

export default Master