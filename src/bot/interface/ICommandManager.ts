import type { Message } from 'discord.js'
import type Profession from '../type/Profession'

interface ICommandManager {
  rollServantShoot(message: Message<boolean>, arg1: string, arg2: string): unknown
  levelUpServant: (message: Message<boolean>, name: string, enemyStrenghtLevel: string) => void
  removeServantDebuff: (message: Message<boolean>, name: string) => void
  debuffServant: (message: Message<boolean>, name: string, debuffValue: number) => void
  removeServantBuff: (message: Message<boolean>, name: string) => void
  buffServant: (message: Message<boolean>, name: string, buffValue: number) => void
  createNpc: (message: Message<boolean>, name: string) => void
  help: (message: Message) => void
  classes: (message: Message) => void
  roll: (message: Message, diceSides: number) => void
  createServant: (message: Message, name: string, profession: Profession) => void
  getServantAttributes: (message: Message, name: string) => void
  applyDamageToServant: (message: Message, name: string, damage: number) => void
  healServant: (message: Message<boolean>, name: string, attributeToHeal: string, quantityToHeal: number) => void
  rollServantAgility: (message: Message, name: string) => void
  rollServantTechnique: (message: Message, name: string) => void
  rollServantStrength: (message: Message, name: string) => void
  rollServantFortitude: (message: Message, name: string) => void
  rollServantAttack: (message: Message, defenderName: string, attackerName: string) => Promise<void>
  rollServantGuard: (message: Message, name: string) => void
  armServant: (message: Message, name: string) => void

}

export default ICommandManager
