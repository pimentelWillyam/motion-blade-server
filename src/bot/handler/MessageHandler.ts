
import { type Message } from 'discord.js'
import type Profession from '../type/Profession'
import type CommandManager from '../helper/CommandManager'
import type WeaponType from '../type/WeaponType'
import type Attribute from '../type/Attribute'
import type ArmorType from '../type/ArmorType'

class MessageHandler {
  constructor (private readonly commandManager: CommandManager) {}

  async handle (message: Message): Promise<void> {
    try {
      if (message.author.username === 'RPG Master') return
      else if (!this.isACommand(message.content)) return
      const treatedMessage = this.treatMessage(message.content)
      if (treatedMessage[0] === 'ajuda' && treatedMessage.length === 1) {
        await this.commandManager.help(message)
      } else if (treatedMessage[0] === 'profissoes' && treatedMessage.length === 1) {
        await this.commandManager.getProfessionsInfo(message)
      } else if (treatedMessage[0] === 'rolar' && treatedMessage.length === 2) {
        await this.commandManager.rollDice(message, parseInt(treatedMessage[1]))
      } else if (treatedMessage[0] === 'criar' && treatedMessage[1] === 'servo' && treatedMessage.length === 5) {
        await this.commandManager.createServant(message, treatedMessage[2], treatedMessage[3] as Profession, treatedMessage[4] as Profession)
      } else if (treatedMessage[1] === 'atributos' && treatedMessage.length === 2) {
        await this.commandManager.getServantAttributes(message, treatedMessage[0])
      } else if (treatedMessage[1] === 'atributos' && treatedMessage[2] === 'maximos' && treatedMessage.length === 3) {
        await this.commandManager.getServantMaximumAttributes(message, treatedMessage[0])
      } else if (treatedMessage[1] === 'maestria' && treatedMessage.length === 2) {
        await this.commandManager.getServantMaestry(message, treatedMessage[0])
      } else if (treatedMessage[1] === 'veste' && treatedMessage.length === 3) {
        await this.commandManager.servantWearArmor(message, treatedMessage[0], treatedMessage[2] as ArmorType)
      } else if (treatedMessage[1] === 'remove' && treatedMessage[2] === 'armadura' && treatedMessage.length === 3) {
        await this.commandManager.servantRemoveArmor(message, treatedMessage[0])
      } else if (treatedMessage[1] === 'inventario' && treatedMessage.length === 2) {
        await this.commandManager.getServantInventory(message, treatedMessage[0])
      } else if (treatedMessage[1] === 'guarda' && treatedMessage.length === 3) {
        await this.commandManager.servantKeepWeapon(message, treatedMessage[0], treatedMessage[2] as WeaponType)
      } else if (treatedMessage[1] === 'guarda' && treatedMessage.length === 4) {
        await this.commandManager.servantKeepWeapon(message, treatedMessage[0], (treatedMessage[2] + ' ' + treatedMessage[3] as WeaponType))
      } else if (treatedMessage[1] === 'guarda' && treatedMessage.length === 5) {
        await this.commandManager.servantKeepWeapon(message, treatedMessage[0], (treatedMessage[2] + ' ' + treatedMessage[3] + ' ' + treatedMessage[4] as WeaponType))
      } else if (treatedMessage[1] === 'descarta' && treatedMessage.length === 3) {
        await this.commandManager.servantDropWeapon(message, treatedMessage[0], treatedMessage[2] as WeaponType)
      } else if (treatedMessage[1] === 'descarta' && treatedMessage.length === 4) {
        await this.commandManager.servantDropWeapon(message, treatedMessage[0], (treatedMessage[2] + ' ' + treatedMessage[3] as WeaponType))
      } else if (treatedMessage[1] === 'descarta' && treatedMessage.length === 5) {
        await this.commandManager.servantDropWeapon(message, treatedMessage[0], (treatedMessage[2] + ' ' + treatedMessage[3] + ' ' + treatedMessage[4] as WeaponType))
      } else if (treatedMessage[1] === 'saca' && treatedMessage.length === 3) {
        await this.commandManager.servantDrawWeapon(message, treatedMessage[0], treatedMessage[2] as WeaponType)
      } else if (treatedMessage[1] === 'saca' && treatedMessage.length === 4) {
        await this.commandManager.servantDrawWeapon(message, treatedMessage[0], (treatedMessage[2] + ' ' + treatedMessage[3] as WeaponType))
      } else if (treatedMessage[1] === 'saca' && treatedMessage.length === 5) {
        await this.commandManager.servantDrawWeapon(message, treatedMessage[0], (treatedMessage[2] + ' ' + treatedMessage[3] + ' ' + treatedMessage[4] as WeaponType))
      } else if (treatedMessage[1] === 'testa' && treatedMessage.length === 3) {
        await this.commandManager.servantTestsAttribute(message, treatedMessage[0], treatedMessage[2] as Attribute)
      } else if (treatedMessage[1] === 'guarda' && treatedMessage.length === 2) {
        await this.commandManager.applyServantGuard(message, treatedMessage[0])
      } else if (treatedMessage[0] === 'bufar' && treatedMessage.length === 3) {
        await this.commandManager.buffServant(message, treatedMessage[1], parseInt(treatedMessage[2]))
      } else if (treatedMessage[0] === 'remover' && treatedMessage[1] === 'buff' && treatedMessage.length === 3) {
        await this.commandManager.removeServantBuff(message, treatedMessage[2])
      } else if (treatedMessage[0] === 'debufar' && treatedMessage.length === 3) {
        await this.commandManager.debuffServant(message, treatedMessage[1], parseInt(treatedMessage[2]))
      } else if (treatedMessage[0] === 'remover' && treatedMessage[1] === 'debuff' && treatedMessage.length === 3) {
        await this.commandManager.removeServantDebuff(message, treatedMessage[2])
      } else if ((treatedMessage[1] === 'acerta' || treatedMessage[1] === 'lança' || treatedMessage[1] === 'atira') && treatedMessage.length === 3) {
        await this.commandManager.servantAttackServant(message, treatedMessage[0], treatedMessage[1], treatedMessage[2])
      } else if (treatedMessage[1] === 'sofre' && treatedMessage.length === 3) {
        await this.commandManager.servantTakesDamage(message, treatedMessage[0], parseInt(treatedMessage[2]))
      } else if (treatedMessage[0] === 'curar' && treatedMessage.length === 2) {
        await this.commandManager.healServant(message, treatedMessage[1])
      } else if (treatedMessage[1] === 'melhora' && (treatedMessage[2] === 'agilidade' || treatedMessage[2] === 'tecnica' || treatedMessage[2] === 'força' || treatedMessage[2] === 'fortitude' || treatedMessage[2] === 'haste' || treatedMessage[2] === 'arco' || treatedMessage[2] === 'besta') && treatedMessage.length === 4) {
        await this.commandManager.upgradeServant(message, treatedMessage[0], treatedMessage[2], parseInt(treatedMessage[3]))
      } else if (treatedMessage[0] === 'criar' && treatedMessage[1] === 'servo' && treatedMessage.length === 3) {
        await this.commandManager.createCustomServant(message, treatedMessage[2])
      } else if (treatedMessage[0] === 'criar' && treatedMessage[1] === 'servo' && treatedMessage.length === 7) {
        await this.commandManager.createCustomServant(message, treatedMessage[2], parseInt(treatedMessage[3]), parseInt(treatedMessage[4]), parseInt(treatedMessage[5]), parseInt(treatedMessage[6]))
      } else if (treatedMessage[1] === 'recebe' && treatedMessage.length === 3) {
        await this.commandManager.servantReceivesDenars(message, treatedMessage[0], parseInt(treatedMessage[2]))
      } else if (treatedMessage[1] === 'paga' && treatedMessage.length === 3) {
        await this.commandManager.servantPaysDenars(message, treatedMessage[0], parseInt(treatedMessage[2]))
      } else {
        await message.reply('Comando inexistente')
      }
    } catch (error) {
      if (error instanceof Error) await message.reply(error.message)
    }
  }

  isACommand (message: string): boolean {
    if (message[0] === '!') return true
    else return false
  }

  treatMessage (rawMessage: string): string[] {
    const messageWithoutExclamation = rawMessage.slice(1, rawMessage.length)
    return messageWithoutExclamation.split(' ')
  }
}

export default MessageHandler
