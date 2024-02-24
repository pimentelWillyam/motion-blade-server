import { type Servant } from '../../factories/ServantFactory'
import type RandomNumberGenerator from './RandomNumberGenerator'

class ServantUpgradeCalculator {
  constructor (private readonly randomNumberGenerator: RandomNumberGenerator) {}

  getAttributePointsToUpgrade (victor: Servant, defeated: Servant): number {
    const victorMaximumAttributesSum = victor.maximumAttributes.agility + victor.maximumAttributes.technique + victor.maximumAttributes.strength + victor.maximumAttributes.fortitude + 1
    const defeatedMaximumAttributesSum = defeated.maximumAttributes.agility + defeated.maximumAttributes.technique + defeated.maximumAttributes.strength + defeated.maximumAttributes.fortitude + 1
    const attributePointsToUpgrade = (defeatedMaximumAttributesSum / victorMaximumAttributesSum).toString().split('.')
    if (attributePointsToUpgrade[1] === undefined) return parseFloat(attributePointsToUpgrade[0])
    return parseFloat(attributePointsToUpgrade[0] + '.' + attributePointsToUpgrade[1][0])
  }

  getAmmountOfTimesServantWillUpgrade (attributePointsToUpgrade: number): number {
    let amountOfTimesServantWillUpgrade = 0
    while (attributePointsToUpgrade > 0) {
      if (this.willServantUpgrade(attributePointsToUpgrade * 100)) amountOfTimesServantWillUpgrade++
      attributePointsToUpgrade++
    }
    return amountOfTimesServantWillUpgrade
  }

  willServantUpgrade (sucessChance: number): boolean {
    if (100 - sucessChance <= this.randomNumberGenerator.generate(1, 100)) return true
    return false
  }

  willMaestryBeUpgraded (): boolean {
    if (this.randomNumberGenerator.generate(1, 10) === 10) return true
    return false
  }
}

export default ServantUpgradeCalculator
