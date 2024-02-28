import { type Servant } from '../factories/ServantFactory'
import type RandomNumberGenerator from '../bot/helper/RandomNumberGenerator'
import { type Armor } from '../factories/ArmorFactory'
import { type Weapon } from '../factories/WeaponFactory'
import type AttackReport from '../bot/type/AttackReport'
import type ServantService from '../service/ServantService'
import type ServantUpgrader from '../bot/helper/ServantUpgradeCalculator'

class CombatManager {
  constructor (private readonly servantService: ServantService, private readonly servantUpgrader: ServantUpgrader, readonly randomNumberGenerator: RandomNumberGenerator) {}

  async servantAttacksServant (attackerName: string, attackType: 'acerta' | 'lança' | 'atira', defenderName: string): Promise<AttackReport> {
    const attackReport: AttackReport = {
      attacker: await this.servantService.get(attackerName),
      defender: await this.servantService.get(defenderName),
      attackFactor: undefined,
      defenseFactor: undefined,
      defenderTriedToBlock: undefined,
      defenderHadArmor: undefined,
      secondaryArmorHittingFactor: undefined,
      secondaryArmorEvasionFactor: undefined,
      defenderSecondaryArmorHasBeenHit: undefined,
      powerFactor: undefined,
      resilienceFactor: undefined,
      weaponArmorDamageRelation: undefined,
      damageDealtToDefender: undefined,
      result: undefined,
      defenderSurvived: undefined,
      amountOfTimesServantWillUpgrade: undefined,
      attributePointsToUpgrade: undefined,
      willMaestryBeUpgraded: undefined
    }
    if (attackReport.attacker.battleInfo.isInBattle && attackReport.defender.battleInfo.isInBattle && attackReport.attacker.battlePoints.actionPoints < 1) throw new Error(`O servo ${attackerName} não possui pontos o suficiente para executar essa ação`)
    if ((attackReport.attacker.battleInfo.isInBattle && !attackReport.defender.battleInfo.isInBattle) || (!attackReport.attacker.battleInfo.isInBattle && attackReport.defender.battleInfo.isInBattle)) throw new Error('Comando inválido: um servo só pode atacar outro se os dois estiverem em uma batalha ou os dois estiverem fora de batalha')
    if (attackReport.attacker.battleInfo.battleName !== attackReport.defender.battleInfo.battleName) throw new Error('Um servo em batalha só pode atacar outro servo se os dois estiverem na mesma batalha')
    if (attackType === 'acerta' && !attackReport.attacker.inventory.primaryWeapon.strikable) throw new Error(`A arma usada por ${attackReport.attacker.name} não pode ser usada para acertar alguém`)
    if (attackType === 'lança' && !attackReport.attacker.inventory.primaryWeapon.throwable) throw new Error(`A arma usada por ${attackReport.attacker.name} não pode ser usada para lançar alguém`)
    if (attackType === 'atira' && !attackReport.attacker.inventory.primaryWeapon.shootable) throw new Error(`A arma usada por ${attackReport.attacker.name} não pode ser usada para lançar alguém`)
    await this.servantService.spendBattlePoints(attackerName, 'action')
    attackReport.defenderTriedToBlock = this.defenderWillTryToBlock(attackReport.defender)
    attackReport.attackFactor = this.getAttackFactor(attackReport.attacker, attackType)
    attackReport.defenseFactor = this.getDefenseFactor(attackReport.defender)
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
    attackReport.powerFactor = this.getPowerFactor(attackReport.attacker)
    attackReport.resilienceFactor = this.getResilienceFactor(attackReport.defender)

    if (attackReport.defender.inventory.primaryArmor.type !== 'roupa') {
      attackReport.defenderHadArmor = true
      attackReport.secondaryArmorHittingFactor = this.randomNumberGenerator.generate(1, 20) + attackReport.attacker.currentAttributes.technique
      attackReport.secondaryArmorEvasionFactor = this.randomNumberGenerator.generate(1, 20) + attackReport.defender.currentAttributes.technique

      attackReport.defenderSecondaryArmorHasBeenHit = this.defenderSecondaryArmorWillBeHit(attackReport.secondaryArmorHittingFactor, attackReport.secondaryArmorEvasionFactor)
    } else {
      attackReport.defenderHadArmor = false
      attackReport.defenderSecondaryArmorHasBeenHit = false
    }
    if (attackReport.defenderHadArmor && attackReport.defenderSecondaryArmorHasBeenHit) {
      attackReport.weaponArmorDamageRelation = this.getWeaponArmorDamageRelation(attackReport.attacker.inventory.primaryWeapon, attackReport.defender.inventory.secondaryArmor)
    } else {
      attackReport.weaponArmorDamageRelation = this.getWeaponArmorDamageRelation(attackReport.attacker.inventory.primaryWeapon, attackReport.defender.inventory.primaryArmor)
    }
    attackReport.damageDealtToDefender = attackReport.powerFactor + attackReport.weaponArmorDamageRelation - attackReport.resilienceFactor
    attackReport.defenderSurvived = this.defenderWillSurvive(attackReport.defender, attackReport.damageDealtToDefender)
    if (!attackReport.defenderSurvived) {
      attackReport.attributePointsToUpgrade = this.servantUpgrader.getAttributePointsToUpgrade(attackReport.attacker, attackReport.defender)
      attackReport.amountOfTimesServantWillUpgrade = this.servantUpgrader.getAmmountOfTimesServantWillUpgrade(attackReport.attributePointsToUpgrade)
      attackReport.willMaestryBeUpgraded = this.servantUpgrader.willMaestryBeUpgraded()
    }
    return attackReport
  }

  private defenderWillTryToBlock (defender: Servant): boolean {
    if (defender.inventory.secondaryWeapon === null && defender.currentAttributes.agility > (defender.currentAttributes.technique + defender.combatCapabilities.guard + defender.inventory.primaryWeapon.defendingBuff)) {
      return false
    }
    if (defender.inventory.secondaryWeapon === null && defender.currentAttributes.agility <= (defender.currentAttributes.technique + defender.combatCapabilities.guard + defender.inventory.primaryWeapon.defendingBuff)) {
      return true
    }

    if (defender.inventory.secondaryWeapon != null && defender.currentAttributes.agility > (defender.currentAttributes.agility + defender.combatCapabilities.guard + defender.inventory.primaryWeapon.defendingBuff + defender.inventory.secondaryWeapon.defendingBuff)) {
      return false
    }

    if (defender.inventory.secondaryWeapon != null && defender.currentAttributes.agility <= (defender.currentAttributes.technique + defender.combatCapabilities.guard + defender.inventory.primaryWeapon.defendingBuff + defender.inventory.secondaryWeapon.defendingBuff)) {
      return true
    }
    throw new Error('Erro no momento em que se verifica se o defensor irá defender')
  }

  private getAttackFactor (attacker: Servant, attackType: 'acerta' | 'lança' | 'atira'): { attribute: 'agilidade' | 'tecnica', value: number } {
    if ((attackType === 'atira' || attackType === 'lança') && attacker.inventory.secondaryWeapon === null) {
      return { attribute: 'tecnica', value: this.randomNumberGenerator.generate(1, 20) + attacker.currentAttributes.technique + attacker.inventory.primaryWeapon.hittingBuff + attacker.combatCapabilities.buff + attacker.combatCapabilities.debuff + attacker.inventory.primaryArmor.debuff + attacker.inventory.secondaryArmor.debuff }
    }
    if ((attackType === 'atira' || attackType === 'lança') && attacker.inventory.secondaryWeapon != null) {
      return { attribute: 'tecnica', value: this.randomNumberGenerator.generate(1, 20) + attacker.currentAttributes.technique + attacker.inventory.primaryWeapon.hittingBuff + attacker.inventory.secondaryWeapon.hittingBuff + attacker.combatCapabilities.buff + attacker.combatCapabilities.debuff + attacker.inventory.primaryArmor.debuff + attacker.inventory.secondaryArmor.debuff }
    }
    if (attackType === 'acerta' && attacker.inventory.secondaryWeapon === null) {
      return { attribute: 'agilidade', value: this.randomNumberGenerator.generate(1, 20) + attacker.currentAttributes.agility + attacker.inventory.primaryWeapon.hittingBuff + attacker.combatCapabilities.buff + attacker.combatCapabilities.debuff + attacker.inventory.primaryArmor.debuff + attacker.inventory.secondaryArmor.debuff }
    }
    if (attackType === 'acerta' && attacker.inventory.secondaryWeapon != null) {
      return { attribute: 'agilidade', value: this.randomNumberGenerator.generate(1, 20) + attacker.currentAttributes.agility + attacker.inventory.primaryWeapon.hittingBuff + attacker.inventory.secondaryWeapon.hittingBuff + attacker.combatCapabilities.buff + attacker.combatCapabilities.debuff + attacker.inventory.primaryArmor.debuff + attacker.inventory.secondaryArmor.debuff }
    }
    throw new Error('Erro no calculo de fator de ataque')
  }

  private getDefenseFactor (defender: Servant): { attribute: 'agilidade' | 'tecnica', value: number } {
    if (defender.inventory.secondaryWeapon === null && defender.currentAttributes.agility > (defender.currentAttributes.technique + defender.combatCapabilities.guard + defender.inventory.primaryWeapon.defendingBuff)) {
      return { attribute: 'agilidade', value: this.randomNumberGenerator.generate(1, 20) + defender.currentAttributes.agility + defender.combatCapabilities.buff + defender.combatCapabilities.debuff + defender.inventory.primaryArmor.debuff + defender.inventory.secondaryArmor.debuff }
    }
    if (defender.inventory.secondaryWeapon === null && defender.currentAttributes.agility <= (defender.currentAttributes.technique + defender.combatCapabilities.guard + defender.inventory.primaryWeapon.defendingBuff)) {
      return { attribute: 'tecnica', value: this.randomNumberGenerator.generate(1, 20) + defender.currentAttributes.technique + defender.combatCapabilities.guard + defender.inventory.primaryWeapon.defendingBuff + defender.combatCapabilities.buff + defender.combatCapabilities.debuff + defender.inventory.primaryArmor.debuff + defender.inventory.secondaryArmor.debuff }
    }

    if (defender.inventory.secondaryWeapon != null && defender.currentAttributes.agility > (defender.currentAttributes.technique + defender.combatCapabilities.guard + defender.inventory.primaryWeapon.defendingBuff + defender.inventory.secondaryWeapon.defendingBuff)) {
      return { attribute: 'agilidade', value: this.randomNumberGenerator.generate(1, 20) + defender.currentAttributes.agility + defender.combatCapabilities.buff + defender.combatCapabilities.debuff + defender.inventory.primaryArmor.debuff + defender.inventory.secondaryArmor.debuff }
    }

    if (defender.inventory.secondaryWeapon != null && defender.currentAttributes.agility <= (defender.currentAttributes.technique + defender.combatCapabilities.guard + defender.inventory.primaryWeapon.defendingBuff + defender.inventory.secondaryWeapon.defendingBuff)) {
      return { attribute: 'tecnica', value: this.randomNumberGenerator.generate(1, 20) + defender.currentAttributes.technique + defender.combatCapabilities.guard + defender.inventory.primaryWeapon.defendingBuff + defender.inventory.secondaryWeapon.defendingBuff + defender.combatCapabilities.buff + defender.combatCapabilities.debuff + defender.inventory.primaryArmor.debuff + defender.inventory.secondaryArmor.debuff }
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

  private defenderSecondaryArmorWillBeHit (secondaryArmorHittingFactor: number, secondaryArmorEvasionFactor: number): boolean {
    if (secondaryArmorHittingFactor > secondaryArmorEvasionFactor) return true
    return false
  }

  private readonly defenderWillSurvive = (defender: Servant, damagerDealt: number): boolean => {
    if (damagerDealt <= (defender.currentAttributes.agility + defender.currentAttributes.technique + defender.currentAttributes.strength + defender.currentAttributes.fortitude)) return true
    return false
  }
}

export default CombatManager
