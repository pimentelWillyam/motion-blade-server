import { type Message } from 'discord.js'
import type Profession from '../type/Profession'
import type MemoryDataSource from '../../data/memory/MemoryDataSource'
import type RandomNumberGenerator from './RandomNumberGenerator'
import type Sleeper from './Sleeper'
import type ServantController from '../controllers/ServantController'
import type WeaponType from '../type/WeaponType'

class CommandManager {
  constructor (private readonly randomNumberGenerator: RandomNumberGenerator, private readonly memoryDataSource: MemoryDataSource, private readonly sleeper: Sleeper, private readonly servantController: ServantController) {}

  async help (message: Message<boolean>): Promise<void> {
    const guideMessage = `
    Os comandos que existem são:

    1- !ajuda

    2- !profissoes

    3- !rolar

    4- !criar servo (nomeServo) (profissaoPaterna) (profissaoJuventude)

    5- !(nomeServo) atributos

    6- !(nomeServo) atributos maximos

    7- !(nomeServo) maestria

    8- !(nomeServo) inventário

    9- !(nomeServo) guarda (nomeArma)

    10- !(nomeServo) descarta (nomeArma)

    11- !(nomeServo) saca (nomeArma)

    12- !(nomeServo) testa (atributo)

    13- !(nomeServo) guarda

    14- !bufar (nomeServo) (valorBuff)

    15- !remover buff(nomeServo)

    16- !debufar (nomeServo) (valorDebuff)

    17- !remover debuff(nomeServo)

    18- !(nomeAtacante) acerta (nomeDefensor)

    19- !(nomeAtacante) lança (nomeDefensor)

    20- !(nomeAtacante) atira (nomeDefensor)

    21- !(nomeServo) sofre (danoASofrer)

    22- !curar (nomeServo)

    23- !(nomeServo) melhora (nomeAtributo | nomeMaestria)
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
    this.memoryDataSource.insertServantRegistry(message.author.username, name, fatherProfession, youthProfession)
    await message.reply('Servo criado com sucesso.')
  }

  async getServantAttributes (message: Message<boolean>, name: string): Promise<void> {
    const servant = this.memoryDataSource.fetchServantByName(name)
    if (servant === null) throw new Error(`O servo ${name} não existe `)
    const servantAttributesMessage = `
    Os atributos do servo ${name} são:

      agilidade: ${servant.currentAttributes.agility}
      tecnica: ${servant.currentAttributes.technique}
      força: ${servant.currentAttributes.strength}
      fortitude: ${servant.currentAttributes.fortitude}
      guarda: ${servant.currentAttributes.guard}
      buff: ${servant.currentAttributes.buff}
      debuff: ${servant.currentAttributes.debuff}
    `
    await message.reply(servantAttributesMessage)
  }

  async getServantMaximumAttributes (message: Message<boolean>, name: string): Promise<void> {
    const servant = this.memoryDataSource.fetchServantByName(name)
    if (servant === null) throw new Error(`O servo ${name} não existe `)
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
    const servant = this.memoryDataSource.fetchServantByName(name)
    if (servant === null) throw new Error(`O servo ${name} não existe `)
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
    const servant = this.memoryDataSource.fetchServantByName(name)
    if (servant === null) throw new Error(`O servo ${name} não existe `)
    let weaponsKept = ''
    if (servant.inventory[0] !== undefined) weaponsKept = weaponsKept + servant.inventory[0].type + ', '
    if (servant.inventory[1] !== undefined) weaponsKept = weaponsKept + servant.inventory[1].type
    const servantAttributesMessage = `
    Os pertences do servo ${name} são:

      Armadura: ${servant.armor.type}
      Arma em mãos: ${servant.currentWeapon.type}
      Armas guardadas: ${weaponsKept}
    `
    await message.reply(servantAttributesMessage)
  }

  async servantKeepWeapon (message: Message<boolean>, name: string, weaponType: WeaponType): Promise<void> {
    this.servantController.keepWeapon(name, weaponType)
    await message.reply(`O servo ${name} guardou um(a) ${weaponType} em seu inventário`)
  }

  async servantDrawWeapon (message: Message<boolean>, name: string, weaponType: WeaponType): Promise<void> {
    this.servantController.drawWeapon(name, weaponType)
    await message.reply(`O servo ${name} sacou um(a) ${weaponType}`)
  }

  async servantDropWeapon (message: Message<boolean>, name: string, weaponType: WeaponType): Promise<void> {
    this.servantController.dropWeapon(name, weaponType)
    await message.reply(`O servo ${name} jogou um(a) ${weaponType} fora`)
  }

  async applyServantGuard (message: Message<boolean>, name: string): Promise<void> {
    const guard = this.randomNumberGenerator.generate(1, 4)
    await this.sleeper.sleep(2000)
    this.servantController.applyGuardOnServant(name, guard)
    await message.reply(`${name} entrou em uma guarde de ${guard} pontos`)
  }

  async servantTestsAttribute (message: Message<boolean>, name: string, attributeToBeTested: 'agilidade' | 'tecnica' | 'força' | 'fortitude'): Promise<void> {
    const servant = this.memoryDataSource.fetchServantByName(name)
    if (servant === null) throw new Error(`O servo ${name} não existe `)
    let testResult: number
    if (attributeToBeTested === 'agilidade') testResult = servant.currentAttributes.agility + this.randomNumberGenerator.generate(1, 20)
    else if (attributeToBeTested === 'tecnica') testResult = servant.currentAttributes.technique + this.randomNumberGenerator.generate(1, 20)
    else if (attributeToBeTested === 'força') testResult = servant.currentAttributes.strength + this.randomNumberGenerator.generate(1, 10)
    else if (attributeToBeTested === 'fortitude') testResult = servant.currentAttributes.fortitude + this.randomNumberGenerator.generate(1, 10)
    else throw new Error('Atributo inválido')

    await message.reply(`O servo ${name} testou sua ${attributeToBeTested} e tirou ${testResult.toString()}`)
  }

  async buffServant (message: Message<boolean>, name: string, buffValue: number): Promise<void> {
    this.servantController.buffServant(name, buffValue)
    await message.reply(`O servo ${name} recebeu um buff de ${buffValue} pontos`)
  }

  async removeServantBuff (message: Message<boolean>, name: string): Promise<void> {
    this.servantController.removeServantBuff(name)
    await message.reply(`O servo ${name} não possui mais nenhum buff`)
  }

  async debuffServant (message: Message<boolean>, name: string, debuffValue: number): Promise<void> {
    this.servantController.debuffServant(name, debuffValue)
    await message.reply(`O servo ${name} recebeu um debuff de ${debuffValue} pontos`)
  }

  async removeServantDebuff (message: Message<boolean>, name: string): Promise<void> {
    this.servantController.removeServantDebuff(name)
    await message.reply(`O servo ${name} não possui mais nenhum debuff`)
  }

  async strike (message: Message<boolean>, attackerName: string, defenderName: string): Promise<void> {
    const attacker = this.servantController.getServant(attackerName)
    if (!attacker.currentWeapon.strikable) throw new Error(`A arma que ${attacker.name} possui em mãos não pode ser usada para acertar alguém`)
    const defender = this.servantController.getServant(defenderName)
    let attackerDiceResult = this.randomNumberGenerator.generate(1, 20)
    let damageToDeal
    await this.sleeper.sleep(2000)
    await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de agilidade`)
    let defenderDiceResult = this.randomNumberGenerator.generate(1, 20)
    await this.sleeper.sleep(2000)
    if (defender.currentAttributes.technique + defender.currentAttributes.guard >= defender.currentAttributes.agility) await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de técnica`)
    else await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de agilidade`)
    const attackResultMessage = this.servantController.attackTest(attacker, attackerDiceResult, defender, defenderDiceResult, 'strike')
    await this.sleeper.sleep(2000)
    if (attackResultMessage === 'Acerto') {
      await message.reply(`${attackerName} tentou acertar ${defenderName} e conseguiu!`)
      if (defender.armor.type === 'roupa') {
        attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de força `)
        defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${defenderDiceResult} no teste de fortitude `)
        const damageToDeal = this.servantController.getDamageToDeal(attacker, attackerDiceResult, attacker.currentWeapon, defender, defender.armor.type, defenderDiceResult)
        const servantLifeStatus = this.servantController.dealDamage(defender, damageToDeal)
        await this.sleeper.sleep(2000)
        await message.reply(`${defenderName} sofreu um dano de ${damageToDeal}`)
        await this.sleeper.sleep(2000)
        if (servantLifeStatus === 'Dead') await message.reply(`${defenderName} foi morto em combate por ${attackerName}`)
      } else if (defender.armor.type === 'couro' || defender.armor.type === 'cota de malha' || defender.armor.type === 'placa') {
        attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de técnica `)
        defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${defenderDiceResult} no teste de técnica `)
        const armorEvasionTestResult = this.servantController.armorEvasionTest(attacker, attackerDiceResult, defender, defenderDiceResult)
        if (armorEvasionTestResult === 'Hit armor') {
          await message.reply(`${attackerName} tentou acertar as partes menos protegidas da armadura de ${defenderName} mas acabou acertando a armadura`)
          damageToDeal = this.servantController.getDamageToDeal(attacker, attackerDiceResult, attacker.currentWeapon, defender, defender.armor.type, defenderDiceResult)
        } else if (armorEvasionTestResult === 'Evaded armor') {
          await message.reply(`${attackerName} tentou partes menos protegidas da armadura dede ${defenderName} e teve sucesso em faze-lo`)
          damageToDeal = this.servantController.getDamageToDeal(attacker, attackerDiceResult, attacker.currentWeapon, defender, 'roupa', defenderDiceResult)
        } else throw new Error('Erro ao testar evasão da armadura')
        const servantLifeStatus = this.servantController.dealDamage(defender, damageToDeal)
        await this.sleeper.sleep(2000)
        await message.reply(`${defenderName} sofreu um dano de ${damageToDeal}`)
        await this.sleeper.sleep(2000)
        if (servantLifeStatus === 'Dead') await message.reply(`${defenderName} foi morto em combate por ${attackerName}`)
      } else if (defender.armor.type === 'pouro') {
        attackerDiceResult = this.randomNumberGenerator.generate(1, 20)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de técnica `)
        defenderDiceResult = this.randomNumberGenerator.generate(1, 20)
        await this.sleeper.sleep(2000)
        await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de técnica `)
        const armorEvasionTestResult = this.servantController.armorEvasionTest(attacker, attackerDiceResult, defender, defenderDiceResult)
        if (armorEvasionTestResult === 'Hit armor') {
          await message.reply(`${attackerName} tentou acertar as partes menos protegidas da armadura de ${defenderName} mas acabou acertando a armadura`)
          attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
          await this.sleeper.sleep(2000)
          await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de força `)
          defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
          await this.sleeper.sleep(2000)
          await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de fortitude `)
          damageToDeal = this.servantController.getDamageToDeal(attacker, attackerDiceResult, attacker.currentWeapon, defender, 'placa', defenderDiceResult)
        } else if (armorEvasionTestResult === 'Evaded armor') {
          await message.reply(`${attackerName} tentou acertar as partes menos protegidas da armadura de ${defenderName} e conseguiu`)
          attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
          await this.sleeper.sleep(2000)
          await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de força `)
          defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
          await this.sleeper.sleep(2000)
          await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de fortitude `)
          damageToDeal = this.servantController.getDamageToDeal(attacker, attackerDiceResult, attacker.currentWeapon, defender, 'couro', defenderDiceResult)
        } else throw new Error('Erro ao testar evasão da armadura')

        await message.reply(`${defenderName} sofreu um dano de ${damageToDeal}`)
        const servantLifeStatus = this.servantController.dealDamage(defender, damageToDeal)
        await this.sleeper.sleep(2000)
        await this.sleeper.sleep(2000)
        if (servantLifeStatus === 'Dead') await message.reply(`${defenderName} foi morto em combate por ${attackerName}`)
      }
    } else if (attackResultMessage === 'Contra-ataque') await message.reply(`${attackerName} tentou acertar ${defenderName} mas acabou sofrendo um contra-ataque`)
    else if (attackResultMessage === 'Desarme') await message.reply(`${attackerName} tentou acertar ${defenderName} mas acabou sendo desarmado`)
    else if (attackResultMessage === 'Desvio') await message.reply(`${attackerName} tentou acertar ${defenderName} mas ${defenderName} conseguiu se esquivar`)
    else if (attackResultMessage === 'Defesa') await message.reply(`${attackerName} tentou acertar ${defenderName} mas ${defenderName} bloqueou o golpe`)
  }

  async throw (message: Message<boolean>, attackerName: string, defenderName: string): Promise<void> { // falta fazer
    const attacker = this.servantController.getServant(attackerName)
    if (!attacker.currentWeapon.throwable) throw new Error(`A arma que ${attacker.name} possui em mãos não pode ser lançada alguém`)
    const defender = this.servantController.getServant(defenderName)
    let attackerDiceResult = this.randomNumberGenerator.generate(1, 20)
    let damageToDeal
    await this.sleeper.sleep(2000)
    await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de técnica`)
    let defenderDiceResult = this.randomNumberGenerator.generate(1, 20)
    await this.sleeper.sleep(2000)
    if (defender.currentAttributes.technique + defender.currentAttributes.guard >= defender.currentAttributes.agility) await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de técnica`)
    else await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de agilidade`)
    const attackResultMessage = this.servantController.attackTest(attacker, attackerDiceResult, defender, defenderDiceResult, 'throw')
    await this.sleeper.sleep(2000)
    if (attackResultMessage === 'Acerto') {
      await message.reply(`${attackerName} tentou acertar ${defenderName} e conseguiu!`)
      if (defender.armor.type === 'roupa') {
        attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de força `)
        defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${defenderDiceResult} no teste de fortitude `)
        const damageToDeal = this.servantController.getDamageToDeal(attacker, attackerDiceResult, attacker.currentWeapon, defender, defender.armor.type, defenderDiceResult)
        const servantLifeStatus = this.servantController.dealDamage(defender, damageToDeal)
        await this.sleeper.sleep(2000)
        await message.reply(`${defenderName} sofreu um dano de ${damageToDeal}`)
        await this.sleeper.sleep(2000)
        if (servantLifeStatus === 'Dead') await message.reply(`${defenderName} foi morto em combate por ${attackerName}`)
      } else if (defender.armor.type === 'couro' || defender.armor.type === 'cota de malha' || defender.armor.type === 'placa') {
        attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de técnica `)
        defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${defenderDiceResult} no teste de técnica `)
        const armorEvasionTestResult = this.servantController.armorEvasionTest(attacker, attackerDiceResult, defender, defenderDiceResult)
        if (armorEvasionTestResult === 'Hit armor') {
          await message.reply(`${attackerName} tentou acertar as partes menos protegidas da armadura de ${defenderName} mas acabou acertando a armadura`)
          damageToDeal = this.servantController.getDamageToDeal(attacker, attackerDiceResult, attacker.currentWeapon, defender, defender.armor.type, defenderDiceResult)
        } else if (armorEvasionTestResult === 'Evaded armor') {
          await message.reply(`${attackerName} tentou partes menos protegidas da armadura dede ${defenderName} e teve sucesso em faze-lo`)
          damageToDeal = this.servantController.getDamageToDeal(attacker, attackerDiceResult, attacker.currentWeapon, defender, 'roupa', defenderDiceResult)
        } else throw new Error('Erro ao testar evasão da armadura')
        const servantLifeStatus = this.servantController.dealDamage(defender, damageToDeal)
        await this.sleeper.sleep(2000)
        await message.reply(`${defenderName} sofreu um dano de ${damageToDeal}`)
        await this.sleeper.sleep(2000)
        if (servantLifeStatus === 'Dead') await message.reply(`${defenderName} foi morto em combate por ${attackerName}`)
      } else if (defender.armor.type === 'pouro') {
        attackerDiceResult = this.randomNumberGenerator.generate(1, 20)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de técnica `)
        defenderDiceResult = this.randomNumberGenerator.generate(1, 20)
        await this.sleeper.sleep(2000)
        await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de técnica `)
        const armorEvasionTestResult = this.servantController.armorEvasionTest(attacker, attackerDiceResult, defender, defenderDiceResult)
        if (armorEvasionTestResult === 'Hit armor') {
          await message.reply(`${attackerName} tentou acertar as partes menos protegidas da armadura de ${defenderName} mas acabou acertando a armadura`)
          attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
          await this.sleeper.sleep(2000)
          await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de força `)
          defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
          await this.sleeper.sleep(2000)
          await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de fortitude `)
          damageToDeal = this.servantController.getDamageToDeal(attacker, attackerDiceResult, attacker.currentWeapon, defender, 'placa', defenderDiceResult)
        } else if (armorEvasionTestResult === 'Evaded armor') {
          await message.reply(`${attackerName} tentou acertar as partes menos protegidas da armadura de ${defenderName} e conseguiu`)
          attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
          await this.sleeper.sleep(2000)
          await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de força `)
          defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
          await this.sleeper.sleep(2000)
          await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de fortitude `)
          damageToDeal = this.servantController.getDamageToDeal(attacker, attackerDiceResult, attacker.currentWeapon, defender, 'couro', defenderDiceResult)
        } else throw new Error('Erro ao testar evasão da armadura')

        await message.reply(`${defenderName} sofreu um dano de ${damageToDeal}`)
        const servantLifeStatus = this.servantController.dealDamage(defender, damageToDeal)
        await this.sleeper.sleep(2000)
        await this.sleeper.sleep(2000)
        if (servantLifeStatus === 'Dead') await message.reply(`${defenderName} foi morto em combate por ${attackerName}`)
      }
    } else if (attackResultMessage === 'Desequilíbrio') await message.reply(`${attackerName} tentou acertar ${defenderName} mas acabou se desequilibrando e caindo no chão`)
    else if (attackResultMessage === 'Desvio') await message.reply(`${attackerName} tentou acertar ${defenderName} mas ${defenderName} conseguiu se esquivar`)
    else if (attackResultMessage === 'Defesa') await message.reply(`${attackerName} tentou acertar ${defenderName} mas ${defenderName} bloqueou o golpe`)
  }

  async shoot (message: Message<boolean>, attackerName: string, defenderName: string): Promise<void> { // falta fazer
    const attacker = this.servantController.getServant(attackerName)
    if (!attacker.currentWeapon.shootable) throw new Error(`A arma que ${attacker.name} possui em mãos não pode ser usada para atirar em alguém`)
    const defender = this.servantController.getServant(defenderName)
    let attackerDiceResult = this.randomNumberGenerator.generate(1, 20)
    let damageToDeal
    await this.sleeper.sleep(2000)
    await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de técnica`)
    let defenderDiceResult = this.randomNumberGenerator.generate(1, 20)
    await this.sleeper.sleep(2000)
    if (defender.currentAttributes.technique + defender.currentAttributes.guard >= defender.currentAttributes.agility) await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de técnica`)
    else await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de agilidade`)
    const attackResultMessage = this.servantController.attackTest(attacker, attackerDiceResult, defender, defenderDiceResult, 'shoot')
    await this.sleeper.sleep(2000)
    if (attackResultMessage === 'Acerto') {
      await message.reply(`${attackerName} tentou acertar ${defenderName} e conseguiu!`)
      if (defender.armor.type === 'roupa') {
        attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de força `)
        defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${defenderDiceResult} no teste de fortitude `)
        const damageToDeal = this.servantController.getDamageToDeal(attacker, attackerDiceResult, attacker.currentWeapon, defender, defender.armor.type, defenderDiceResult)
        const servantLifeStatus = this.servantController.dealDamage(defender, damageToDeal)
        await this.sleeper.sleep(2000)
        await message.reply(`${defenderName} sofreu um dano de ${damageToDeal}`)
        await this.sleeper.sleep(2000)
        if (servantLifeStatus === 'Dead') await message.reply(`${defenderName} foi morto em combate por ${attackerName}`)
      } else if (defender.armor.type === 'couro' || defender.armor.type === 'cota de malha' || defender.armor.type === 'placa') {
        attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de técnica `)
        defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${defenderDiceResult} no teste de técnica `)
        const armorEvasionTestResult = this.servantController.armorEvasionTest(attacker, attackerDiceResult, defender, defenderDiceResult)
        if (armorEvasionTestResult === 'Hit armor') {
          await message.reply(`${attackerName} tentou acertar as partes menos protegidas da armadura de ${defenderName} mas acabou acertando a armadura`)
          damageToDeal = this.servantController.getDamageToDeal(attacker, attackerDiceResult, attacker.currentWeapon, defender, defender.armor.type, defenderDiceResult)
        } else if (armorEvasionTestResult === 'Evaded armor') {
          await message.reply(`${attackerName} tentou partes menos protegidas da armadura dede ${defenderName} e teve sucesso em faze-lo`)
          damageToDeal = this.servantController.getDamageToDeal(attacker, attackerDiceResult, attacker.currentWeapon, defender, 'roupa', defenderDiceResult)
        } else throw new Error('Erro ao testar evasão da armadura')
        const servantLifeStatus = this.servantController.dealDamage(defender, damageToDeal)
        await this.sleeper.sleep(2000)
        await message.reply(`${defenderName} sofreu um dano de ${damageToDeal}`)
        await this.sleeper.sleep(2000)
        if (servantLifeStatus === 'Dead') await message.reply(`${defenderName} foi morto em combate por ${attackerName}`)
      } else if (defender.armor.type === 'pouro') {
        attackerDiceResult = this.randomNumberGenerator.generate(1, 20)
        await this.sleeper.sleep(2000)
        await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de técnica `)
        defenderDiceResult = this.randomNumberGenerator.generate(1, 20)
        await this.sleeper.sleep(2000)
        await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de técnica `)
        const armorEvasionTestResult = this.servantController.armorEvasionTest(attacker, attackerDiceResult, defender, defenderDiceResult)
        if (armorEvasionTestResult === 'Hit armor') {
          await message.reply(`${attackerName} tentou acertar as partes menos protegidas da armadura de ${defenderName} mas acabou acertando a armadura`)
          attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
          await this.sleeper.sleep(2000)
          await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de força `)
          defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
          await this.sleeper.sleep(2000)
          await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de fortitude `)
          damageToDeal = this.servantController.getDamageToDeal(attacker, attackerDiceResult, attacker.currentWeapon, defender, 'placa', defenderDiceResult)
        } else if (armorEvasionTestResult === 'Evaded armor') {
          await message.reply(`${attackerName} tentou acertar as partes menos protegidas da armadura de ${defenderName} e conseguiu`)
          attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
          await this.sleeper.sleep(2000)
          await message.reply(`${attackerName} tirou ${attackerDiceResult} no teste de força `)
          defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
          await this.sleeper.sleep(2000)
          await message.reply(`${defenderName} tirou ${defenderDiceResult} no teste de fortitude `)
          damageToDeal = this.servantController.getDamageToDeal(attacker, attackerDiceResult, attacker.currentWeapon, defender, 'couro', defenderDiceResult)
        } else throw new Error('Erro ao testar evasão da armadura')

        await message.reply(`${defenderName} sofreu um dano de ${damageToDeal}`)
        const servantLifeStatus = this.servantController.dealDamage(defender, damageToDeal)
        await this.sleeper.sleep(2000)
        await this.sleeper.sleep(2000)
        if (servantLifeStatus === 'Dead') await message.reply(`${defenderName} foi morto em combate por ${attackerName}`)
      }
    } else if (attackResultMessage === 'Desequilíbrio') await message.reply(`${attackerName} tentou acertar ${defenderName} mas acabou se desequilibrando e caindo no chão`)
    else if (attackResultMessage === 'Desvio') await message.reply(`${attackerName} tentou acertar ${defenderName} mas ${defenderName} conseguiu se esquivar`)
    else if (attackResultMessage === 'Defesa') await message.reply(`${attackerName} tentou acertar ${defenderName} mas ${defenderName} bloqueou o golpe`)
  }

  async servantTakesDamage (message: Message<boolean>, name: string, damageToDeal: number): Promise<void> {
    const servant = this.memoryDataSource.fetchServantByName(name)
    if (servant === null) throw new Error(`O servo ${name} não existe `)
    if (this.servantController.dealDamage(servant, damageToDeal) === 'Dead') {
      await message.reply(`O servo ${name} sofreu ${damageToDeal} de dano!`)
      await message.reply(`O servo ${name} foi morto`)
    } else {
      await message.reply(`O servo ${name} sofreu ${damageToDeal} de dano!`)
    }
  }

}

export default CommandManager
