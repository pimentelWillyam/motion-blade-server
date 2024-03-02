import { type Message } from 'discord.js'
import type Profession from '../type/Profession'
import type RandomNumberGenerator from './RandomNumberGenerator'
import type Sleeper from './Sleeper'
import type WeaponType from '../type/WeaponType'
import type ArmorType from '../type/ArmorType'
import type ServantService from '../../service/ServantService'
import type ServantUpgrader from './ServantUpgradeCalculator'
import type CombatManager from '../../helper/CombatManager'
import type BattleService from '../../service/BattleService'
import { type MovementDirection } from '../type/MovementDirection'
import { type Servant } from '../../factories/ServantFactory'

class CommandManager {
  constructor (private readonly randomNumberGenerator: RandomNumberGenerator, private readonly sleeper: Sleeper, private readonly servantService: ServantService, private readonly battleService: BattleService, private readonly servantUpgrader: ServantUpgrader, private readonly combatManager: CombatManager) {}

  async help (message: Message<boolean>): Promise<void> {
    const guideMessage = `Os comandos que existem são:

    Comandos informativos de um modo geral
      !ajuda
      !profissoes


    Comandos informativos sobre os servos
      !(nomeServo) atributos
      !(nomeServo) atributos maximos
      !(nomeServo) maestria
      !(nomeServo) inventário


    Comandos informativos sobre as batalhas
      !(nomeBatalha) info


    Comandos relacionados a rolagem de dados
      !rolar (dadoASerRolado)
      !(nomeServo) testa (atributo)


    Comandos relacionados a criação de servos
      !criar servo (nomeServo)
      !criar servo (nomeServo) (profissaoPaterna) (profissaoJuventude)
      !criar servo (nomeServo) (agilidade) (tecnica) (força) (fortitude)


    Comandos relacionados a criação e manutenção de batalhas
      !criar batalha (nomeBatalha)
      !inserir (nomeServo) (nomeBatalha)
      !remover (nomeServo) (nomeBatalha)
      !deletar batalha (nomeBatalha)
      !(nomeBatalha) rodar turno


    Comandos relacionados a administração do inventário
      !(nomeServo) veste (nomeArmadura)
      !(nomeServo) remove (nomeArmadura)
      !(nomeServo) guarda (nomeArma)
      !(nomeServo) descarta (nomeArma)
      !(nomeServo) saca (nomeArma)


    Comandos relacionados ao combate
    !(nomeServo) (direcao: a, w, d, s, aw, as, dw, ds)
    !(nomeServo) guarda
    !(nomeAtacante) acerta (nomeDefensor)
    !(nomeAtacante) lança (nomeDefensor)
    !(nomeAtacante) atira (nomeDefensor)
    !(nomeServo) gerar pontos

    Comandos relacionados aos buffs e debuffs
      !bufar (nomeServo) (valorBuff)
      !remover buff(nomeServo)
      !debufar (nomeServo) (valorDebuff)
      !remover debuff(nomeServo)


    Comandos relacionados a cura, aplicação de dano e melhorias
      !curar (nomeServo)
    !(nomeServo) sofre (danoASofrer)
      !(nomeServo) melhora (nomeAtributo | nomeMaestria) (quantidadeAAumentar)
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

  async createBattle (message: Message<boolean>, battleName: string): Promise<void> {
    if (await this.battleService.battleExists(battleName)) throw new Error(`Já existe uma batalha chamada ${battleName}, tente criar uma com outro nome`)
    await this.battleService.create(battleName)
    await message.reply('Batalha criada com sucesso.')
  }

  async insertServantInBattle (message: Message<boolean>, servantName: string, battleName: string): Promise<void> {
    if (!await this.servantService.servantExists(servantName)) throw new Error(`Não existe um servo chamado ${servantName}, tente inserir um servo que de fato exista`)
    if (!await this.battleService.battleExists(battleName)) throw new Error(`Não existe uma batalha chamada ${battleName}, tente inserir uma batalha que de fato exista`)
    const servant = await this.servantService.get(servantName)
    const battle = await this.battleService.get(battleName)
    battle.insertServant(servant)
    await this.battleService.update(battleName, battle)
    await this.servantService.update(servantName, servant)
    await this.getInfoFromBattle(message, battle.name)

    await message.reply(`O servo ${servantName} foi inserido na batalha ${battleName}`)
  }

  async removeServantFromBattle (message: Message<boolean>, battleName: string, servantName: string): Promise<void> {
    if (!await this.servantService.servantExists(servantName)) throw new Error(`Não existe um servo chamado ${servantName}, tente remover um servo que de fato exista`)
    if (!await this.battleService.battleExists(battleName)) throw new Error(`Não existe uma batalha chamada ${battleName}, tente remover uma batalha que de fato exista`)
    const servant = await this.servantService.get(servantName)
    const battle = await this.battleService.get(battleName)
    battle.removeServant(servant)
    servant.removeBattleInfo()
    await this.battleService.update(battleName, battle)
    await this.servantService.update(servantName, servant)
    await message.reply(`O servo ${servantName} foi removido da batalha ${battleName}`)
  }

  async generateServantBattlePoints (message: Message<boolean>, servantName: string): Promise<void> {
    await this.servantService.reduceBattlePoints(servantName)
    const generatedBattlePoints = await this.servantService.generateServantBattlePoints(servantName)
    await this.sleeper.sleep(1000)
    await message.reply(`O servo ${servantName} gerou ${generatedBattlePoints.initiativePoints} ponto(s) de iniciativa`)
    await this.sleeper.sleep(1000)
    await message.reply(`O servo ${servantName} gerou ${generatedBattlePoints.movementPoints.toFixed(1)} ponto(s) de movimento`)
    await this.sleeper.sleep(1000)
    await message.reply(`O servo ${servantName} gerou ${generatedBattlePoints.actionPoints.toFixed(1)} ponto(s) de ação`)
    await this.sleeper.sleep(1000)
  }

  async moveServant (message: Message<boolean>, servantName: string, movementDirection: MovementDirection): Promise<void> {
    const servant = await this.servantService.get(servantName)
    if (!servant.battleInfo.isInBattle) throw new Error(`O servo ${servant.name} não está em uma batalha, portanto não pode se mover`)
    const battle = await this.battleService.get(servant.battleInfo.battleName)
    await battle.moveServant(servant, movementDirection)
    await this.servantService.update(servant.name, servant)
    await this.battleService.update(battle.name, battle)
    await this.getInfoFromBattle(message, servant.battleInfo.battleName)
    await this.getServantBattlePoints(message, servant)
  }

  async getInfoFromBattle (message: Message<boolean>, battleName: string): Promise<void> {
    if (!await this.battleService.battleExists(battleName)) throw new Error(`Não existe uma batalha chamada ${battleName}, tente inserir uma batalha que de fato exista`)
    const battle = await this.battleService.get(battleName)
    const infoToShow = {
      battleName,
      participantsList: '',
      servantAboutToPlay: '',
      servantsYetToPlay: ''
    }
    for (let i = 0; i < battle.participantsList.length; i++) {
      infoToShow.participantsList += battle.participantsList[i].name
      if (i !== battle.participantsList.length - 1) infoToShow.participantsList += ', '
    }
    if (battle.turnInfo.servantsYetToPlay !== undefined) {
      for (let i = 0; i < battle.turnInfo.servantsYetToPlay.length; i++) {
        infoToShow.servantsYetToPlay += battle.turnInfo.servantsYetToPlay[i].name
        if (i !== battle.turnInfo.servantsYetToPlay.length - 1) infoToShow.servantsYetToPlay += ', '
      }
    }
    await message.reply(`
    Informações relevantes sobre esta batalha:
    Nome: ${battle.name}
    Participantes da batalha: ${infoToShow.participantsList}

    Servo da vez: ${infoToShow.servantAboutToPlay}
    Servos aguardando sua vez: ${infoToShow.servantsYetToPlay}

    ${battle.map[0].toString()}
    ${battle.map[1].toString()}
    ${battle.map[2].toString()}
    ${battle.map[3].toString()}
    ${battle.map[4].toString()}
    ${battle.map[5].toString()}
    ${battle.map[6].toString()}
    ${battle.map[7].toString()}

    `)
  }

  async rollBattleTurn (message: Message<boolean>, battleName: string): Promise<void> {
    if (!await this.battleService.battleExists(battleName)) throw new Error(`Não existe uma batalha chamada ${battleName}, tente inserir uma batalha que de fato exista`)
    const battle = await this.battleService.get(battleName)
    this.servantService.rollTurnForServants(battle.participantsList)
    await message.reply('Todos os participantes da batalha receberam seus pontos de ação e movimento')
  }

  async deleteBattle (message: Message<boolean>, battleName: string): Promise<void> {
    const battle = await this.battleService.get(battleName)
    for (let i = 0; i < battle.participantsList.length; i++) {
      await this.removeServantFromBattle(message, battleName, battle.participantsList[i].name)
    }
    await message.reply('Todos os participantes da batalha foram removidos e a batalha foi deletada')
  }

  async getServantAttributes (message: Message<boolean>, name: string): Promise<void> {
    const servant = await this.servantService.get(name)
    const servantAttributesMessage = `
    Os atributos do servo ${name} são:

      agilidade: ${servant.currentAttributes.agility}
      tecnica: ${servant.currentAttributes.technique}
      força: ${servant.currentAttributes.strength}
      fortitude: ${servant.currentAttributes.fortitude}
      guarda: ${servant.combatCapabilities.guard}
      buff: ${servant.combatCapabilities.buff}
      debuff: ${servant.combatCapabilities.debuff}
    `
    await message.reply(servantAttributesMessage)
  }

  async getServantBattlePoints (message: Message<boolean>, servant: Servant): Promise<void> {
    const servantAttributesMessage = `
    Os pontos de batalha do servo ${servant.name} são:
      pontos de iniciativa: ${servant.battlePoints.initiativePoints}
      pontos de ação: ${servant.battlePoints.actionPoints.toFixed(1)}
      pontos de movimento: ${servant.battlePoints.movementPoints.toFixed(1)}
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
    let servantAttributesMessage = ''
    servantAttributesMessage += `Os pertences do servo ${name} são:\n\n`
    if (servant.inventory.primaryArmor.type !== 'roupa') {
      servantAttributesMessage += `Armadura primária: ${servant.inventory.primaryArmor.type}\n`
      servantAttributesMessage += `Condição da armadura primária: ${servant.inventory.primaryArmor.condition}/${servant.inventory.primaryArmor.maximumCondition}\n\n`
    }
    if (servant.inventory.secondaryArmor.type !== 'roupa') {
      servantAttributesMessage += `Armadura secundária: ${servant.inventory.secondaryArmor.type}\n`
      servantAttributesMessage += `Condição da armadura secundária: ${servant.inventory.secondaryArmor.condition}/${servant.inventory.secondaryArmor.maximumCondition}\n\n`
    }
    servantAttributesMessage += `Arma primária: ${servant.inventory.primaryWeapon.type}\n`

    if (servant.inventory.secondaryWeapon != null) {
      servantAttributesMessage += `Arma secundária: ${servant.inventory.secondaryWeapon.type}\n`
    }
    servantAttributesMessage += `Armas guardadas: ${weaponsKept}\n\n`
    servantAttributesMessage += `Denários: ${servant.inventory.denars}\n`

    await message.reply(servantAttributesMessage)
  }

  async servantWearArmor (message: Message<boolean>, name: string, armorType: ArmorType): Promise<void> {
    await this.servantService.wearArmor(name, armorType)
    await message.reply(`O servo ${name} vestiu uma armadura de ${armorType}`)
  }

  async servantRemoveArmor (message: Message<boolean>, name: string): Promise<void> {
    const servant = await this.servantService.get(name)
    if (servant.inventory.primaryArmor.type === 'roupa') throw new Error(`O servo ${name} não possui armadura para remover`)
    await this.servantService.removeArmor(servant)
    await message.reply(`O servo ${name} removeu sua armadura de ${servant.inventory.primaryArmor.type} e a jogou fora`)
  }

  async servantKeepWeapon (message: Message<boolean>, name: string, weaponType: WeaponType): Promise<void> {
    await this.servantService.addWeaponToInventory(name, weaponType)
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

  async servantAttackServant (message: Message<boolean>, attackerName: string, attackType: 'acerta' | 'lança' | 'atira', defenderName: string): Promise<void> {
    const attackReport = await this.combatManager.servantAttacksServant(attackerName, attackType, defenderName)
    await this.sleeper.sleep(2000)
    await message.reply(`${attackReport.attacker.name} tirou ${attackReport.attackFactor?.value as number} no teste de ${attackReport.attackFactor?.attribute as string}`)
    await this.sleeper.sleep(2000)
    await message.reply(`${attackReport.defender.name} tirou ${attackReport.defenseFactor?.value as number} no teste de ${attackReport.defenseFactor?.attribute as string}`)
    await this.sleeper.sleep(2000)
    switch (attackReport.result) {
      case 'Block':
        await message.reply(`${attackReport.defender.name} bloqueou o ataque de ${attackReport.attacker.name}`)
        return

      case 'Disarm':
        await this.servantService.disarm(attackerName)
        await message.reply(`${attackReport.attacker.name} tentou acertar ${attackReport.defender.name} mas acabou sendo desarmado`)
        return

      case 'Dodge':
        await message.reply(`${attackReport.defender.name} desviou do ataque de ${attackReport.attacker.name}`)
        return

      case 'Counter':
        await message.reply(`${attackReport.attacker.name} tentou acertar ${attackReport.defender.name} mas acabou sofrendo um contra-ataque`)
        return

      case 'Error':
        await message.reply(`${attackReport.attacker.name} tentou acertar ${attackReport.defender.name} mas errou o alvo`)
        return

      case 'Off balance':
        await message.reply(`${attackReport.attacker.name} tentou acertar ${attackReport.defender.name} mas acabou perdendo o equilíbrio e caindo`)
        return

      case 'Slow reload':
        await message.reply(`${attackReport.attacker.name} tentou acertar ${attackReport.defender.name} mas acabou errando o alvo e demorando para recarregar`)
        return
      default:
        await message.reply(`${attackReport.attacker.name} tentou acertar ${attackReport.defender.name} e conseguiu`)
        break
    }
    if (attackReport.defenderHadArmor === true && attackReport.defenderSecondaryArmorHasBeenHit === true) {
      await this.sleeper.sleep(2000)
      await message.reply(`${attackReport.attacker.name} tenta desviar seu golpe da armadura de ${attackReport.defender.inventory.primaryArmor.type} que ${attackReport.defender.name} veste`)
      await this.sleeper.sleep(2000)
      await message.reply(`${attackReport.attacker.name} tirou ${attackReport.secondaryArmorHittingFactor as number} no teste de precisão`)
      await this.sleeper.sleep(2000)
      await message.reply(`${attackReport.defender.name} tirou ${attackReport.secondaryArmorEvasionFactor as number} no teste de contra-precisão`)
      await this.sleeper.sleep(2000)
      await message.reply(`${attackReport.attacker.name} teve sucesso e acertou o(a) ${attackReport.defender.inventory.secondaryArmor.type} que estava por baixo da armadura de ${attackReport.defender.inventory.primaryArmor.type}`)
    } else if (attackReport.defenderHadArmor === true && attackReport.defenderSecondaryArmorHasBeenHit === false) {
      await this.sleeper.sleep(2000)
      await message.reply(`${attackReport.attacker.name} tenta desviar seu golpe da armadura de ${attackReport.defender.inventory.primaryArmor.type} que ${attackReport.defender.name} veste`)
      await this.sleeper.sleep(2000)
      await message.reply(`${attackReport.attacker.name} tirou ${attackReport.secondaryArmorHittingFactor as number} no teste de precisão`)
      await this.sleeper.sleep(2000)
      await message.reply(`${attackReport.defender.name} tirou ${attackReport.secondaryArmorEvasionFactor as number} no teste de contra-precisão`)
      await this.sleeper.sleep(2000)
      await message.reply(`${attackReport.attacker.name} não teve sucesso e acabou acertando o(a) ${attackReport.defender.inventory.primaryArmor.type}`)
    }
    await this.sleeper.sleep(2000)
    await message.reply(`No teste de força de seu golpe ${attackReport.attacker.name} tirou ${attackReport.powerFactor as number}`)
    await this.sleeper.sleep(2000)
    await message.reply(`No teste de resistência ${attackReport.defender.name} tirou ${attackReport.resilienceFactor as number}`)
    await this.sleeper.sleep(2000)
    if (attackReport.defenderSecondaryArmorHasBeenHit === false && attackReport.defender.inventory.primaryArmor.type !== 'roupa') {
      const armorStatus = await this.servantService.armorTakesDamage(attackReport.defender, 'primary', attackReport.powerFactor as number)
      if (armorStatus.haveBeenBroken) await message.reply(`o(a) ${armorStatus.type} de ${attackReport.defender.name} foi quebrado(a)`)
    } else if (attackReport.defenderSecondaryArmorHasBeenHit === true && attackReport.defender.inventory.secondaryArmor.type !== 'roupa') {
      const armorStatus = await this.servantService.armorTakesDamage(attackReport.defender, 'secondary', attackReport.powerFactor as number)
      if (armorStatus.haveBeenBroken) await message.reply(`o(a) ${armorStatus.type} de ${attackReport.defender.name} foi quebrado(a)`)
    }
    if (attackReport.damageDealtToDefender as number <= 0) {
      await message.reply(`${attackReport.defender.name} não sofreu dano nenhum`)
      return
    }
    await message.reply(`${attackReport.defender.name} sofreu um dano de ${attackReport.damageDealtToDefender as number}`)
    if (attackReport.defenderSurvived as boolean) {
      await this.servantService.dealDamage(attackReport.defender, attackReport.damageDealtToDefender as number)
      return
    }
    await this.sleeper.sleep(2000)
    await message.reply(`O servo ${attackReport.defender.name} foi morto`)
    await this.servantService.delete(defenderName)
    await this.sleeper.sleep(2000)
    await message.reply(`${attackerName} recebeu ${attackReport.attributePointsToUpgrade as number} pontos de fator de aprimoramento`)
    let attributeNumber
    while (attackReport.amountOfTimesServantWillUpgrade as number > 0) {
      attributeNumber = this.randomNumberGenerator.generate(1, 4)
      switch (attributeNumber) {
        case 1: await this.servantService.upgrade(attackerName, 'agilidade', 1); await message.reply(`${attackerName} aprimorou sua agilidade`); break
        case 2: await this.servantService.upgrade(attackerName, 'tecnica', 1); await message.reply(`${attackerName} aprimorou sua técnica`); break
        case 3: await this.servantService.upgrade(attackerName, 'força', 1); await message.reply(`${attackerName} aprimorou sua força`); break
        case 4: await this.servantService.upgrade(attackerName, 'fortitude', 1); await message.reply(`${attackerName} aprimorou sua fortitude`); break
        default: throw new Error('Número de atributo inesperado')
      }
      (attackReport.amountOfTimesServantWillUpgrade as number)--
      await this.sleeper.sleep(2000)
    }
    if (attackReport.willMaestryBeUpgraded === true) {
      await this.sleeper.sleep(2000)
      await message.reply(`${attackerName} aprimorou sua maestria em ${attackReport.defender.inventory.primaryWeapon.maestryType} após matar ${defenderName}`)
      await this.servantService.upgrade(attackerName, attackReport.attacker.inventory.primaryWeapon.maestryType, 1)
    }
  }

  async damageServantArmor (message: Message<boolean>, name: string, armorToDamage: string, damageToDeal: number): Promise<void> {
    const servant = await this.servantService.get(name)
    let armorStatus: { type: ArmorType, haveBeenBroken: boolean }
    switch (armorToDamage) {
      case 'primaria':
        await message.reply(`A armadura ${armorToDamage} de ${name} sofreu ${damageToDeal} de dano`)
        armorStatus = await this.servantService.armorTakesDamage(servant, 'primary', damageToDeal)
        if (armorStatus.haveBeenBroken) await message.reply(`o(a) ${armorStatus.type} de ${servant.name} foi quebrado(a)`)

        break
      case 'secundaria':
        await message.reply(`A armadura ${armorToDamage} de ${name} sofreu ${damageToDeal} de dano`)
        armorStatus = await this.servantService.armorTakesDamage(servant, 'secondary', damageToDeal)
        if (armorStatus.haveBeenBroken) await message.reply(`o(a) ${armorStatus.type} de ${servant.name} foi quebrado(a)`)
        break
      default:
        throw new Error(`${armorToDamage} não é um tipo de armadura válido, escreva 'primaria' ou 'secundaria' para se referir a armadura que pretende danificar`)
    }
  }

  async servantTakesDamage (message: Message<boolean>, name: string, damageToDeal: number): Promise<void> {
    const servant = await this.servantService.get(name)
    if (await this.servantService.dealDamage(servant, damageToDeal) === 'Dead') {
      await message.reply(`O servo ${name} sofreu ${damageToDeal} de dano!`)
      await message.reply(`O servo ${name} foi morto`)
      await this.servantService.delete(servant.name)
    } else {
      await message.reply(`O servo ${name} sofreu ${damageToDeal} de dano!`)
    }
  }

  async healServant (message: Message<boolean>, name: string): Promise<void> {
    await this.servantService.heal(name)
    await message.reply(`O servo ${name} foi curado de todos seus ferimentos`)
  }

  async servantReceivesDenars (message: Message<boolean>, name: string, moneyToReceieve: number): Promise<void> {
    await this.servantService.addDenars(name, moneyToReceieve)
    await message.reply(`${name} ganhou ${moneyToReceieve} denários`)
  }

  async servantPaysDenars (message: Message<boolean>, name: string, moneyToReceieve: number): Promise<void> {
    await this.servantService.removeDenars(name, moneyToReceieve)
    await message.reply(`${name} perdeu ${moneyToReceieve} denários`)
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
