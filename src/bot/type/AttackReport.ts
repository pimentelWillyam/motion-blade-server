import { type Servant } from '../../factories/ServantFactory'
import type AttackResult from './AttackResult'

interface AttackReport {
  attacker: Servant
  defender: Servant
  attackFactor: {
    attribute: 'agilidade' | 'tecnica'
    value: number
  } | undefined
  defenseFactor: {
    attribute: 'agilidade' | 'tecnica'
    value: number
  } | undefined
  defenderTriedToBlock: boolean | undefined
  defenderHadArmor: boolean | undefined
  secondaryArmorEvasionFactor: number | undefined
  secondaryArmorHittingFactor: number | undefined
  powerFactor: number | undefined
  resilienceFactor: number | undefined
  defenderSecondaryArmorHasBeenHit: boolean | undefined
  weaponArmorDamageRelation: number | undefined
  damageDealtToDefender: number | undefined
  result: AttackResult | undefined
  defenderSurvived: boolean | undefined
  attributePointsToUpgrade: number | undefined
  amountOfTimesServantWillUpgrade: number | undefined
  willMaestryBeUpgraded: boolean | undefined

}

export default AttackReport
