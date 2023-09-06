import type IMessageHandler from '../interface/IMessageHandler'

import type IDiscordClient from '../interface/IDiscordClient'

import { type Client, Events, type Message } from 'discord.js'

class DiscordClient implements IDiscordClient {
  constructor (private readonly client: Client, private readonly messageHandler: IMessageHandler) {}

  start (): void {
    console.log('Logging in...')
    this.client.login(process.env.token)
    this.client.on('ready', (c) => {
      console.log(`✅ ${c.user.tag} is online.`)
    })
    this.listenToMessages()
  }

  listenToMessages (): void {
    console.log('Listening to messages...')
    this.client.on(Events.MessageCreate, (message: Message) => {
      try {
        this.messageHandler.handle(message)
      } catch (error) {
        if (error instanceof Error) {
          console.error(error)
          message.reply(error.message)
        } else {
          console.error(error)
          message.reply('Aconteceu um erro inesperado')
        }
      }
    })
  }
}

export default DiscordClient
