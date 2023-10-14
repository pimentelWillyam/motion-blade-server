import type ArmorType from '../bot/type/ArmorType'

class Armor {
  readonly type: ArmorType
  readonly debuff: number
  constructor (type: ArmorType, debuff: number) {
    this.type = type
    this.debuff = debuff
  }
}

class ArmorFactory {
  createArmorByType (armorType: ArmorType): Armor {
    if (armorType === 'roupa') return new Armor(armorType, 0)
    else if (armorType === 'couro') return new Armor(armorType, -2)
    else if (armorType === 'cota de malha') return new Armor(armorType, -4)
    else if (armorType === 'placa') return new Armor(armorType, -8)
    else throw new Error('Tipo de armadura inválido')
  }
}

export { ArmorFactory, Armor }
