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
