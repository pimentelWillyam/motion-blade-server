import type AttackResult from './AttackResult'

interface AttackReport {
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

}

export default AttackReport
