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
import DateManager from './helper/DateManager'

// importing data classes
// import MariadbDataSource from './data/MariadbDataSource'
// importing routers

// importing controllers
import ServantController from './api/controller/ServantController'

// importing validators

// importing services
import ServantService from './service/ServantService'

// importing repositories

// importing entities
// import FileEntity from './api/entity/FileEntity'
// import LogEntity from './api/entity/LogEntity'
// import UserEntity from './api/entity/UserEntity'

// importing app
import App from './api/App'
import MemoryDataSource from './data/MemoryDataSource'
import ServantRouter from './api/router/ServantRouter'
import ServantValidator from './api/validator/ServantValidator'
import ServantRepository from './repository/ServantRepository'
import AttributesFetcher from './bot/fetchers/AttributesFetcher'
import { WeaponFactory } from './factories/WeaponFactory'
import { ArmorFactory } from './factories/ArmorFactory'

// instanciating uuid generator
const uuidGenerator = new UuidGenerator()
// instanciating the random number generator
const randomNumberGenerator = new RandomNumberGenerator()

// instanciating memory data source
const memoryDataSource = new MemoryDataSource(uuidGenerator)

// instanciating attribute fetcher
const attributesFetcher = new AttributesFetcher()

// instanciating factories
const armorFactory = new ArmorFactory()
const weaponFactory = new WeaponFactory()

// instanciating repository
const servantRepository = new ServantRepository(memoryDataSource)

// instanciating service

const servantService = new ServantService(servantRepository, attributesFetcher, armorFactory, weaponFactory)

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
// const apiMiddleware = new ApiMiddleware()

// instanciating data classes
// const databaseHelper = new DatabaseHelper()
// const mariadbDataSource = new MariadbDataSource(databaseHelper)
// const oracledbDataSource = new OracledbDataSource()

// instanciating repositories
// using repositories with mariadb
// const servantRepository = new ServantRepository(memoryDataSource)

// instanciating services

// instanciating controllers

// instanciating routers
const servantRouter = new ServantRouter(servantController)

// instanciating app related classes
const api = new Api(express(), servantRouter)
const app = new App(api, server)

// getting .env configuration
dotenv.config()

// starting database and app
// void mariadbDataSource.openConnectionPool()
app.start()

discordBot.client.start()
