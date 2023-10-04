import { type Servant } from '../factories/ServantFactory'
import type RandomNumberGenerator from '../bot/helper/RandomNumberGenerator'

class Combat {
  constructor (private readonly randomNumberGenerator: RandomNumberGenerator) {}

  servantAttacksServant (attacker: Servant, defender: Servant, attackType: 'acerta' | 'lança' | 'atira'): void {
    if (attackType === 'acerta' && !attacker.inventory.primaryWeapon.strikable) throw new Error(`A arma usada por ${attacker.name} não pode ser usada para acertar alguém`)
    if (attackType === 'lança' && !attacker.inventory.primaryWeapon.throwable) throw new Error(`A arma usada por ${attacker.name} não pode ser usada para lançar alguém`)
    if (attackType === 'atira' && !attacker.inventory.primaryWeapon.shootable) throw new Error(`A arma usada por ${attacker.name} não pode ser usada para lançar alguém`)
    const attackFactor = this.getAttackFactor(attacker, attackType)
    const defenseFactor = this.getDefenseFactor(defender)
    if (defenseFactor >= attackFactor * 2 && attackType === 'acerta' && this.defenderWillBlock(defender)) {
      console.log('desarme')
    }
    if (defenseFactor >= attackFactor * 2 && attackType === 'acerta' && !this.defenderWillBlock(defender)) {
      console.log('contra-ataque')
    }
    if (defenseFactor >= attackFactor * 2 && attackType === 'lança') {
      console.log('desequilíbrio')
    }
    if (defenseFactor >= attackFactor * 2 && attackType === 'atira') {
      console.log('recarga lenta')
    }
    if (defenseFactor >= attackFactor && attackType === 'acerta' && this.defenderWillBlock(defender)) {
      console.log('bloqueio')
    }
    if (defenseFactor >= attackFactor && attackType === 'acerta' && !this.defenderWillBlock(defender)) {
      console.log('desvio')
    }
    if (defenseFactor >= attackFactor && (attackType === 'lança' || attackType === 'atira') && this.defenderWillBlock(defender)) {
      console.log('bloqueio')
    }
    if (defenseFactor >= attackFactor && (attackType === 'lança' || attackType === 'atira') && !this.defenderWillBlock(defender)) {
      console.log('desvio')
    }
    console.log('hit')
  }

  private defenderWillBlock (defender: Servant): boolean {
    if (defender.inventory.secondaryWeapon === null && defender.currentAttributes.agility > (defender.currentAttributes.technique + defender.guard + defender.inventory.primaryWeapon.defendingBuff)) {
      return false
    }
}

export default Combat
