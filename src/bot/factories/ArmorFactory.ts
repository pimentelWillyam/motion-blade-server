import type ArmorType from '../type/ArmorType'

class Armor {
  readonly type: ArmorType
  readonly minimumFortitude: number
  constructor (type: ArmorType, minimumFortitude: number) {
    this.type = type
    this.minimumFortitude = minimumFortitude
  }
}

class ArmorFactory {
  createArmor (armorType: ArmorType): Armor {
    if (armorType === 'roupa') return new Armor(armorType, 0)
    else if (armorType === 'couro') return new Armor(armorType, 2)
    else if (armorType === 'cota de malha') return new Armor(armorType, 3)
    else if (armorType === 'placa') return new Armor(armorType, 5)
    else if (armorType === 'pouro') return new Armor(armorType, 6)
    else throw new Error('Tipo de armadura inválido')
  }
}

export default ArmorFactory
