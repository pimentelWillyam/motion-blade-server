import type Cloth from '../model/armors/Cloth'
import type Leather from '../model/armors/Leather'
import type Chainmail from '../model/armors/Chainmail'
import type Plate from '../model/armors/Plate'
import type Pleather from '../model/armors/Pleather'
import type Armor from '../type/Armor'
import type ArmorType from '../type/ArmorType'

class ArmorFetcher {
  constructor (private readonly cloth: Cloth, private readonly leather: Leather, private readonly chainmail: Chainmail, private readonly plate: Plate, private readonly pleather: Pleather) {}

  fetchArmorBasedOnFortitude = (fortitude: number): Armor => {
    if (fortitude >= this.pleather.minimumFortitude) return this.pleather
    else if (fortitude >= this.plate.minimumFortitude) return this.plate
    else if (fortitude >= this.chainmail.minimumFortitude) return this.chainmail
    else if (fortitude >= this.leather.minimumFortitude) return this.leather
    else if (fortitude >= this.cloth.minimumFortitude) return this.cloth
    else throw new Error('Fortitude inválida')
  }

  fetchArmorByType = (armorType: ArmorType): Armor => {
    if (armorType === 'roupa') return this.cloth
    else if (armorType === 'couro') return this.leather
    else if (armorType === 'cota de malha') return this.chainmail
    else if (armorType === 'placa') return this.plate
    else if (armorType === 'pouro') return this.pleather
    else throw new Error('Tipo de armadura inválido')
  }
}

export default ArmorFetcher
