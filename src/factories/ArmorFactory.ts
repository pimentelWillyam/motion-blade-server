import type ArmorType from '../bot/type/ArmorType'

class Armor {
  readonly type: ArmorType
  readonly debuff: number
  condition: number
  readonly maximumCondition: number
  constructor (type: ArmorType, debuff: number, condition: number) {
    this.type = type
    this.debuff = debuff
    this.condition = condition
    this.maximumCondition = condition
  }
}

class ArmorFactory {
  createArmorByType (armorType: ArmorType): Armor {
    if (armorType === 'roupa') return new Armor(armorType, 0, 0)
    else if (armorType === 'couro') return new Armor(armorType, -2, 40)
    else if (armorType === 'cota de malha') return new Armor(armorType, -4, 80)
    else if (armorType === 'placa') return new Armor(armorType, -8, 120)
    else throw new Error('Tipo de armadura inválido')
  }
}

export { ArmorFactory, Armor }
