import type ArmorType from '../../type/ArmorType'

class Pleather {
  readonly type: ArmorType
  readonly minimumFortitude: number
  constructor () {
    this.type = 'pouro'
    this.minimumFortitude = 6
  }
}

export default Pleather
