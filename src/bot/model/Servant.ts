import type Profession from '../type/Profession'
import type Attributes from '../type/Attributes'

interface Servant {
  id: string
  masterId: string
  name: string
  profession: Profession
  seniority: string
  attributes: Attributes
  isInBattle: boolean
  battlePosition: [number, number]
  guard: number
  isArmed: boolean
  buff: number
  debuff: number
}

export default Servant
