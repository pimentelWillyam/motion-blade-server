import type ArmorType from '../../type/ArmorType'

class Plate {
  readonly type: ArmorType
  readonly minimumFortitude: number
  constructor () {
    this.type = 'placa'
    this.minimumFortitude = 5
  }
}

export default Plate
