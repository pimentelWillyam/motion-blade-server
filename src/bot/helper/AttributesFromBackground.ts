import type Attributes from '../type/Attributes'
import type Profession from '../type/Profession'

class AttributesFromBackground {
  get (fatherProfession: Profession, youthProfession: Profession): Attributes {
    const attributesGenerated: Attributes = { agility: 0, technique: 0, strength: 0, fortitude: 0, buff: 0, debuff: 0, guard: 0 }
    if (fatherProfession === 'soldado') {
      attributesGenerated.strength += 3
      attributesGenerated.fortitude += 1
    } else if (fatherProfession === 'bandido') {
      attributesGenerated.strength += 3
      attributesGenerated.agility += 1
    } else if (fatherProfession === 'ferreiro') {
      attributesGenerated.strength += 3
      attributesGenerated.technique += 1
    } else if (fatherProfession === 'barbaro') {
      attributesGenerated.strength += 4
    } else if (fatherProfession === 'açougueiro') {
      attributesGenerated.strength += 2
      attributesGenerated.fortitude += 2
    } else if (fatherProfession === 'lenhador') {
      attributesGenerated.agility += 2
      attributesGenerated.strength += 2
    } else if (fatherProfession === 'guerreiro') {
      attributesGenerated.strength += 2
      attributesGenerated.technique += 2
    } else if (fatherProfession === 'batedor') {
      attributesGenerated.agility += 3
      attributesGenerated.strength += 1
    } else if (fatherProfession === 'saqueador') {
      attributesGenerated.agility += 3
      attributesGenerated.fortitude += 1
    } else if (fatherProfession === 'assassino') {
      attributesGenerated.agility += 3
      attributesGenerated.technique += 1
    } else if (fatherProfession === 'ladrao') {
      attributesGenerated.agility += 4
    } else if (fatherProfession === 'nomade') {
      attributesGenerated.agility += 2
      attributesGenerated.fortitude += 2
    } else if (fatherProfession === 'monge') {
      attributesGenerated.agility += 2
      attributesGenerated.technique += 2
    } else if (fatherProfession === 'infante') {
      attributesGenerated.fortitude += 3
      attributesGenerated.strength += 1
    } else if (fatherProfession === 'patrulheiro') {
      attributesGenerated.fortitude += 3
      attributesGenerated.agility += 1
    } else if (fatherProfession === 'nobre') {
      attributesGenerated.fortitude += 3
      attributesGenerated.technique += 1
    } else if (fatherProfession === 'escravo') {
      attributesGenerated.fortitude += 4
    } else if (fatherProfession === 'arqueiro') {
      attributesGenerated.fortitude += 2
      attributesGenerated.technique += 2
    } else if (fatherProfession === 'acrobata') {
      attributesGenerated.technique += 3
      attributesGenerated.strength += 1
    } else if (fatherProfession === 'cavaleiro') {
      attributesGenerated.technique += 3
      attributesGenerated.fortitude += 1
    } else if (fatherProfession === 'malabarista') {
      attributesGenerated.technique += 3
      attributesGenerated.agility += 1
    } else if (fatherProfession === 'caçador') {
      attributesGenerated.technique += 4
    }

    if (youthProfession === 'soldado') {
      attributesGenerated.strength += 3
      attributesGenerated.fortitude += 1
    } else if (youthProfession === 'bandido') {
      attributesGenerated.strength += 3
      attributesGenerated.agility += 1
    } else if (youthProfession === 'ferreiro') {
      attributesGenerated.strength += 3
      attributesGenerated.technique += 1
    } else if (youthProfession === 'barbaro') {
      attributesGenerated.strength += 4
    } else if (youthProfession === 'açougueiro') {
      attributesGenerated.strength += 2
      attributesGenerated.fortitude += 2
    } else if (youthProfession === 'lenhador') {
      attributesGenerated.agility += 2
      attributesGenerated.strength += 2
    } else if (youthProfession === 'guerreiro') {
      attributesGenerated.strength += 2
      attributesGenerated.technique += 2
    } else if (youthProfession === 'batedor') {
      attributesGenerated.agility += 3
      attributesGenerated.strength += 1
    } else if (youthProfession === 'saqueador') {
      attributesGenerated.agility += 3
      attributesGenerated.fortitude += 1
    } else if (youthProfession === 'assassino') {
      attributesGenerated.agility += 3
      attributesGenerated.technique += 1
    } else if (youthProfession === 'ladrao') {
      attributesGenerated.agility += 4
    } else if (youthProfession === 'nomade') {
      attributesGenerated.agility += 2
      attributesGenerated.fortitude += 2
    } else if (youthProfession === 'monge') {
      attributesGenerated.agility += 2
      attributesGenerated.technique += 2
    } else if (youthProfession === 'infante') {
      attributesGenerated.fortitude += 3
      attributesGenerated.strength += 1
    } else if (youthProfession === 'patrulheiro') {
      attributesGenerated.fortitude += 3
      attributesGenerated.agility += 1
    } else if (youthProfession === 'nobre') {
      attributesGenerated.fortitude += 3
      attributesGenerated.technique += 1
    } else if (youthProfession === 'escravo') {
      attributesGenerated.fortitude += 4
    } else if (youthProfession === 'arqueiro') {
      attributesGenerated.fortitude += 2
      attributesGenerated.technique += 2
    } else if (youthProfession === 'acrobata') {
      attributesGenerated.technique += 3
      attributesGenerated.strength += 1
    } else if (youthProfession === 'cavaleiro') {
      attributesGenerated.technique += 3
      attributesGenerated.fortitude += 1
    } else if (youthProfession === 'malabarista') {
      attributesGenerated.technique += 3
      attributesGenerated.agility += 1
    } else if (youthProfession === 'caçador') {
      attributesGenerated.technique += 4
    }
    return attributesGenerated
  }
}

export default AttributesFromBackground
