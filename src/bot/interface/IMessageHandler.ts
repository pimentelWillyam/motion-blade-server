import type { Message } from 'discord.js'

interface IMessageHandler {
  handle: (message: Message) => void
  isACommand: (messageContent: string) => boolean
}

export default IMessageHandler
