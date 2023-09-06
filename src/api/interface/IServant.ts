import type Atributes from '../type/Attributes'

interface IServant {
  id: string
  masterId: string
  name: string
  profession: string
  seniority: number
  attributes: Atributes
  isInBattle: boolean
  battlePosition: [number, number]

}

export default IServant
