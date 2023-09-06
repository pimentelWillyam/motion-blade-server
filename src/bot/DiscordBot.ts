// importing discord library
import { Client, IntentsBitField, Partials } from 'discord.js'

// importing discord client
import DiscordClient from './helper/DiscordClient'
import type IMessageHandler from './interface/IMessageHandler'

class DiscordBot {
  client: DiscordClient

  constructor (private readonly messageHandler: IMessageHandler) {
    this.client = new DiscordClient(new Client(
      {
        intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.DirectMessages],
        partials: [Partials.Channel]
      }), messageHandler)
  }
}

export default DiscordBot
