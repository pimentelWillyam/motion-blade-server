import type ICommandManager from '../interface/ICommandManager'
import type IRandomNumberGenerator from '../interface/IRandomNumberGenerator'
import type Servant from '../model/Servant'
import type IServantManager from '../interface/IServantManager'
import { type Message } from 'discord.js'
import type Profession from '../type/Profession'
import type ISleeper from '../interface/ISleeper'

class CommandManager implements ICommandManager {
  constructor (private readonly randomNumberGenerator: IRandomNumberGenerator, private readonly servantManager: IServantManager, private readonly Sleeper: ISleeper) {}

  async help (message: Message<boolean>): Promise<void> {
    const guideMessage = `
    Olá, sou o Bot responsável por administrar as operações relacionadas ao RPG. Atualmente, a lista de funcionalidades está em expansão, as funcionalidades que o bot possui até agora são:\n
    1- Ajuda
      A função ajuda é responsável por informar sobre os comandos existentes e como aplica-los. Ela é usada no formato: 
      
      !ajuda
 
    2- Classes
      A função classes é responsável por dizer quais são as classes existentes. Ela é usada no formato:

      !classes

      
    3- Rolar
      A função rolar é responsável por rolar um dado de n lados. Ela é usada no formato:
      
      !rolar (nLados)

    4- Criar Servo
      A função criar é responsável por criar um servo. Ela é usada no formato: 
      
      !criar servo (nomeServo) (classeServo)

    5-Atributos
      A função pega atributos é responsável por buscar atributos do servo no banco de dados. Ela é usada no formato: 
      
      !atributos (nomeServo)
      
    6-Aplicar Dano
      A função pega atributos é responsável por buscar atributos do servo no banco de dados. Ela é usada no formato: 
      
      !aplicar dano (nomeServo) (danoASerAplicado)

      7-Curar Servo
      A função curar servo é responsável por adicionar atributos ao servo mencionado. Ela é usada no formato: 
      
      !curar (atributo) (nomeServo)
      
      8-Armar Servo
      A função armar servo é responsável por devolver uma arma ao servo mencionado. Ela é usada no formato: 
      
      !armar (nomeServo)
      

    9- Teste de atributo
      A função Teste de atributo é responsável por testar o atributo de determinado servo. Ela é usada no formato:

      !(atributo) (nomeServo)
    `

    await message.reply(guideMessage)
  }

  async classes (message: Message): Promise<void> {
    const classesMessage = `
    As classes são: bárbaro, cavaleiro, caçador, escudeiro, infante, ladrão e monge
    `
    await message.reply(classesMessage)
  }

  async roll (message: Message, diceSides: number): Promise<void> {
    await message.reply(this.randomNumberGenerator.generate(1, diceSides).toString())
  }

  async createBattle (message: Message<boolean>, map: [number, number], participants: Servant[]): Promise<void> {
    console.log('this function is incomplete')
  }

  async createMaster (message: Message<boolean>, name: string, servantList: Servant[]): Promise<void> {
    console.log('this function is incomplete')
  }

  async createServant (message: Message<boolean>, name: string, profession: Profession): Promise<void> {
    const servant = this.servantManager.createServant(message.author.username, name, profession)
    if (servant.name !== undefined) {
      await message.reply(`
      Usuário criado com sucesso
      
      
      Dados do servo:
      nome: ${servant.name}
      agilidade: ${servant.attributes.agility}
      tecnica: ${servant.attributes.technique}
      força: ${servant.attributes.strength}
      fortitude: ${servant.attributes.fortitude}
      `)
    }
  }

  async createNpc (message: Message<boolean>, name: string): Promise<void> {
    this.servantManager.createNpc(name)
    await message.reply(`O servo ${name} foi criado com sucesso`)
  }

  async getServant (message: Message<boolean>, name: string): Promise<void> {
    const servant = this.servantManager.getServant(name)
    const servantAttributesMessage = `
    Os atributos do servo ${name} são:

    agilidade: ${servant.attributes.agility}
    tecnica: ${servant.attributes.technique}
    força: ${servant.attributes.strength}
    fortitude: ${servant.attributes.fortitude}
    guarda: ${servant.guard}
    buff: ${servant.buff}
    debuff: ${servant.debuff}

    `
    await message.reply(servantAttributesMessage)
  }

  async getServantAttributes (message: Message<boolean>, name: string): Promise<void> {
    const servant = this.servantManager.getServant(name)
    const servantAttributesMessage = `
      Os atributos do servo ${name} são:
  
      
      agilidade: ${servant.attributes.agility}
      tecnica: ${servant.attributes.technique}
      força: ${servant.attributes.strength}
      fortitude: ${servant.attributes.fortitude}
      guarda: ${servant.guard}
      buff: ${servant.buff}
      debuff: ${servant.debuff}
      `
    await message.reply(servantAttributesMessage)
  }

  async applyDamageToServant (message: Message<boolean>, name: string, damage: number): Promise<void> {
    const attributes = this.servantManager.applyDamageToServant(name, damage)
    await message.reply(`O servo ${name} sofreu um dano de ${damage}`)
    if (attributes === null) await message.reply(`O servo ${name} foi morto`)
  }

  async healServant (message: Message<boolean>, name: string, attributeToHeal: string, quantityToHeal: number): Promise<void> {
    this.servantManager.healServant(name, attributeToHeal, quantityToHeal)
    await message.reply(`O servo ${name} descansou e recuperou ${quantityToHeal} de ${attributeToHeal}`)
  }

  async rollServantAgility (message: Message<boolean>, name: string): Promise<void> {
    const diceResult = this.servantManager.rollServantAgility(name, this.randomNumberGenerator.generate(1, 20))
    await message.reply(`O servo ${name} tirou ${diceResult} de agilidade`)
  }

  async rollServantTechnique (message: Message<boolean>, name: string): Promise<void> {
    const diceResult = this.servantManager.rollServantTechnique(name, this.randomNumberGenerator.generate(1, 20))
    await message.reply(`O servo ${name} tirou ${diceResult} de técnica`)
  }

  async rollServantStrength (message: Message<boolean>, name: string): Promise<void> {
    const diceResult = this.servantManager.rollServantStrength(name, this.randomNumberGenerator.generate(1, 10))
    await message.reply(`O servo ${name} tirou ${diceResult} de força`)
  }

  async rollServantFortitude (message: Message<boolean>, name: string): Promise<void> {
    const diceResult = this.servantManager.rollServantFortitude(name, this.randomNumberGenerator.generate(1, 10))
    await message.reply(`O servo ${name} tirou ${diceResult} de fortitude`)
  }

  async rollServantAttack (message: Message<boolean>, attackerName: string, defenderName: string): Promise<void> {
    let attackerDiceResult = this.randomNumberGenerator.generate(1, 20)
    let defenderDiceResult = this.randomNumberGenerator.generate(1, 20)
    const attackResultMessage = this.servantManager.attack(attackerName, attackerDiceResult, defenderName, defenderDiceResult)
    await this.Sleeper.sleep(2000)
    await message.reply(`${attackerName} tirou ${attackerDiceResult} nos dados`)
    await this.Sleeper.sleep(2000)
    await message.reply(`${defenderName} tirou ${defenderDiceResult} nos dados`)
    await this.Sleeper.sleep(2000)
    if (attackResultMessage === 'Acerto') {
      await message.reply(`${attackerName} tentou acertar ${defenderName} e conseguiu atingir seu inimigo!`)
      attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
      await this.Sleeper.sleep(2000)
      await message.reply(`${attackerName} tirou ${attackerDiceResult} nos dados`)
      defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
      await this.Sleeper.sleep(2000)
      await message.reply(`${defenderName} tirou ${defenderDiceResult} nos dados`)
      const damageToBeDealt = this.servantManager.servantDatabase[this.servantManager.getServantPositionByName(attackerName)].attributes.strength + attackerDiceResult - (this.servantManager.servantDatabase[this.servantManager.getServantPositionByName(defenderName)].attributes.fortitude + defenderDiceResult)
      await this.Sleeper.sleep(2000)
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
    await this.Sleeper.sleep(2000)
    await message.reply(`${attackerName} tirou ${attackerDiceResult} nos dados`)
    await this.Sleeper.sleep(2000)
    await message.reply(`${defenderName} tirou ${defenderDiceResult} nos dados`)
    await this.Sleeper.sleep(2000)
    if (attackResultMessage === 'Acerto') {
      await message.reply(`${attackerName} tentou acertar ${defenderName} e conseguiu atingir seu inimigo!`)
      attackerDiceResult = this.randomNumberGenerator.generate(1, 10)
      await this.Sleeper.sleep(2000)
      await message.reply(`${attackerName} tirou ${attackerDiceResult} nos dados`)
      defenderDiceResult = this.randomNumberGenerator.generate(1, 10)
      await this.Sleeper.sleep(2000)
      await message.reply(`${defenderName} tirou ${defenderDiceResult} nos dados`)
      const damageToBeDealt = this.servantManager.servantDatabase[this.servantManager.getServantPositionByName(attackerName)].attributes.strength + attackerDiceResult - (this.servantManager.servantDatabase[this.servantManager.getServantPositionByName(defenderName)].attributes.fortitude + defenderDiceResult)
      await this.Sleeper.sleep(2000)
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
    this.servantManager.applyGuardOnServant(name, guard)
    await message.reply(`${name} entrou em uma guarde de ${guard} pontos`)
  }

  async armServant (message: Message<boolean>, name: string): Promise<void> {
    this.servantManager.armServant(name)
    await message.reply(`${name} voltou a se armar`)
  }

  async buffServant (message: Message<boolean>, name: string, buffValue: number): Promise<void> {
    this.servantManager.buffServant(name, buffValue)
    await message.reply(`O servo ${name} recebeu um buff de ${buffValue} pontos`)
  }

  async removeServantBuff (message: Message<boolean>, name: string): Promise<void> {
    this.servantManager.removeServantBuff(name)
    await message.reply(`O servo ${name} não possui mais nenhum buff`)
  }

  async debuffServant (message: Message<boolean>, name: string, debuffValue: number): Promise<void> {
    this.servantManager.debuffServant(name, debuffValue)
    await message.reply(`O servo ${name} recebeu um debuff de ${debuffValue} pontos`)
  }

  async removeServantDebuff (message: Message<boolean>, name: string): Promise<void> {
    this.servantManager.removeServantDebuff(name)
    await message.reply(`O servo ${name} não possui mais nenhum debuff`)
  }

  async levelUpServant (message: Message<boolean>, name: string, enemyStrenghtLevel: string): Promise<void> {
    const randomNumber = this.randomNumberGenerator.generate(1, 4)
    await this.Sleeper.sleep(2000)
    if ((enemyStrenghtLevel === 'fraco' && randomNumber < 4) || (enemyStrenghtLevel === 'medio' && randomNumber < 3) || (enemyStrenghtLevel === 'forte' && randomNumber < 2)) {
      await message.reply(`O servo ${name} não foi capaz de melhorar nenhum atributo`)
      return
    }
    await message.reply(`O servo ${name} conseguiu melhorar um atributo!`)
    const attributeToLevelUp = this.randomNumberGenerator.generate(1, 4)
    await this.Sleeper.sleep(2000)
    if (attributeToLevelUp === 1) {
      this.servantManager.healServant(name, 'agilidade', 1)
      await message.reply(`Servo ${name} melhorou sua agilidade`)
    } else if (attributeToLevelUp === 2) {
      this.servantManager.healServant(name, 'tecnica', 1)
      await message.reply(`Servo ${name} melhorou sua tecnica`)
    } else if (attributeToLevelUp === 3) {
      this.servantManager.healServant(name, 'força', 1)
      await message.reply(`Servo ${name} melhorou sua força`)
    } else if (attributeToLevelUp === 4) {
      this.servantManager.healServant(name, 'fortitude', 1)
      await message.reply(`Servo ${name} melhorou sua fortitude`)
    }
  }
}

export default CommandManager
