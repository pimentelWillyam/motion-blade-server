import type ArmorType from '../../type/ArmorType'

class Chainmail {
  readonly type: ArmorType
  readonly minimumFortitude: number
  constructor () {
    this.type = 'cota de malha'
    this.minimumFortitude = 3
  }
}

export default Chainmail
