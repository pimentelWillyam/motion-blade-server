import type ArmorType from '../bot/type/ArmorType'
import { type Servant } from '../factories/ServantFactory'
import { type Weapon } from '../factories/WeaponFactory'

class DamageToDeal {
  get (attacker: Servant, attackerDiceResult: number, attackerWeapon: Weapon, defender: Servant, defenderArmorType: ArmorType, defenderDiceResult: number): number {
    let attackerTestResult = attacker.currentAttributes.strength + attackerDiceResult
    const defenderTestResult = defender.currentAttributes.fortitude + defenderDiceResult
    attackerTestResult += this.getAttackerMaestryFromWeaponUsed(attacker, attackerWeapon)
    attackerTestResult += this.getWeaponArmourDamageRelation(attacker.inventory.currentWeapon, defenderArmorType)
    return attackerTestResult - defenderTestResult
  }

  private getAttackerMaestryFromWeaponUsed (attacker: Servant, weapon: Weapon): number {
    if (weapon.type === 'mão nua') return attacker.maestry.bareHanded
    else if (weapon.type === 'machado' || weapon.type === 'adaga' || weapon.type === 'martelo' || weapon.type === 'maça' || weapon.type === 'espada') return attacker.maestry.oneHanded
    else if (weapon.type === 'espada bastarda' || weapon.type === 'machado de batalha') return attacker.maestry.twoHanded
    else if (weapon.type === 'lança' || weapon.type === 'bastão') return attacker.maestry.polearm
    else if (weapon.type === 'arco') return attacker.maestry.bow
    else if (weapon.type === 'besta') return attacker.maestry.crossbow
    else throw new Error('Tipo de arma inválido')
  }

  private getWeaponArmourDamageRelation (weapon: Weapon, defenderArmorType: ArmorType): number {
    if (weapon.damageType === 'corte' && defenderArmorType === 'roupa') return 6
    if (weapon.damageType === 'corte' && defenderArmorType === 'couro') return 4
    if (weapon.damageType === 'corte' && defenderArmorType === 'cota de malha') return 2
    if (weapon.damageType === 'corte' && defenderArmorType === 'placa') return -3
    if (weapon.damageType === 'perfuração' && defenderArmorType === 'roupa') return 6
    if (weapon.damageType === 'perfuração' && defenderArmorType === 'couro') return 5
    if (weapon.damageType === 'perfuração' && defenderArmorType === 'cota de malha') return -1
    if (weapon.damageType === 'perfuração' && defenderArmorType === 'placa') return -1
    if (weapon.damageType === 'impacto' && defenderArmorType === 'roupa') return 5
    if (weapon.damageType === 'impacto' && defenderArmorType === 'couro') return 3
    if (weapon.damageType === 'impacto' && defenderArmorType === 'cota de malha') return 1
    if (weapon.damageType === 'impacto' && defenderArmorType === 'placa') return 0
    else throw new Error('Tipo de dano inválido')
  }
}

export default DamageToDeal
