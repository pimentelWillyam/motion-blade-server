import type Servant from '../model/Servant'
import type Profession from '../type/Profession'
import type AttackTestResult from '../type/AttackTestResult'
import type MemoryDataSource from '../../data/memory/MemoryDataSource'
import type AttackType from '../type/AttackType'
import type Weapon from '../type/Weapon'
import type ArmorType from '../type/ArmorType'
import type ServantLifeStatus from '../type/ServantLifeStatus'
import type ArmorEvasionTestResult from '../type/ArmorEvasionTestResult'
import type Attributes from '../type/Attributes'
import type Maestry from '../type/Maestry'
import type WeaponType from '../type/WeaponType'

class ServantController {
  constructor (readonly uuidGenerator: IUuidGenerator, private readonly memoryDataSource: MemoryDataSource) {}

  createServant = (masterId: string, name: string, fatherProfession: Profession, youthProfession: Profession): Servant => {
    if (this.memoryDataSource.fetchServantByName(name) == null) {
      return this.memoryDataSource.insertServantRegistry(masterId, name, fatherProfession, youthProfession)
    }
    throw new Error('Já existe um usuário com esse nome')
  }

  getServant = (name: string): Servant => {
    const fetchedServant = this.memoryDataSource.fetchServantByName(name)
    if (fetchedServant != null) return fetchedServant
    throw new Error('Não é possível encontrar um servo que não existe')
  }

  updateServant = (name: string, contentToUpdate: Servant): Servant => {
    const servantToBeUpdated = this.memoryDataSource.fetchServantByName(name)
    if (servantToBeUpdated != null) return this.memoryDataSource.updateServantByName(name, contentToUpdate)
    throw new Error('Não é possível atualizar um servo que não existe')
  }

  deleteServant = (name: string): Servant => {
    const servantToBeDeleted = this.memoryDataSource.fetchServantByName(name)
    if (servantToBeDeleted != null) return this.memoryDataSource.deleteServantByName(name)
    throw new Error('Não é possível remover um servo que não existe')
  }

  applyGuardOnServant (name: string, guardToBeApplied: number): Servant {
    const servant = this.getServant(name)
    if (servant != null) {
      servant.currentAttributes.guard = guardToBeApplied
      this.updateServant(name, servant)
      return servant
    }
    throw new Error('Não é possível aplicar guarda em um servo que não existe')
  }

  buffServant (name: string, buffValue: number): Servant {
    const servant = this.getServant(name)
    if (servant != null) {
      servant.currentAttributes.buff += buffValue
      this.updateServant(name, servant)
      return servant
    }
    throw new Error('Não é possível bufar um servo que não existe')
  }

  removeServantBuff (name: string): Servant {
    const servant = this.getServant(name)
    if (servant != null) {
      servant.currentAttributes.buff = 0
      this.updateServant(name, servant)
      return servant
    }
    throw new Error('Não é possível bufar um servo que não existe')
  }

  debuffServant (name: string, debuffValue: number): Servant {
    const servant = this.getServant(name)
    if (servant != null) {
      servant.currentAttributes.buff += debuffValue
      this.updateServant(name, servant)
      return servant
    }
    throw new Error('Não é possível bufar um servo que não existe')
  }

  removeServantDebuff (name: string): Servant {
    const servant = this.getServant(name)
    if (servant != null) {
      servant.currentAttributes.debuff = 0
      this.updateServant(name, servant)
      return servant
    }
    throw new Error('Não é possível bufar um servo que não existe')
  }

  attackTest (attacker: Servant, attackerDiceResult: number, defender: Servant, defenderDiceResult: number, attackType: AttackType): AttackTestResult {
    if (attackType === 'strike') return this.strike(attacker, attackerDiceResult, defender, defenderDiceResult)
    else if (attackType === 'throw') return this.throw(attacker, attackerDiceResult, defender, defenderDiceResult)
    else if (attackType === 'shoot') return this.shoot(attacker, attackerDiceResult, defender, defenderDiceResult)
    else throw new Error('Tipo de ataque inválido')
  }

  strike (attacker: Servant, attackerDiceResult: number, defender: Servant, defenderDiceResult: number): AttackTestResult {
    let attackerTestResult
    let defenderTestResult
    attacker.currentAttributes.guard = 0
    this.updateServant(attacker.name, attacker)
    if (defender.currentAttributes.agility > defender.currentAttributes.technique + defender.currentAttributes.guard) {
      attackerTestResult = attacker.currentAttributes.agility + attacker.currentAttributes.buff - attacker.currentAttributes.debuff + attackerDiceResult
      defenderTestResult = defender.currentAttributes.agility + defender.currentAttributes.buff - defender.currentAttributes.debuff + defenderDiceResult
      if (attacker.currentWeapon.type === 'mão nua') attackerTestResult -= 5
      if (defender.currentWeapon.type === 'mão nua') attackerTestResult -= 5
      if (defenderTestResult >= attackerTestResult * 2) {
        return 'Contra-ataque'
      } else if (defenderTestResult >= attackerTestResult) return 'Desvio'
      else return 'Acerto'
    } else {
      attackerTestResult = attacker.currentAttributes.agility + attacker.currentAttributes.buff - attacker.currentAttributes.debuff + attackerDiceResult
      defenderTestResult = defender.currentAttributes.technique + defender.currentAttributes.guard + defender.currentAttributes.buff - defender.currentAttributes.debuff + defenderDiceResult
      if (attacker.currentWeapon.type === 'mão nua') attackerTestResult -= 5
      if (defender.currentWeapon.type === 'mão nua') attackerTestResult -= 5
      if (defenderTestResult >= attackerTestResult * 2) return ('Contra-ataque')
      else if (defenderTestResult >= attackerTestResult) return ('Desvio')
      else return 'Acerto'
    }
  }

  throw (attacker: Servant, attackerDiceResult: number, defender: Servant, defenderDiceResult: number): AttackTestResult {
    let attackerTestResult
    let defenderTestResult
    attacker.currentAttributes.guard = 0
    this.updateServant(attacker.name, attacker)
    if (defender.currentAttributes.agility > defender.currentAttributes.technique + defender.currentAttributes.guard) {
      attackerTestResult = attacker.currentAttributes.technique + attacker.currentAttributes.buff - attacker.currentAttributes.debuff + attackerDiceResult
      defenderTestResult = defender.currentAttributes.agility + defender.currentAttributes.buff - defender.currentAttributes.debuff + defenderDiceResult
      if (!attacker.currentWeapon.throwable) throw new Error(`Não é possível lançar a arma que o servo ${attacker.name} possui em mãos`)
      if (defender.currentWeapon.type === 'mão nua') attackerTestResult -= 5
      if (defenderTestResult >= attackerTestResult * 2) {
        return 'Recarga demorada'
      } else if (defenderTestResult >= attackerTestResult) return 'Desvio'
      else return 'Acerto'
    } else {
      attackerTestResult = attacker.currentAttributes.technique + attacker.currentAttributes.buff - attacker.currentAttributes.debuff + attackerDiceResult
      defenderTestResult = defender.currentAttributes.technique + defender.currentAttributes.guard + defender.currentAttributes.buff - defender.currentAttributes.debuff + defenderDiceResult
      if (!attacker.currentWeapon.throwable) throw new Error('Não é possível lançar a arma que este servo possui em mãos')
      if (defender.currentWeapon.type === 'mão nua') attackerTestResult -= 5
      if (defenderTestResult >= attackerTestResult * 2) return ('Desequilíbrio')
      else if (defenderTestResult >= attackerTestResult) return ('Desvio')
      else return 'Acerto'
    }
  }

  shoot (attacker: Servant, attackerDiceResult: number, defender: Servant, defenderDiceResult: number): AttackTestResult {
    let attackerTestResult
    let defenderTestResult
    attacker.currentAttributes.guard = 0
    this.updateServant(attacker.name, attacker)
    if (defender.currentAttributes.agility > defender.currentAttributes.technique + defender.currentAttributes.guard) {
      attackerTestResult = attacker.currentAttributes.technique + attacker.currentAttributes.buff - attacker.currentAttributes.debuff + attackerDiceResult
      defenderTestResult = defender.currentAttributes.agility + defender.currentAttributes.buff - defender.currentAttributes.debuff + defenderDiceResult
      if (!attacker.currentWeapon.throwable) throw new Error(`Não é possível lançar a arma que o servo ${attacker.name} possui em mãos`)
      if (defender.currentWeapon.type === 'mão nua') attackerTestResult -= 5
      if (defenderTestResult >= attackerTestResult * 2) {
        return 'Recarga demorada'
      } else if (defenderTestResult >= attackerTestResult) return 'Desvio'
      else return 'Acerto'
    } else {
      attackerTestResult = attacker.currentAttributes.technique + attacker.currentAttributes.buff - attacker.currentAttributes.debuff + attackerDiceResult
      defenderTestResult = defender.currentAttributes.technique + defender.currentAttributes.guard + defender.currentAttributes.buff - defender.currentAttributes.debuff + defenderDiceResult
      if (!attacker.currentWeapon.throwable) throw new Error('Não é possível lançar a arma que este servo possui em mãos')
      if (defender.currentWeapon.type === 'mão nua') attackerTestResult -= 5
      if (defenderTestResult >= attackerTestResult * 2) return ('Desequilíbrio')
      else if (defenderTestResult >= attackerTestResult) return ('Desvio')
      else return 'Acerto'
    }
  }

  getDamageToDeal (attacker: Servant, attackerDiceResult: number, attackerWeapon: Weapon, defenderArmorType: ArmorType, defenderDiceResult: number): number {
  armorEvasionTest (attacker: Servant, attackerDiceResult: number, defender: Servant, defenderDiceResult: number): ArmorEvasionTestResult {
    if (attacker.currentAttributes.technique + attackerDiceResult > defender.currentAttributes.technique + defenderDiceResult) return 'Evaded armor'
    else return 'Hit armor'
  }

  getDamageToDeal (attacker: Servant, attackerDiceResult: number, attackerWeapon: Weapon, defender: Servant, defenderArmorType: ArmorType, defenderDiceResult: number): number {
    console.log('dado do atacante:', attackerDiceResult)
    console.log('dado do defensor:', defenderDiceResult)
    console.log('fortitude do defensor:', defender.currentAttributes.fortitude)
    console.log('tipo de arma do atacante:', attackerWeapon.type)
    console.log('tipo de armadura do defensor:', defenderArmorType)
    console.log('mastria na arma usada = ', this.getAttackerMaestryFromWeaponUsed(attacker, attackerWeapon))
    let attackerTestResult = attacker.currentAttributes.strength + attackerDiceResult
    const defenderTestResult = attacker.currentAttributes.fortitude + defenderDiceResult
    attackerTestResult += this.getAttackerMaestryFromWeaponUsed(attacker, attackerWeapon)
    attackerTestResult += this.getWeaponArmourDamageRelation(attacker.currentWeapon, defenderArmorType)
    return attackerTestResult - defenderTestResult
  }

  getAttackerMaestryFromWeaponUsed (attacker: Servant, weapon: Weapon): number {
    if (weapon.type === 'mão nua') return attacker.maestry.bareHanded
    else if (weapon.type === 'machado' || weapon.type === 'adaga' || weapon.type === 'martelo' || weapon.type === 'maça' || weapon.type === 'espada') return attacker.maestry.oneHanded
    else if (weapon.type === 'espada bastarda' || weapon.type === 'machado de batalha') return attacker.maestry.twoHanded
    else if (weapon.type === 'lança' || weapon.type === 'bastão') return attacker.maestry.polearm
    else if (weapon.type === 'arco') return attacker.maestry.bow
    else if (weapon.type === 'besta') return attacker.maestry.crossbow
    else throw new Error('Tipo de arma inválido')
  }

  getWeaponArmourDamageRelation (weapon: Weapon, defenderArmorType: ArmorType): number {
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

  dealDamage (servant: Servant, damageToDeal: number): ServantLifeStatus {
    let damageNotDealt = damageToDeal
    while (damageNotDealt !== 0) {
      if (servant.currentAttributes.agility !== 0 && servant.currentAttributes.agility >= damageNotDealt) {
        servant.currentAttributes.agility -= damageNotDealt
      } else if (servant.currentAttributes.agility !== 0 && servant.currentAttributes.agility < damageNotDealt) {
        damageNotDealt -= servant.currentAttributes.agility
        servant.currentAttributes.agility = 0
      } else if (servant.currentAttributes.technique !== 0 && servant.currentAttributes.technique >= damageNotDealt) {
        servant.currentAttributes.technique -= damageNotDealt
      } else if (servant.currentAttributes.technique !== 0 && servant.currentAttributes.technique < damageNotDealt) {
        damageNotDealt -= servant.currentAttributes.technique
        servant.currentAttributes.technique = 0
      } else if (servant.currentAttributes.strength !== 0 && servant.currentAttributes.strength >= damageNotDealt) {
        servant.currentAttributes.strength -= damageNotDealt
      } else if (servant.currentAttributes.strength !== 0 && servant.currentAttributes.strength < damageNotDealt) {
        damageNotDealt -= servant.currentAttributes.strength
        servant.currentAttributes.strength = 0
      } else if (servant.currentAttributes.fortitude !== 0 && servant.currentAttributes.fortitude >= damageNotDealt) {
        servant.currentAttributes.fortitude -= damageNotDealt
      } else if (servant.currentAttributes.fortitude !== 0 && servant.currentAttributes.fortitude < damageNotDealt) {
        damageNotDealt -= servant.currentAttributes.fortitude
        servant.currentAttributes.fortitude = 0
      }
    }
    if (servant.currentAttributes.agility === 0 && servant.currentAttributes.technique === 0 && servant.currentAttributes.strength === 0 && servant.currentAttributes.fortitude === 0) {
      this.deleteServant(servant.name)
      return 'Dead'
    }
    this.updateServant(servant.name, servant)
    return 'Alive'
  }
}

export default ServantController
