// importing Bot related classes

// importing the uuid generator
import UuidGenerator from './bot/helper/UuidGenerator'
// importing the random number generator
import RandomNumberGenerator from './bot/helper/RandomNumberGenerator'

// importing sleeper
import Sleeper from './helper/Sleeper'

// importing servant manager

// importing command manager
import CommandManager from './bot/helper/CommandManager'

// importing message handler
import MessageHandler from './bot/handler/MessageHandler'

import DiscordBot from './bot/DiscordBot'

// importing API related classes

// importing external libraries
import { Server } from 'http'
import * as dotenv from 'dotenv-safe'
import * as express from 'express'

// importing helpers
import Api from './helper/Api'

// importing data classes
import MariadbDataSource from './data/MariadbDataSource'
// importing routers

// importing controllers
import ServantController from './api/controller/ServantController'

// importing validators

// importing services
import ServantService from './service/ServantService'

// importing repositories

// importing app
import App from './api/App'
import ServantRouter from './api/router/ServantRouter'
import ServantValidator from './api/validator/ServantValidator'
import ServantRepository from './repository/ServantRepository'
import AttributesFetcher from './bot/fetchers/AttributesFetcher'
import { WeaponFactory } from './factories/WeaponFactory'
import { ArmorFactory } from './factories/ArmorFactory'
import { ServantFactory } from './factories/ServantFactory'

// instanciating uuid generator
const uuidGenerator = new UuidGenerator()
// instanciating the random number generator
const randomNumberGenerator = new RandomNumberGenerator()

// instanciating mariadb data source
const mariadbDataSource = new MariadbDataSource()

// instanciating attribute fetcher
const attributesFetcher = new AttributesFetcher()

// instanciating factories
const armorFactory = new ArmorFactory()
const weaponFactory = new WeaponFactory()
const servantFactory = new ServantFactory(uuidGenerator, armorFactory, weaponFactory)

// instanciating repository
const servantRepository = new ServantRepository(mariadbDataSource)

// instanciating service

const servantService = new ServantService(servantRepository, attributesFetcher, servantFactory, armorFactory, weaponFactory)

// instanciating validators
const servantValidator = new ServantValidator()

// instanciating the servant controller
const servantController = new ServantController(servantService, servantValidator)

// instanciating the command manager
const commandManager = new CommandManager(randomNumberGenerator, new Sleeper(), servantService)
// instanciating message handler
const messageHandler = new MessageHandler(commandManager)

// instanciating discord manipulation class
const discordBot = new DiscordBot(messageHandler)

// instanciating helpers
const server = new Server()

// instanciating router

const servantRouter = new ServantRouter(servantController)

// instanciating app related classes
const api = new Api(express(), servantRouter)
const app = new App(api, server)

// getting .env configuration
dotenv.config()

// starting database and app
void mariadbDataSource.startConnection()
void mariadbDataSource.bootstrap()

app.start()

discordBot.client.start()
