import { type Servant } from '../../factories/ServantFactory'
import type MaestryType from '../type/MaestryType'
import type RandomNumberGenerator from './RandomNumberGenerator'
import type Attribute from '../type/Attribute'

class ServantUpgrader {
  constructor (private readonly randomNumberGenerator: RandomNumberGenerator) {}

  upgradeAttributes (servantToBeUpgradeed: Servant, attribute: Attribute): Servant {
    if (attribute === 'agilidade') {
      servantToBeUpgradeed.currentAttributes.agility += 1
      servantToBeUpgradeed.maximumAttributes.agility += 1
    } else if (attribute === 'tecnica') {
      servantToBeUpgradeed.currentAttributes.technique += 1
      servantToBeUpgradeed.maximumAttributes.technique += 1
    } else if (attribute === 'força') {
      servantToBeUpgradeed.currentAttributes.strength += 1
      servantToBeUpgradeed.maximumAttributes.strength += 1
    } else if (attribute === 'fortitude') {
      servantToBeUpgradeed.currentAttributes.fortitude += 1
      servantToBeUpgradeed.maximumAttributes.fortitude += 1
    }
    return servantToBeUpgradeed
  }

  getAttributePointsToUpgrade (victor: Servant, defeated: Servant): number {
    const victorMaximumAttributesSum = victor.maximumAttributes.agility + victor.maximumAttributes.technique + victor.maximumAttributes.strength + victor.maximumAttributes.fortitude + 1
    const defeatedMaximumAttributesSum = defeated.maximumAttributes.agility + defeated.maximumAttributes.technique + defeated.maximumAttributes.strength + defeated.maximumAttributes.fortitude + 1
    const attributePointsToUpgrade = (defeatedMaximumAttributesSum / victorMaximumAttributesSum).toString().split('.')
    return parseFloat(attributePointsToUpgrade[0] + '.' + attributePointsToUpgrade[1][0])
  }

  willServantUpgrade (sucessChance: number): boolean {
    if (100 - sucessChance <= this.randomNumberGenerator.generate(1, 100)) return true
    return false
  }

  upgradeMaestry (servantToBeUpgradeed: Servant, maestryToUpgrade: MaestryType): Servant {
    if (maestryToUpgrade === 'mão nua') { servantToBeUpgradeed.maestry.bareHanded += 1 } else if (maestryToUpgrade === 'uma mão') {
      servantToBeUpgradeed.maestry.oneHanded += 1
    } else if (maestryToUpgrade === 'duas mãos') {
      servantToBeUpgradeed.maestry.twoHanded += 1
    } else if (maestryToUpgrade === 'haste') {
      servantToBeUpgradeed.maestry.polearm += 1
    } else if (maestryToUpgrade === 'arco') {
      servantToBeUpgradeed.maestry.bow += 1
    } else if (maestryToUpgrade === 'besta') {
      servantToBeUpgradeed.maestry.crossbow += 1
    }
  }

  willMaestryBeUpgraded (): boolean {
    if (this.randomNumberGenerator.generate(1, 10) === 10) return true
    return false
  }
}

export default ServantUpgrader
