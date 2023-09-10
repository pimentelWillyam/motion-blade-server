import type Servant from '../model/Servant'
import type AttackResult from '../type/AttackTestResult'
import type Attributes from '../type/Attributes'
import type Profession from '../type/Profession'

interface IServantManager {
  shoot(attackerName: string, attackerDiceResult: number, defenderName: string, defenderDiceResult: number): unknown
  servantDatabase: Servant[]
  removeServantDebuff: (name: string) => void
  buffServant: (name: string, buffValue: number) => void
  debuffServant: (name: string, debuffValue: number) => void
  removeServantBuff: (name: string) => void
  createNpc: (name: string) => void
  createServant: (masterId: string, name: string, profession: Profession) => Servant
  deleteServant: (servantMasterId: string, servantId: string) => boolean
  getAttributes: (profession: string) => Attributes
  getServantPositionByName: (name: string) => number
  getServant: (name: string) => Servant
  getServantAttributes: (name: string) => Attributes
  applyDamageToServant: (name: string, damage: number) => Attributes | null
  healServant: (name: string, attributeToHeal: string, quantityToHeal: number) => void
  rollServantAgility: (name: string, diceResult: number) => number
  rollServantTechnique: (name: string, diceResult: number) => number
  rollServantStrength: (name: string, diceResult: number) => number
  rollServantFortitude: (name: string, diceResult: number) => number
  attack: (attackerName: string, attackerDiceResult: number, defenderName: string, defenderDiceResult: number) => AttackResult
  applyGuardOnServant: (name: string, guardToBeApplied: number) => void
  armServant: (name: string) => void

}

export default IServantManager
