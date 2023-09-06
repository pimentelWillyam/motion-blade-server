import type IServant from "./IServant"

interface IMaster {
  id: string
  name: string
  servantList: IServant[]
}

export default IMaster