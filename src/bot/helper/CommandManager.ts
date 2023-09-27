import { type Message } from 'discord.js'
import type Profession from '../type/Profession'
import type RandomNumberGenerator from './RandomNumberGenerator'
import type Sleeper from './Sleeper'
import type WeaponType from '../type/WeaponType'
import type ArmorType from '../type/ArmorType'
import type ServantService from '../../service/ServantService'
import type DamageToDeal from '../../helper/DamageToDeal'

class CommandManager {
  constructor (private readonly randomNumberGenerator: RandomNumberGenerator, private readonly sleeper: Sleeper, private readonly servantService: ServantService, private readonly damageToDeal: DamageToDeal) {}

  async help (message: Message<boolean>): Promise<void> {
    const guideMessage = `
    Os comandos que existem são:

    1- !ajuda

    2- !profissoes

    3- !rolar

    4- !criar servo (nomeServo)
    
    5- !criar servo (nomeServo) (profissaoPaterna) (profissaoJuventude)

    6- !criar servo (nomeServo) (agilidade) (tecnica) (força) (fortitude)

    7- !(nomeServo) atributos

    8- !(nomeServo) atributos maximos

    9- !(nomeServo) maestria

    10- !(nomeServo) inventário

    11- !(nomeServo) veste (nomeArmadura)

    12- !(nomeServo) remove (nomeArmadura)

    13- !(nomeServo) guarda (nomeArma)

    14- !(nomeServo) descarta (nomeArma)

    15- !(nomeServo) saca (nomeArma)

    16- !(nomeServo) testa (atributo)

    17- !(nomeServo) guarda

    18- !bufar (nomeServo) (valorBuff)

    19- !remover buff(nomeServo)

    20- !debufar (nomeServo) (valorDebuff)

    21- !remover debuff(nomeServo)

    22- !(nomeAtacante) acerta (nomeDefensor)

    23- !(nomeAtacante) lança (nomeDefensor)

    24- !(nomeAtacante) atira (nomeDefensor)

    25- !(nomeServo) sofre (danoASofrer)

    26- !curar (nomeServo)

    27- !(nomeServo) melhora (nomeAtributo | nomeMaestria) (quantidadeAAumentar)
    `

    await message.reply(guideMessage)
  }

  async rollDice (message: Message<boolean>, diceSize: number): Promise<void> {
    await message.reply(this.randomNumberGenerator.generate(1, diceSize).toString())
  }

  async getProfessionsInfo (message: Message): Promise<void> {
    const classesMessage = `
    As profissões e os respectivos atributos que elas fornecem são: 
    soldado: força 3, fortitude 1
    bandido: força 3, agilidade 1
    ferreiro: força 3, técnica 1  
    barbaro: força 4    
    açougueiro: força 2, fortitude 2
    lenhador: agilidade 2, força 2 
    guerreiro: força 2, técnica 2  
    batedor: agilidade 3, força 1
    saqueador: agilidade 3, fortitude 1
    assassino: agilidade 3, técnica 1 
    ladrao: agilidade 4
    nomade:  agilidade 2, fortitude 2
    monge: agilidade 2, técnica 2
    infante: fortitude 3, força 1
    patrulheiro: fortitude 3, agilidade 1
    nobre: fortitude 3, técnica 1
    escravo: fortitude 4
    arqueiro: fortitude 2, técnica 2
    acrobata: técnica 3, força 1
    cavaleiro:  técnica 3, fortitude 1
    malabarista: técnica 3, agilidade 1
    caçador: técnica 4
    `
    await message.reply(classesMessage)
  }

  async createServant (message: Message<boolean>, name: string, fatherProfession: Profession, youthProfession: Profession): Promise<void> {
    if (await this.servantService.servantExists(name)) throw new Error(`Já existe um servo chamado ${name}, tente um novo nome`)
    await this.servantService.create(message.author.username, name, fatherProfession, youthProfession, false)
    await message.reply('Servo criado com sucesso.')
  }

  async createCustomServant (message: Message<boolean>, name: string, agility = 0, technique = 0, strength = 0, fortitude = 0): Promise<void> {
    if (await this.servantService.servantExists(name)) throw new Error(`Já existe um servo chamado ${name}, tente um novo nome`)
    void this.servantService.create('', name, 'soldado', 'soldado', true, { agility, technique, strength, fortitude })
    await message.reply('Servo criado com sucesso.')
  }

  async getServantAttributes (message: Message<boolean>, name: string): Promise<void> {
    const servant = await this.servantService.get(name)
    const servantAttributesMessage = `
    Os atributos do servo ${name} são:

      agilidade: ${servant.currentAttributes.agility}
      tecnica: ${servant.currentAttributes.technique}
      força: ${servant.currentAttributes.strength}
      fortitude: ${servant.currentAttributes.fortitude}
      guarda: ${servant.guard}
      buff: ${servant.buff}
      debuff: ${servant.debuff}
    `
    await message.reply(servantAttributesMessage)
  }

  async getServantMaximumAttributes (message: Message<boolean>, name: string): Promise<void> {
    const servant = await this.servantService.get(name)
    const servantAttributesMessage = `
    Os atributos máximos do servo ${name} são:

      agilidade máxima: ${servant.maximumAttributes.agility}
      tecnica máxima: ${servant.maximumAttributes.technique}
      força máxima: ${servant.maximumAttributes.strength}
      fortitude máxima: ${servant.maximumAttributes.fortitude}
    `
    await message.reply(servantAttributesMessage)
  }

  async getServantMaestry (message: Message<boolean>, name: string): Promise<void> {
    const servant = await this.servantService.get(name)
    const servantAttributesMessage = `
    As maestrias do servo ${name} são:

      maestria com mãos nuas: ${servant.maestry.bareHanded}
      maestria com armas de uma mão: ${servant.maestry.oneHanded}
      maestria com armas de duas mãos: ${servant.maestry.twoHanded}
      maestria com armas de hastes: ${servant.maestry.polearm}
      maestria com arcos: ${servant.maestry.bow}
      maestria com bestas: ${servant.maestry.crossbow}
    `
    await message.reply(servantAttributesMessage)
  }

  async getServantInventory (message: Message<boolean>, name: string): Promise<void> {
    const servant = await this.servantService.get(name)
    let weaponsKept = ''
    if (servant.inventory.carriedWeapons[0] !== undefined) weaponsKept = weaponsKept + servant.inventory.carriedWeapons[0].type + ', '
    if (servant.inventory.carriedWeapons[1] !== undefined) weaponsKept = weaponsKept + servant.inventory.carriedWeapons[1].type
    const servantAttributesMessage = `
    Os pertences do servo ${name} são:

      Armadura: ${servant.inventory.armor.type}
      Arma em mãos: ${servant.inventory.currentWeapon.type}
      Armas guardadas: ${weaponsKept}
    `
    await message.reply(servantAttributesMessage)
  }

  async servantWearArmor (message: Message<boolean>, name: string, armorType: ArmorType): Promise<void> {
    const servant = await this.servantService.get(name)
    if (servant.inventory.armor.type !== 'roupa') {
      await message.reply(`O servo ${name} removeu sua armadura de ${servant.inventory.armor.type} e a jogou fora`)
      await this.servantService.removeArmor(servant)
    }
    await this.servantService.wearArmor(servant, armorType)
    await message.reply(`O servo ${name} vestiu uma armadura de ${armorType}`)
  }

  async servantRemoveArmor (message: Message<boolean>, name: string): Promise<void> {
    const servant = await this.servantService.get(name)
    if (servant.inventory.armor.type === 'roupa') throw new Error(`O servo ${name} não possui armadura para remover`)
    await this.servantService.removeArmor(servant)
    await message.reply(`O servo ${name} removeu sua armadura de ${servant.inventory.armor.type} e a jogou fora`)
  }

  async servantKeepWeapon (message: Message<boolean>, name: string, weaponType: WeaponType): Promise<void> {
    await this.servantService.keepWeapon(name, weaponType)
    await message.reply(`O servo ${name} guardou um(a) ${weaponType} em seu inventário`)
  }

  async servantDrawWeapon (message: Message<boolean>, name: string, weaponType: WeaponType): Promise<void> {
    await this.servantService.drawWeapon(name, weaponType)
    await message.reply(`O servo ${name} sacou um(a) ${weaponType}`)
  }

  async servantDropWeapon (message: Message<boolean>, name: string, weaponType: WeaponType): Promise<void> {
    await this.servantService.dropWeapon(name, weaponType)
    await message.reply(`O servo ${name} jogou um(a) ${weaponType} fora`)
  }

  async applyServantGuard (message: Message<boolean>, name: string): Promise<void> {
    const guard = this.randomNumberGenerator.generate(1, 4)
    await this.sleeper.sleep(2000)
    await this.servantService.applyGuard(name, guard)
    await message.reply(`${name} entrou em uma guarde de ${guard} pontos`)
  }

  async servantTestsAttribute (message: Message<boolean>, name: string, attributeToBeTested: 'agilidade' | 'tecnica' | 'força' | 'fortitude'): Promise<void> {
    const servant = await this.servantService.get(name)
    let testResult: number
    if (attributeToBeTested === 'agilidade') testResult = servant.currentAttributes.agility + this.randomNumberGenerator.generate(1, 20)
    else if (attributeToBeTested === 'tecnica') testResult = servant.currentAttributes.technique + this.randomNumberGenerator.generate(1, 20)
    else if (attributeToBeTested === 'força') testResult = servant.currentAttributes.strength + this.randomNumberGenerator.generate(1, 10)
    else if (attributeToBeTested === 'fortitude') testResult = servant.currentAttributes.fortitude + this.randomNumberGenerator.generate(1, 10)
    else throw new Error('Atributo inválido')

    await message.reply(`O servo ${name} testou sua ${attributeToBeTested} e tirou ${testResult.toString()}`)
  }

  async buffServant (message: Message<boolean>, name: string, buffValue: number): Promise<void> {
    await this.servantService.buff(name, buffValue)
    await message.reply(`O servo ${name} recebeu um buff de ${buffValue} pontos`)
  }

  async removeServantBuff (message: Message<boolean>, name: string): Promise<void> {
    await this.servantService.removeBuff(name)
    await message.reply(`O servo ${name} não possui mais nenhum buff`)
  }

  async debuffServant (message: Message<boolean>, name: string, debuffValue: number): Promise<void> {
    await this.servantService.debuff(name, debuffValue)
    await message.reply(`O servo ${name} recebeu um debuff de ${debuffValue} pontos`)
  }

  async removeServantDebuff (message: Message<boolean>, name: string): Promise<void> {
    await this.servantService.removeDebuff(name)
    await message.reply(`O servo ${name} não possui mais nenhum debuff`)
  }

  async strike (message: Message<boolean>, attackerName: string, defenderName: string): Promise<void> {
    const attacker = await this.servantService.get(attackerName)
    if (!attacker.inventory.currentWeapon.strikable) throw new Error(`A arma que ${attacker.name} possui em mãos não pode ser usada para acertar alguém`)
    const defender = await this.servantService.get(defenderName)
    let attackerDiceResult = this.randomNumberGenerator.generate(1, 20)
    let damageToDeal
    await this.sleeper.sleep(2000)
    await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de agilidade`)
    let defenderDiceResult = this.randomNumberGenerator.generate(1, 20)
    await this.sleeper.sleep(2000)
    if (defender.currentAttributes.technique + defender.guard >= defender.currentAttributes.agility) await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de técnica`)
    else await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de agilidade`)
    const attackResultMessage = await this.servantService.attack(attacker, attackerDiceResult, defender, defenderDiceResult, 'strike')
    await this.sleeper.sleep(2000)
    if (attackResultMessage === 'Acerto') {
      await message.reply(`${attackerName} tentou acertar ${defenderName} e conseguiu!`)
      if (defender.inventory.armor.type === 'roupa') {
        attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de força `)
        defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${defenderDiceResult} no teste de fortitude `)
        const damageToDeal = this.damageToDeal.get(attacker, attackerDiceResult, attacker.inventory.currentWeapon, defender, defender.inventory.armor.type, defenderDiceResult)
        if (damageToDeal > 0) {
          const servantLifeStatus = await this.servantService.dealDamage(defender, damageToDeal)
          await this.sleeper.sleep(2000)
          await message.reply(`${defenderName} sofreu um dano de ${damageToDeal}`)
          await this.sleeper.sleep(2000)
          if (servantLifeStatus === 'Dead') await message.reply(`${defenderName} foi morto em combate por ${attackerName}`)
        } else {
          await message.reply(`${defenderName} não sofreu dano algum`)
        }
      } else if (defender.inventory.armor.type === 'couro' || defender.inventory.armor.type === 'cota de malha' || defender.inventory.armor.type === 'placa') {
        attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de técnica `)
        defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${defenderDiceResult} no teste de técnica `)
        const armorEvasionTestResult = this.servantService.armorEvasionTest(attacker, attackerDiceResult, defender, defenderDiceResult)
        if (armorEvasionTestResult === 'Hit armor') {
          await message.reply(`${attackerName} tentou acertar as partes menos protegidas da armadura de ${defenderName} mas acabou acertando a armadura`)
          damageToDeal = this.damageToDeal.get(attacker, attackerDiceResult, attacker.inventory.currentWeapon, defender, defender.inventory.armor.type, defenderDiceResult)
        } else if (armorEvasionTestResult === 'Evaded armor') {
          await message.reply(`${attackerName} tentou partes menos protegidas da armadura dede ${defenderName} e teve sucesso em faze-lo`)
          damageToDeal = this.damageToDeal.get(attacker, attackerDiceResult, attacker.inventory.currentWeapon, defender, 'roupa', defenderDiceResult)
        } else throw new Error('Erro ao testar evasão da armadura')
        if (damageToDeal > 0) {
          const servantLifeStatus = await this.servantService.dealDamage(defender, damageToDeal)
          await this.sleeper.sleep(2000)
          await message.reply(`${defenderName} sofreu um dano de ${damageToDeal}`)
          await this.sleeper.sleep(2000)
          if (servantLifeStatus === 'Dead') await message.reply(`${defenderName} foi morto em combate por ${attackerName}`)
        } else {
          await message.reply(`${defenderName} não sofreu dano algum`)
        }
      } else if (defender.inventory.armor.type === 'pouro') {
        attackerDiceResult = this.randomNumberGenerator.generate(1, 20)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de técnica `)
        defenderDiceResult = this.randomNumberGenerator.generate(1, 20)
        await this.sleeper.sleep(2000)
        await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de técnica `)
        const armorEvasionTestResult = this.servantService.armorEvasionTest(attacker, attackerDiceResult, defender, defenderDiceResult)
        if (armorEvasionTestResult === 'Hit armor') {
          await message.reply(`${attackerName} tentou acertar as partes menos protegidas da armadura de ${defenderName} mas acabou acertando a armadura`)
          attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
          await this.sleeper.sleep(2000)
          await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de força `)
          defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
          await this.sleeper.sleep(2000)
          await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de fortitude `)
          damageToDeal = this.damageToDeal.get(attacker, attackerDiceResult, attacker.inventory.currentWeapon, defender, 'placa', defenderDiceResult)
        } else if (armorEvasionTestResult === 'Evaded armor') {
          await message.reply(`${attackerName} tentou acertar as partes menos protegidas da armadura de ${defenderName} e conseguiu`)
          attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
          await this.sleeper.sleep(2000)
          await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de força `)
          defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
          await this.sleeper.sleep(2000)
          await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de fortitude `)
          damageToDeal = this.damageToDeal.get(attacker, attackerDiceResult, attacker.inventory.currentWeapon, defender, 'couro', defenderDiceResult)
        } else throw new Error('Erro ao testar evasão da armadura')
        if (damageToDeal > 0) {
          const servantLifeStatus = await this.servantService.dealDamage(defender, damageToDeal)
          await this.sleeper.sleep(2000)
          await message.reply(`${defenderName} sofreu um dano de ${damageToDeal}`)
          await this.sleeper.sleep(2000)
          if (servantLifeStatus === 'Dead') await message.reply(`${defenderName} foi morto em combate por ${attackerName}`)
        } else {
          await message.reply(`${defenderName} não sofreu dano algum`)
        }
      }
    } else if (attackResultMessage === 'Contra-ataque') await message.reply(`${attackerName} tentou acertar ${defenderName} mas acabou sofrendo um contra-ataque`)
    else if (attackResultMessage === 'Desarme') {
      await message.reply(`${attackerName} tentou acertar ${defenderName} mas acabou sendo desarmado`)
      const weaponToDiscard = attacker.inventory.currentWeapon.type
      await this.servantService.keepWeapon(attackerName, weaponToDiscard)
      await this.servantService.dropWeapon(attackerName, weaponToDiscard)
    } else if (attackResultMessage === 'Desvio') await message.reply(`${attackerName} tentou acertar ${defenderName} mas ${defenderName} conseguiu se esquivar`)
    else if (attackResultMessage === 'Defesa') await message.reply(`${attackerName} tentou acertar ${defenderName} mas ${defenderName} bloqueou o golpe`)
  }

  async throw (message: Message<boolean>, attackerName: string, defenderName: string): Promise<void> { // falta fazer
    const attacker = await this.servantService.get(attackerName)
    if (!attacker.inventory.currentWeapon.throwable) throw new Error(`A arma que ${attacker.name} possui em mãos não pode ser lançada alguém`)
    const defender = await this.servantService.get(defenderName)
    let attackerDiceResult = this.randomNumberGenerator.generate(1, 20)
    let damageToDeal
    await this.sleeper.sleep(2000)
    await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de técnica`)
    let defenderDiceResult = this.randomNumberGenerator.generate(1, 20)
    await this.sleeper.sleep(2000)
    if (defender.currentAttributes.technique + defender.guard >= defender.currentAttributes.agility) await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de técnica`)
    else await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de agilidade`)
    const attackResultMessage = await this.servantService.attack(attacker, attackerDiceResult, defender, defenderDiceResult, 'throw')
    await this.sleeper.sleep(2000)
    if (attackResultMessage === 'Acerto') {
      await message.reply(`${attackerName} tentou acertar ${defenderName} e conseguiu!`)
      if (defender.inventory.armor.type === 'roupa') {
        attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de força `)
        defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${defenderDiceResult} no teste de fortitude `)
        const damageToDeal = this.damageToDeal.get(attacker, attackerDiceResult, attacker.inventory.currentWeapon, defender, defender.inventory.armor.type, defenderDiceResult)
        if (damageToDeal > 0) {
          const servantLifeStatus = await this.servantService.dealDamage(defender, damageToDeal)
          await this.sleeper.sleep(2000)
          await message.reply(`${defenderName} sofreu um dano de ${damageToDeal}`)
          await this.sleeper.sleep(2000)
          if (servantLifeStatus === 'Dead') await message.reply(`${defenderName} foi morto em combate por ${attackerName}`)
        } else {
          await message.reply(`${defenderName} não sofreu dano algum`)
        }
      } else if (defender.inventory.armor.type === 'couro' || defender.inventory.armor.type === 'cota de malha' || defender.inventory.armor.type === 'placa') {
        attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de técnica `)
        defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${defenderDiceResult} no teste de técnica `)
        const armorEvasionTestResult = this.servantService.armorEvasionTest(attacker, attackerDiceResult, defender, defenderDiceResult)
        if (armorEvasionTestResult === 'Hit armor') {
          await message.reply(`${attackerName} tentou acertar as partes menos protegidas da armadura de ${defenderName} mas acabou acertando a armadura`)
          damageToDeal = this.damageToDeal.get(attacker, attackerDiceResult, attacker.inventory.currentWeapon, defender, defender.inventory.armor.type, defenderDiceResult)
        } else if (armorEvasionTestResult === 'Evaded armor') {
          await message.reply(`${attackerName} tentou partes menos protegidas da armadura dede ${defenderName} e teve sucesso em faze-lo`)
          damageToDeal = this.damageToDeal.get(attacker, attackerDiceResult, attacker.inventory.currentWeapon, defender, 'roupa', defenderDiceResult)
        } else throw new Error('Erro ao testar evasão da armadura')
        if (damageToDeal > 0) {
          const servantLifeStatus = await this.servantService.dealDamage(defender, damageToDeal)
          await this.sleeper.sleep(2000)
          await message.reply(`${defenderName} sofreu um dano de ${damageToDeal}`)
          await this.sleeper.sleep(2000)
          if (servantLifeStatus === 'Dead') await message.reply(`${defenderName} foi morto em combate por ${attackerName}`)
        } else {
          await message.reply(`${defenderName} não sofreu dano algum`)
        }
      } else if (defender.inventory.armor.type === 'pouro') {
        attackerDiceResult = this.randomNumberGenerator.generate(1, 20)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de técnica `)
        defenderDiceResult = this.randomNumberGenerator.generate(1, 20)
        await this.sleeper.sleep(2000)
        await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de técnica `)
        const armorEvasionTestResult = this.servantService.armorEvasionTest(attacker, attackerDiceResult, defender, defenderDiceResult)
        if (armorEvasionTestResult === 'Hit armor') {
          await message.reply(`${attackerName} tentou acertar as partes menos protegidas da armadura de ${defenderName} mas acabou acertando a armadura`)
          attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
          await this.sleeper.sleep(2000)
          await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de força `)
          defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
          await this.sleeper.sleep(2000)
          await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de fortitude `)
          damageToDeal = this.damageToDeal.get(attacker, attackerDiceResult, attacker.inventory.currentWeapon, defender, 'placa', defenderDiceResult)
        } else if (armorEvasionTestResult === 'Evaded armor') {
          await message.reply(`${attackerName} tentou acertar as partes menos protegidas da armadura de ${defenderName} e conseguiu`)
          attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
          await this.sleeper.sleep(2000)
          await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de força `)
          defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
          await this.sleeper.sleep(2000)
          await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de fortitude `)
          damageToDeal = this.damageToDeal.get(attacker, attackerDiceResult, attacker.inventory.currentWeapon, defender, 'couro', defenderDiceResult)
        } else throw new Error('Erro ao testar evasão da armadura')
        if (damageToDeal > 0) {
          const servantLifeStatus = await this.servantService.dealDamage(defender, damageToDeal)
          await this.sleeper.sleep(2000)
          await message.reply(`${defenderName} sofreu um dano de ${damageToDeal}`)
          await this.sleeper.sleep(2000)
          if (servantLifeStatus === 'Dead') await message.reply(`${defenderName} foi morto em combate por ${attackerName}`)
        } else {
          await message.reply(`${defenderName} não sofreu dano algum`)
        }
      }
      const weaponThrown = attacker.inventory.currentWeapon.type
      await this.servantService.keepWeapon(attacker.name, weaponThrown)
      await this.servantService.dropWeapon(attacker.name, weaponThrown)
    } else if (attackResultMessage === 'Desequilíbrio') await message.reply(`${attackerName} tentou acertar ${defenderName} mas acabou se desequilibrando e caindo no chão`)
    else if (attackResultMessage === 'Desvio') await message.reply(`${attackerName} tentou acertar ${defenderName} mas ${defenderName} conseguiu se esquivar`)
    else if (attackResultMessage === 'Defesa') await message.reply(`${attackerName} tentou acertar ${defenderName} mas ${defenderName} bloqueou o golpe`)
  }

  async shoot (message: Message<boolean>, attackerName: string, defenderName: string): Promise<void> { // falta fazer
    const attacker = await this.servantService.get(attackerName)
    if (!attacker.inventory.currentWeapon.shootable) throw new Error(`A arma que ${attacker.name} possui em mãos não pode ser usada para atirar em alguém`)
    const defender = await this.servantService.get(defenderName)
    let attackerDiceResult = this.randomNumberGenerator.generate(1, 20)
    let damageToDeal
    await this.sleeper.sleep(2000)
    await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de técnica`)
    let defenderDiceResult = this.randomNumberGenerator.generate(1, 20)
    await this.sleeper.sleep(2000)
    if (defender.currentAttributes.technique + defender.guard >= defender.currentAttributes.agility) await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de técnica`)
    else await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de agilidade`)
    const attackResultMessage = await this.servantService.attack(attacker, attackerDiceResult, defender, defenderDiceResult, 'shoot')
    await this.sleeper.sleep(2000)
    if (attackResultMessage === 'Acerto') {
      await message.reply(`${attackerName} tentou acertar ${defenderName} e conseguiu!`)
      if (defender.inventory.armor.type === 'roupa') {
        attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de força `)
        defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${defenderDiceResult} no teste de fortitude `)
        const damageToDeal = this.damageToDeal.get(attacker, attackerDiceResult, attacker.inventory.currentWeapon, defender, defender.inventory.armor.type, defenderDiceResult)
        if (damageToDeal > 0) {
          const servantLifeStatus = await this.servantService.dealDamage(defender, damageToDeal)
          await this.sleeper.sleep(2000)
          await message.reply(`${defenderName} sofreu um dano de ${damageToDeal}`)
          await this.sleeper.sleep(2000)
          if (servantLifeStatus === 'Dead') await message.reply(`${defenderName} foi morto em combate por ${attackerName}`)
        } else {
          await message.reply(`${defenderName} não sofreu dano algum`)
        }
      } else if (defender.inventory.armor.type === 'couro' || defender.inventory.armor.type === 'cota de malha' || defender.inventory.armor.type === 'placa') {
        attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de técnica `)
        defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${defenderDiceResult} no teste de técnica `)
        const armorEvasionTestResult = this.servantService.armorEvasionTest(attacker, attackerDiceResult, defender, defenderDiceResult)
        if (armorEvasionTestResult === 'Hit armor') {
          await message.reply(`${attackerName} tentou acertar as partes menos protegidas da armadura de ${defenderName} mas acabou acertando a armadura`)
          damageToDeal = this.damageToDeal.get(attacker, attackerDiceResult, attacker.inventory.currentWeapon, defender, defender.inventory.armor.type, defenderDiceResult)
        } else if (armorEvasionTestResult === 'Evaded armor') {
          await message.reply(`${attackerName} tentou partes menos protegidas da armadura dede ${defenderName} e teve sucesso em faze-lo`)
          damageToDeal = this.damageToDeal.get(attacker, attackerDiceResult, attacker.inventory.currentWeapon, defender, 'roupa', defenderDiceResult)
        } else throw new Error('Erro ao testar evasão da armadura')
        if (damageToDeal > 0) {
          const servantLifeStatus = await this.servantService.dealDamage(defender, damageToDeal)
          await this.sleeper.sleep(2000)
          await message.reply(`${defenderName} sofreu um dano de ${damageToDeal}`)
          await this.sleeper.sleep(2000)
          if (servantLifeStatus === 'Dead') await message.reply(`${defenderName} foi morto em combate por ${attackerName}`)
        } else {
          await message.reply(`${defenderName} não sofreu dano algum`)
        }
      } else if (defender.inventory.armor.type === 'pouro') {
        attackerDiceResult = this.randomNumberGenerator.generate(1, 20)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de técnica `)
        defenderDiceResult = this.randomNumberGenerator.generate(1, 20)
        await this.sleeper.sleep(2000)
        await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de técnica `)
        const armorEvasionTestResult = this.servantService.armorEvasionTest(attacker, attackerDiceResult, defender, defenderDiceResult)
        if (armorEvasionTestResult === 'Hit armor') {
          await message.reply(`${attackerName} tentou acertar as partes menos protegidas da armadura de ${defenderName} mas acabou acertando a armadura`)
          attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
          await this.sleeper.sleep(2000)
          await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de força `)
          defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
          await this.sleeper.sleep(2000)
          await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de fortitude `)
          damageToDeal = this.damageToDeal.get(attacker, attackerDiceResult, attacker.inventory.currentWeapon, defender, 'placa', defenderDiceResult)
        } else if (armorEvasionTestResult === 'Evaded armor') {
          await message.reply(`${attackerName} tentou acertar as partes menos protegidas da armadura de ${defenderName} e conseguiu`)
          attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
          await this.sleeper.sleep(2000)
          await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de força `)
          defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
          await this.sleeper.sleep(2000)
          await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de fortitude `)
          damageToDeal = this.damageToDeal.get(attacker, attackerDiceResult, attacker.inventory.currentWeapon, defender, 'couro', defenderDiceResult)
        } else throw new Error('Erro ao testar evasão da armadura')
        if (damageToDeal > 0) {
          const servantLifeStatus = await this.servantService.dealDamage(defender, damageToDeal)
          await this.sleeper.sleep(2000)
          await message.reply(`${defenderName} sofreu um dano de ${damageToDeal}`)
          await this.sleeper.sleep(2000)
          if (servantLifeStatus === 'Dead') await message.reply(`${defenderName} foi morto em combate por ${attackerName}`)
        } else {
          await message.reply(`${defenderName} não sofreu dano algum`)
        }
      }
    } else if (attackResultMessage === 'Recarga demorada') await message.reply(`${attackerName} tentou acertar ${defenderName} mas errou o alvo e ainda demorou para recarregar sua arma`)
    else if (attackResultMessage === 'Desvio') await message.reply(`${attackerName} tentou acertar ${defenderName} mas ${defenderName} conseguiu se esquivar`)
    else if (attackResultMessage === 'Defesa') await message.reply(`${attackerName} tentou acertar ${defenderName} mas ${defenderName} bloqueou o golpe`)
  }

  async servantTakesDamage (message: Message<boolean>, name: string, damageToDeal: number): Promise<void> {
    const servant = await this.servantService.get(name)
    if (await this.servantService.dealDamage(servant, damageToDeal) === 'Dead') {
      await message.reply(`O servo ${name} sofreu ${damageToDeal} de dano!`)
      await message.reply(`O servo ${name} foi morto`)
    } else {
      await message.reply(`O servo ${name} sofreu ${damageToDeal} de dano!`)
    }
  }

  async healServant (message: Message<boolean>, name: string): Promise<void> {
    await this.servantService.heal(name)
    await message.reply(`O servo ${name} foi curado de todos seus ferimentos`)
  }

  async upgradeServant (message: Message<boolean>, name: string, propertyToUpgrade: string, quantityToUpgrade: number): Promise<void> {
    if (propertyToUpgrade === 'mao nua') {
      await this.servantService.upgrade(name, 'mão nua', quantityToUpgrade)
      await message.reply(`O servo ${name} aprimorou sua maestria em combate desarmado em ${quantityToUpgrade}`)
      return
    } else if (propertyToUpgrade === 'uma mao') {
      await this.servantService.upgrade(name, 'uma mão', quantityToUpgrade)
      await message.reply(`O servo ${name} aprimorou sua maestria com armas de uma mão em ${quantityToUpgrade}`)
      return
    } else if (propertyToUpgrade === 'duas maos') {
      await this.servantService.upgrade(name, 'duas mãos', quantityToUpgrade)
      await message.reply(`O servo ${name} aprimorou sua maestria com armas de duas mãos em ${quantityToUpgrade}`)
      return
    } else if (propertyToUpgrade === 'haste') {
      await this.servantService.upgrade(name, 'haste', quantityToUpgrade)
      await message.reply(`O servo ${name} aprimorou sua maestria com armas de haste em ${quantityToUpgrade}`)
      return
    } else if (propertyToUpgrade === 'arco') {
      await this.servantService.upgrade(name, 'arco', quantityToUpgrade)
      await message.reply(`O servo ${name} aprimorou sua maestria arcos ${quantityToUpgrade}`)
      return
    } else if (propertyToUpgrade === 'besta') {
      await this.servantService.upgrade(name, 'besta', quantityToUpgrade)
      await message.reply(`O servo ${name} aprimorou sua maestria com bestas ${quantityToUpgrade}`)
      return
    } else if (propertyToUpgrade === 'agilidade') await this.servantService.upgrade(name, 'agilidade', quantityToUpgrade)
    else if (propertyToUpgrade === 'tecnica') await this.servantService.upgrade(name, 'tecnica', quantityToUpgrade)
    else if (propertyToUpgrade === 'força') await this.servantService.upgrade(name, 'força', quantityToUpgrade)
    else if (propertyToUpgrade === 'fortitude') await this.servantService.upgrade(name, 'fortitude', quantityToUpgrade)
    await message.reply(`O servo ${name} aprimorou sua ${propertyToUpgrade} em ${quantityToUpgrade}`)
  }
}

export default CommandManager
