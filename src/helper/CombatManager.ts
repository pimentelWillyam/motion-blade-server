import { type Servant } from '../factories/ServantFactory'
import type RandomNumberGenerator from '../bot/helper/RandomNumberGenerator'
import { type Armor } from '../factories/ArmorFactory'
import { type Weapon } from '../factories/WeaponFactory'
import type AttackReport from '../bot/type/AttackReport'

class CombatManager {
  constructor (private readonly randomNumberGenerator: RandomNumberGenerator) {}

  servantAttacksServant (attacker: Servant, attackType: 'acerta' | 'lança' | 'atira', defender: Servant): AttackReport {
    if (attackType === 'acerta' && !attacker.inventory.primaryWeapon.strikable) throw new Error(`A arma usada por ${attacker.name} não pode ser usada para acertar alguém`)
    if (attackType === 'lança' && !attacker.inventory.primaryWeapon.throwable) throw new Error(`A arma usada por ${attacker.name} não pode ser usada para lançar alguém`)
    if (attackType === 'atira' && !attacker.inventory.primaryWeapon.shootable) throw new Error(`A arma usada por ${attacker.name} não pode ser usada para lançar alguém`)
    const attackReport: AttackReport = {
      attackFactor: undefined,
      defenseFactor: undefined,
      defenderTriedToBlock: undefined,
      result: undefined,
      defenderHadArmor: undefined,
      secondaryArmorHittingFactor: undefined,
      secondaryArmorEvasionFactor: undefined,
      defenderSecondaryArmorHasBeenHit: undefined,
      powerFactor: undefined,
      resilienceFactor: undefined,
      weaponArmorDamageRelation: undefined,
      damageDealtToDefender: undefined
    }
    attackReport.defenderTriedToBlock = this.defenderWillTryToBlock(defender)
    attackReport.attackFactor = this.getAttackFactor(attacker, attackType)
    attackReport.defenseFactor = this.getDefenseFactor(defender)
    if (attackReport.defenseFactor.value >= attackReport.attackFactor.value * 2 && !attackReport.defenderTriedToBlock && attackType === 'acerta') {
      attackReport.result = 'Counter'
      return attackReport
    }
    if (attackReport.defenseFactor.value >= attackReport.attackFactor.value * 2 && attackReport.defenderTriedToBlock && attackType === 'acerta') {
      attackReport.result = 'Disarm'
      return attackReport
    }
    if (attackReport.defenseFactor.value >= attackReport.attackFactor.value * 2 && attackType === 'lança') {
      attackReport.result = 'Off balance'
      return attackReport
    }
    if (attackReport.defenseFactor.value >= attackReport.attackFactor.value * 2 && attackType === 'atira') {
      attackReport.result = 'Slow reload'
      return attackReport
    }
    if (attackReport.defenseFactor.value >= attackReport.attackFactor.value && (attackType === 'atira' || attackType === 'lança')) {
      attackReport.result = 'Error'
      return attackReport
    }
    if (attackReport.defenseFactor.value >= attackReport.attackFactor.value && attackReport.defenderTriedToBlock) {
      attackReport.result = 'Block'
      return attackReport
    }
    if (attackReport.defenseFactor.value >= attackReport.attackFactor.value && !attackReport.defenderTriedToBlock) {
      attackReport.result = 'Dodge'
      return attackReport
    }
    attackReport.powerFactor = this.getPowerFactor(attacker)
    attackReport.resilienceFactor = this.getResilienceFactor(defender)

    if (defender.inventory.primaryArmor.type !== 'roupa') {
      attackReport.defenderHadArmor = true
      attackReport.secondaryArmorHittingFactor = this.randomNumberGenerator.generate(1, 20) + attacker.currentAttributes.technique
      attackReport.secondaryArmorEvasionFactor = this.randomNumberGenerator.generate(1, 20) + defender.currentAttributes.technique

      attackReport.defenderSecondaryArmorHasBeenHit = this.defenderSecondaryArmorWillBeHit(attacker, attackReport.secondaryArmorHittingFactor, defender, attackReport.secondaryArmorEvasionFactor)
    } else {
      attackReport.defenderHadArmor = false
      attackReport.defenderSecondaryArmorHasBeenHit = false
    }
    if (attackReport.defenderHadArmor && attackReport.defenderSecondaryArmorHasBeenHit) {
      attackReport.weaponArmorDamageRelation = this.getWeaponArmorDamageRelation(attacker.inventory.primaryWeapon, defender.inventory.secondaryArmor)
    } else {
      attackReport.weaponArmorDamageRelation = this.getWeaponArmorDamageRelation(attacker.inventory.primaryWeapon, defender.inventory.primaryArmor)
    }
    attackReport.damageDealtToDefender = attackReport.powerFactor + attackReport.weaponArmorDamageRelation - attackReport.resilienceFactor
    return attackReport
  }

  private defenderWillTryToBlock (defender: Servant): boolean {
    if (defender.inventory.secondaryWeapon === null && defender.currentAttributes.agility > (defender.currentAttributes.technique + defender.guard + defender.inventory.primaryWeapon.defendingBuff)) {
      return false
    }
    if (defender.inventory.secondaryWeapon === null && defender.currentAttributes.agility <= (defender.currentAttributes.technique + defender.guard + defender.inventory.primaryWeapon.defendingBuff)) {
      return true
    }

    if (defender.inventory.secondaryWeapon != null && defender.currentAttributes.agility > (defender.currentAttributes.agility + defender.guard + defender.inventory.primaryWeapon.defendingBuff + defender.inventory.secondaryWeapon.defendingBuff)) {
      return false
    }

    if (defender.inventory.secondaryWeapon != null && defender.currentAttributes.agility <= (defender.currentAttributes.technique + defender.guard + defender.inventory.primaryWeapon.defendingBuff + defender.inventory.secondaryWeapon.defendingBuff)) {
      return true
    }
    throw new Error('Erro no momento em que se verifica se o defensor irá defender')
  }

  private getAttackFactor (attacker: Servant, attackType: 'acerta' | 'lança' | 'atira'): { attribute: 'agilidade' | 'tecnica', value: number } {
    if ((attackType === 'atira' || attackType === 'lança') && attacker.inventory.secondaryWeapon === null) {
      return { attribute: 'tecnica', value: this.randomNumberGenerator.generate(1, 20) + attacker.currentAttributes.technique + attacker.inventory.primaryWeapon.hittingBuff + attacker.buff + attacker.debuff + attacker.inventory.primaryArmor.debuff + attacker.inventory.secondaryArmor.debuff }
    }
    if ((attackType === 'atira' || attackType === 'lança') && attacker.inventory.secondaryWeapon != null) {
      return { attribute: 'tecnica', value: this.randomNumberGenerator.generate(1, 20) + attacker.currentAttributes.technique + attacker.inventory.primaryWeapon.hittingBuff + attacker.inventory.secondaryWeapon.hittingBuff + attacker.buff + attacker.debuff + attacker.inventory.primaryArmor.debuff + attacker.inventory.secondaryArmor.debuff }
    }
    if (attackType === 'acerta' && attacker.inventory.secondaryWeapon === null) {
      return { attribute: 'agilidade', value: this.randomNumberGenerator.generate(1, 20) + attacker.currentAttributes.agility + attacker.inventory.primaryWeapon.hittingBuff + attacker.buff + attacker.debuff + attacker.inventory.primaryArmor.debuff + attacker.inventory.secondaryArmor.debuff }
    }
    if (attackType === 'acerta' && attacker.inventory.secondaryWeapon != null) {
      return { attribute: 'agilidade', value: this.randomNumberGenerator.generate(1, 20) + attacker.currentAttributes.agility + attacker.inventory.primaryWeapon.hittingBuff + attacker.inventory.secondaryWeapon.hittingBuff + attacker.buff + attacker.debuff + attacker.inventory.primaryArmor.debuff + attacker.inventory.secondaryArmor.debuff }
    }
    throw new Error('Erro no calculo de fator de ataque')
  }

  private getDefenseFactor (defender: Servant): { attribute: 'agilidade' | 'tecnica', value: number } {
    if (defender.inventory.secondaryWeapon === null && defender.currentAttributes.agility > (defender.currentAttributes.technique + defender.guard + defender.inventory.primaryWeapon.defendingBuff)) {
      return { attribute: 'agilidade', value: this.randomNumberGenerator.generate(1, 20) + defender.currentAttributes.agility + defender.buff + defender.debuff + defender.inventory.primaryArmor.debuff + defender.inventory.secondaryArmor.debuff }
    }
    if (defender.inventory.secondaryWeapon === null && defender.currentAttributes.agility <= (defender.currentAttributes.technique + defender.guard + defender.inventory.primaryWeapon.defendingBuff)) {
      return { attribute: 'tecnica', value: this.randomNumberGenerator.generate(1, 20) + defender.currentAttributes.technique + defender.guard + defender.inventory.primaryWeapon.defendingBuff + defender.buff + defender.debuff + defender.inventory.primaryArmor.debuff + defender.inventory.secondaryArmor.debuff }
    }

    if (defender.inventory.secondaryWeapon != null && defender.currentAttributes.agility > (defender.currentAttributes.technique + defender.guard + defender.inventory.primaryWeapon.defendingBuff + defender.inventory.secondaryWeapon.defendingBuff)) {
      return { attribute: 'agilidade', value: this.randomNumberGenerator.generate(1, 20) + defender.currentAttributes.agility + defender.buff + defender.debuff + defender.inventory.primaryArmor.debuff + defender.inventory.secondaryArmor.debuff }
    }

    if (defender.inventory.secondaryWeapon != null && defender.currentAttributes.agility <= (defender.currentAttributes.technique + defender.guard + defender.inventory.primaryWeapon.defendingBuff + defender.inventory.secondaryWeapon.defendingBuff)) {
      return { attribute: 'tecnica', value: this.randomNumberGenerator.generate(1, 20) + defender.currentAttributes.technique + defender.guard + defender.inventory.primaryWeapon.defendingBuff + defender.inventory.secondaryWeapon.defendingBuff + defender.buff + defender.debuff + defender.inventory.primaryArmor.debuff + defender.inventory.secondaryArmor.debuff }
    }
    throw new Error('Erro no calculo de fator de defesa')
  }

  private getPowerFactor (attacker: Servant): number {
    let powerFactor = this.randomNumberGenerator.generate(1, 10) + attacker.currentAttributes.strength
    if (attacker.inventory.primaryWeapon.maestryType === 'mão nua') powerFactor += attacker.maestry.bareHanded
    else if (attacker.inventory.primaryWeapon.maestryType === 'uma mão') powerFactor += attacker.maestry.oneHanded
    else if (attacker.inventory.primaryWeapon.maestryType === 'duas mãos') powerFactor += attacker.maestry.twoHanded
    else if (attacker.inventory.primaryWeapon.maestryType === 'haste') powerFactor += attacker.maestry.polearm
    else if (attacker.inventory.primaryWeapon.maestryType === 'arco') powerFactor += attacker.maestry.bow
    else if (attacker.inventory.primaryWeapon.maestryType === 'besta') powerFactor += attacker.maestry.crossbow
    else throw new Error('Erro no calculo do fator de poder')
    return powerFactor
  }

  private getResilienceFactor (defender: Servant): number {
    return this.randomNumberGenerator.generate(1, 10) + defender.currentAttributes.fortitude
  }

  private getWeaponArmorDamageRelation (attackerWeapon: Weapon, defenderArmor: Armor): number {
    if (defenderArmor.type === 'roupa') return attackerWeapon.damage.cloth
    if (defenderArmor.type === 'couro') return attackerWeapon.damage.leather
    if (defenderArmor.type === 'cota de malha') return attackerWeapon.damage.chainmail
    if (defenderArmor.type === 'placa') return attackerWeapon.damage.plate
    throw new Error('Erro no calculo de dano na armadura')
  }

  private defenderSecondaryArmorWillBeHit (attacker: Servant, secondaryArmorHittingFactor: number, defender: Servant, secondaryArmorEvasionFactor: number): boolean {
    if (secondaryArmorHittingFactor > secondaryArmorEvasionFactor) return true
    return false
  }
}

export default CombatManager
