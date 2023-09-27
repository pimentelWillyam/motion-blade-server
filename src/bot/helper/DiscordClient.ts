
import { type Client, Events, type Message } from 'discord.js'
import type MessageHandler from '../handler/MessageHandler'

class DiscordClient {
  constructor (private readonly client: Client, private readonly messageHandler: MessageHandler) {}

  start (): void {
    console.log('Logging in...')
    void this.client.login(process.env.token)
    this.client.on('ready', (c) => {
      console.log(`✅ ${c.user.tag} is online.`)
    })
    this.listenToMessages()
  }

  listenToMessages (): void {
    console.log('Listening to messages...')
    this.client.on(Events.MessageCreate, (message: Message) => {
      try {
        void this.messageHandler.handle(message)
      } catch (error) {
        if (error instanceof Error) {
          console.error(error)
          void message.reply(error.message)
        } else {
          console.error(error)
          void message.reply('Aconteceu um erro inesperado')
        }
      }
    })
  }
}

export default DiscordClient
