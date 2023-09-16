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

  async classes (message: Message): Promise<void> {
  async rollDice (message: Message<boolean>, diceSize: number): Promise<void> {
    await message.reply(this.randomNumberGenerator.generate(1, diceSize).toString())
  }

    const classesMessage = `
    preciso corrigir tudo
    `
    await message.reply(classesMessage)
  }

  async roll (message: Message, diceSides: number): Promise<void> {
    await message.reply(this.randomNumberGenerator.generate(1, diceSides).toString())
  }

  async createServant (message: Message<boolean>, name: string, fatherProfession: Profession, youthProfession: Profession): Promise<void> {
    const servant = this.memoryDataSource.insertServantRegistry(message.author.username, name, fatherProfession, youthProfession)
    await message.reply(`
    Servo criado com sucesso.
    
    Dados do servo:

    nome do mestre ${servant.masterId}
    nome: ${servant.name}
    profissão paterna: ${servant.fatherProfession}
    profissão da juventude: ${servant.youthProfession}
    agilidade: ${servant.currentAttributes.agility} de um máximo de ${servant.maximumAttributes.agility}
    tecnica: ${servant.currentAttributes.technique} de um máximo de ${servant.maximumAttributes.technique}
    força: ${servant.currentAttributes.strength} de um máximo de ${servant.maximumAttributes.strength}
    fortitude: ${servant.currentAttributes.fortitude} de um máximo de ${servant.maximumAttributes.fortitude}
    guarda: ${servant.currentAttributes.guard} de um máximo de ${servant.maximumAttributes.guard}
    buff: ${servant.currentAttributes.buff}
    debuff: ${servant.currentAttributes.buff}
    armadura: ${servant.armor.type}
    Arma em mãos: ${servant.currentWeapon.type}
    maestria com mãos nuas: ${servant.maestry.bareHanded}
    maestria com armas de uma mão: ${servant.maestry.oneHanded}
    maestria com armas de duas mãos: ${servant.maestry.twoHanded}
    maestria com armas de hastes: ${servant.maestry.polearm}
    maestria com arcos: ${servant.maestry.bow}
    maestria com bestas: ${servant.maestry.crossbow}
    `)
  }

  async getServantInfo (message: Message<boolean>, name: string): Promise<void> {
    const servant = this.memoryDataSource.fetchServantByName(name)
    if (servant === null) throw new Error(`O servo ${name} não existe `)
    const servantAttributesMessage = `
    Os atributos do servo ${name} são:

    nome do mestre ${servant.masterId}
      nome: ${servant.name}
      profissão paterna: ${servant.fatherProfession}
      profissão da juventude: ${servant.youthProfession}
      agilidade: ${servant.currentAttributes.agility} de um máximo de ${servant.maximumAttributes.agility}
      tecnica: ${servant.currentAttributes.technique} de um máximo de ${servant.maximumAttributes.technique}
      força: ${servant.currentAttributes.strength} de um máximo de ${servant.maximumAttributes.strength}
      fortitude: ${servant.currentAttributes.fortitude} de um máximo de ${servant.maximumAttributes.fortitude}
      guarda: ${servant.currentAttributes.guard} de um máximo de ${servant.maximumAttributes.guard}
      buff: ${servant.currentAttributes.buff}
      debuff: ${servant.currentAttributes.buff}
      armadura: ${servant.armor.type}
      Arma em mãos: ${servant.currentWeapon.type}
      maestria com mãos nuas: ${servant.maestry.bareHanded}
      maestria com armas de uma mão: ${servant.maestry.oneHanded}
      maestria com armas de duas mãos: ${servant.maestry.twoHanded}
      maestria com armas de hastes: ${servant.maestry.polearm}
      maestria com arcos: ${servant.maestry.bow}
      maestria com bestas: ${servant.maestry.crossbow}
    `
    await message.reply(servantAttributesMessage)
  }

  async attack (message: Message<boolean>, attackerName: string, defenderName: string): Promise<void> { // falta fazer
    let attackerDiceResult = this.randomNumberGenerator.generate(1, 20)
    await this.sleeper.sleep(2000)
    await message.reply(`${attackerName} tirou ${attackerDiceResult} nos dados`)
    let defenderDiceResult = this.randomNumberGenerator.generate(1, 20)
    await this.sleeper.sleep(2000)
    await message.reply(`${defenderName} tirou ${defenderDiceResult} nos dados`)
    const attackResultMessage = this.servantController.attackTest(attackerName, attackerDiceResult, defenderName, defenderDiceResult)
    await this.sleeper.sleep(2000)
    if (attackResultMessage === 'Acerto') {
      await message.reply(`${attackerName} tentou acertar ${defenderName} e conseguiu!`)
      attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
      await this.sleeper.sleep(2000)
      const defender = this.servantController.getServant(defenderName)
      if (defender.armor.type !== 'roupa') {
      } else {

      }
      await message.reply(`${attackerName} tirou ${attackerDiceResult} nos dados`)
      defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
      await this.sleeper.sleep(2000)
      await message.reply(`${defenderName} tirou ${defenderDiceResult} nos dados`)

      await this.sleeper.sleep(2000)
      if (damageToBeDealt > 0) {
        const defenderAttributes = this.servantManager.applyDamageToServant(defenderName, damageToBeDealt)
        await message.reply(`${defenderName} sofreu um dano de ${damageToBeDealt}!`)
        if (defenderAttributes === null) await message.reply(`${defenderName} foi morto por ${attackerName}`)
      } else {
        await message.reply(`A variação de dano foi de ${damageToBeDealt} portanto ${defenderName} não foi ferido!`)
      }
    }
    if (attackResultMessage === 'Contra-ataque') await message.reply(`${attackerName} tentou acertar ${defenderName} mas acabou sofrendo um contra-ataque`)
    if (attackResultMessage === 'Desarme') await message.reply(`${attackerName} tentou acertar ${defenderName} mas acabou sendo desarmado`)
    if (attackResultMessage === 'Desvio') await message.reply(`${attackerName} tentou acertar ${defenderName} mas ${defenderName} conseguiu se esquivar`)
    if (attackResultMessage === 'Defesa') await message.reply(`${attackerName} tentou acertar ${defenderName} mas ${defenderName} bloqueou o golpe`)
  }

  async rollServantAttack (message: Message<boolean>, attackerName: string, defenderName: string): Promise<void> {
    let attackerDiceResult = this.randomNumberGenerator.generate(1, 20)
    let defenderDiceResult = this.randomNumberGenerator.generate(1, 20)
    const attackResultMessage = this.servantManager.attack(attackerName, attackerDiceResult, defenderName, defenderDiceResult)
    await this.sleeper.sleep(2000)
    await message.reply(`${attackerName} tirou ${attackerDiceResult} nos dados`)
    await this.sleeper.sleep(2000)
    await message.reply(`${defenderName} tirou ${defenderDiceResult} nos dados`)
    await this.sleeper.sleep(2000)
    if (attackResultMessage === 'Acerto') {
      await message.reply(`${attackerName} tentou acertar ${defenderName} e conseguiu atingir seu inimigo!`)
      attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
      await this.sleeper.sleep(2000)
      await message.reply(`${attackerName} tirou ${attackerDiceResult} nos dados`)
      defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
      await this.sleeper.sleep(2000)
      await message.reply(`${defenderName} tirou ${defenderDiceResult} nos dados`)
      const damageToBeDealt = this.servantManager.servantDatabase[this.servantManager.getServantPositionByName(attackerName)].attributes.strength + attackerDiceResult - (this.servantManager.servantDatabase[this.servantManager.getServantPositionByName(defenderName)].attributes.fortitude + defenderDiceResult)
      await this.sleeper.sleep(2000)
      if (damageToBeDealt > 0) {
        const defenderAttributes = this.servantManager.applyDamageToServant(defenderName, damageToBeDealt)
        await message.reply(`${defenderName} sofreu um dano de ${damageToBeDealt}!`)
        if (defenderAttributes === null) await message.reply(`${defenderName} foi morto por ${attackerName}`)
      } else {
        await message.reply(`A variação de dano foi de ${damageToBeDealt} portanto ${defenderName} não foi ferido!`)
      }
    }
    if (attackResultMessage === 'Contra-ataque') await message.reply(`${attackerName} tentou acertar ${defenderName} mas acabou sofrendo um contra-ataque`)
    if (attackResultMessage === 'Desarme') await message.reply(`${attackerName} tentou acertar ${defenderName} mas acabou sendo desarmado`)
    if (attackResultMessage === 'Desvio') await message.reply(`${attackerName} tentou acertar ${defenderName} mas ${defenderName} conseguiu se esquivar`)
    if (attackResultMessage === 'Defesa') await message.reply(`${attackerName} tentou acertar ${defenderName} mas ${defenderName} bloqueou o golpe`)
  }

  async rollServantShoot (message: Message<boolean>, attackerName: string, defenderName: string): Promise<void> {
    let attackerDiceResult = this.randomNumberGenerator.generate(1, 20)
    let defenderDiceResult = this.randomNumberGenerator.generate(1, 20)
    const attackResultMessage = this.servantManager.shoot(attackerName, attackerDiceResult, defenderName, defenderDiceResult)
    await this.sleeper.sleep(2000)
    await message.reply(`${attackerName} tirou ${attackerDiceResult} nos dados`)
    await this.sleeper.sleep(2000)
    await message.reply(`${defenderName} tirou ${defenderDiceResult} nos dados`)
    await this.sleeper.sleep(2000)
    if (attackResultMessage === 'Acerto') {
      await message.reply(`${attackerName} tentou acertar ${defenderName} e conseguiu atingir seu inimigo!`)
      attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
      await this.sleeper.sleep(2000)
      await message.reply(`${attackerName} tirou ${attackerDiceResult} nos dados`)
      defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
      await this.sleeper.sleep(2000)
      await message.reply(`${defenderName} tirou ${defenderDiceResult} nos dados`)
      const damageToBeDealt = this.servantManager.servantDatabase[this.servantManager.getServantPositionByName(attackerName)].attributes.strength + attackerDiceResult - (this.servantManager.servantDatabase[this.servantManager.getServantPositionByName(defenderName)].attributes.fortitude + defenderDiceResult)
      await this.sleeper.sleep(2000)
      if (damageToBeDealt > 0) {
        const defenderAttributes = this.servantManager.applyDamageToServant(defenderName, damageToBeDealt)
        await message.reply(`${defenderName} sofreu um dano de ${damageToBeDealt}!`)
        if (defenderAttributes === null) await message.reply(`${defenderName} foi morto por ${attackerName}`)
      } else {
        await message.reply(`A variação de dano foi de ${damageToBeDealt} portanto ${defenderName} não foi ferido!`)
      }
    }
    if (attackResultMessage === 'Contra-ataque') await message.reply(`${attackerName} tentou acertar ${defenderName} mas acabou sofrendo um contra-ataque`)
    if (attackResultMessage === 'Erro') await message.reply(`${attackerName} tentou acertar ${defenderName} mas errou seu alvo`)
  }

  async rollServantGuard (message: Message<boolean>, name: string): Promise<void> {
    const guard = this.randomNumberGenerator.generate(1, 4)
    await this.sleeper.sleep(2000)
    this.servantController.applyGuardOnServant(name, guard)
    await message.reply(`${name} entrou em uma guarde de ${guard} pontos`)
  }

  // async armServant (message: Message<boolean>, name: string): Promise<void> {
  //   this.servantManager.armServant(name)
  //   await message.reply(`${name} voltou a se armar`)
  // }

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

  // async levelUpServant (message: Message<boolean>, name: string, enemyStrenghtLevel: string): Promise<void> {
  //   const randomNumber = this.randomNumberGenerator.generate(1, 4)
  //   await this.sleeper.sleep(2000)
  //   if ((enemyStrenghtLevel === 'fraco' && randomNumber < 4) || (enemyStrenghtLevel === 'medio' && randomNumber < 3) || (enemyStrenghtLevel === 'forte' && randomNumber < 2)) {
  //     await message.reply(`O servo ${name} não foi capaz de melhorar nenhum atributo`)
  //     return
  //   }
  //   await message.reply(`O servo ${name} conseguiu melhorar um atributo!`)
  //   const attributeToLevelUp = this.randomNumberGenerator.generate(1, 4)
  //   await this.sleeper.sleep(2000)
  //   if (attributeToLevelUp === 1) {
  //     this.servantManager.healServant(name, 'agilidade', 1)
  //     await message.reply(`Servo ${name} melhorou sua agilidade`)
  //   } else if (attributeToLevelUp === 2) {
  //     this.servantManager.healServant(name, 'tecnica', 1)
  //     await message.reply(`Servo ${name} melhorou sua tecnica`)
  //   } else if (attributeToLevelUp === 3) {
  //     this.servantManager.healServant(name, 'força', 1)
  //     await message.reply(`Servo ${name} melhorou sua força`)
  //   } else if (attributeToLevelUp === 4) {
  //     this.servantManager.healServant(name, 'fortitude', 1)
  //     await message.reply(`Servo ${name} melhorou sua fortitude`)
  //   }
  // }
}

export default CommandManager
