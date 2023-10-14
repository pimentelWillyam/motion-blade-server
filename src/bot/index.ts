// importing dotenv and environment variables
import * as dotenv from 'dotenv-safe'

// importing the uuid generator
import UuidGenerator from './helper/UuidGenerator'
// importing the random number generator
import RandomNumberGenerator from './helper/RandomNumberGenerator'

// importing sleeper
import Sleeper from './helper/Sleeper'

// importing servant manager
import ServantManager from './helper/ServantManager'

// importing command manager
import CommandManager from './helper/CommandManager'

// importing message handler
import MessageHandler from './handler/MessageHandler'

import DiscordBot from './DiscordBot'

dotenv.config()

// instanciating uuid generator
const uuidGenerator = new UuidGenerator()
// instanciating the random number generator
const randomNumberGenerator = new RandomNumberGenerator()

// instanciating the servant manager
const servantManager = new ServantManager(uuidGenerator)

// instanciating the command manager
const commandManager = new CommandManager(randomNumberGenerator, servantManager, new Sleeper())
// instanciating message handler
const messageHandler = new MessageHandler(commandManager)

// instanciating discord manipulation class
const discordBot = new DiscordBot(messageHandler)

// starting bot
discordBot.client.start()
discordBot.client.listenToMessages()
