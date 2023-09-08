import type ArmorType from '../../type/ArmorType'

class Cloth {
  readonly type: ArmorType
  readonly minimumFortitude: number
  constructor () {
    this.type = 'roupa'
    this.minimumFortitude = 0
  }
}

export default Cloth
