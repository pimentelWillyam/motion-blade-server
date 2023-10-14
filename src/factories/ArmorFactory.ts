import type ArmorType from '../bot/type/ArmorType'

class Armor {
  readonly type: ArmorType
  readonly minimumFortitude: number
  constructor (type: ArmorType, minimumFortitude: number) {
    this.type = type
    this.minimumFortitude = minimumFortitude
  }
}

class ArmorFactory {
  createArmorByType (armorType: ArmorType): Armor {
    if (armorType === 'roupa') return new Armor(armorType, 0)
    else if (armorType === 'couro') return new Armor(armorType, 2)
    else if (armorType === 'cota de malha') return new Armor(armorType, 4)
    else if (armorType === 'placa') return new Armor(armorType, 8)
    else if (armorType === 'pouro') return new Armor(armorType, 10)
    else throw new Error('Tipo de armadura inválido')
  }

  createArmorByFortitude (fortitude: number): Armor {
    if (fortitude < 2) return new Armor('roupa', 0)
    else if (fortitude < 4) return new Armor('couro', 2)
    else if (fortitude < 8) return new Armor('cota de malha', 4)
    else if (fortitude < 10) return new Armor('placa', 8)
    else return new Armor('pouro', 10)
  }
}

export { ArmorFactory, Armor }
