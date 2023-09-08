import type ArmorType from '../../type/ArmorType'

class Leather {
  readonly type: ArmorType
  readonly minimumFortitude: number
  constructor () {
    this.type = 'couro'
    this.minimumFortitude = 2
  }
}

export default Leather
