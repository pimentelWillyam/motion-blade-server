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
// import MariadbDataSource from './data/MariadbDataSource'
// import MariadbDataSource2 from './data/MariadbDataSource2'
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
import ServantUpgrader from './bot/helper/ServantUpgradeCalculator'
import CombatManager from './helper/CombatManager'
import BattleService from './service/BattleService'
import BattleRepository from './repository/BattleRepository'
import { BattleFactory } from './factories/BattleFactory'
import { PostgresDataSource } from './data/PostgresDataSource'
import { Client } from 'pg'
import BattleRouter from './api/router/BattleRouter'
import MasterRouter from './api/router/MasterRouter'

import BattleController from './api/controller/BattleController'
import BattleValidator from './api/validator/BattleValidator'
import { ServantSorter } from './bot/helper/ServantSorter'
import MasterController from './api/controller/MasterController'
import MasterRepository from './repository/MasterRepository'
import MasterService from './service/MasterService'
import { MasterFactory } from './factories/MasterFactory'
import MasterValidator from './api/validator/MasterValidator'

import UserRouter from './api/router/UserRouter'
import UserController from './api/controller/UserController'
import UserService from './service/UserService'
import UserRepository from './repository/UserRepository'
import UserValidator from './api/validator/UserValidator'
import { UserFactory } from './factories/UserFactory'

// instanciating uuid generator
const uuidGenerator = new UuidGenerator()

// instanciating random number generator
const randomNumberGenerator = new RandomNumberGenerator()
// instanciating the random number generator

// instanciating mariadb data source
// const mariadbDataSource = new MariadbDataSource()
// const mariadbDataSource2 = new MariadbDataSource2()
const postgresDataSource = new PostgresDataSource(Client)

// instanciating attribute fetcher
const attributesFetcher = new AttributesFetcher()

// instanciating damage to deal generator

// instanciating factories
const armorFactory = new ArmorFactory()
const weaponFactory = new WeaponFactory()
const servantFactory = new ServantFactory(randomNumberGenerator, uuidGenerator, armorFactory, weaponFactory)
const battleFactory = new BattleFactory(new ServantSorter(), randomNumberGenerator, uuidGenerator)
const masterFactory = new MasterFactory(uuidGenerator)
const userFactory = new UserFactory(uuidGenerator)

// instanciating repository
const servantRepository = new ServantRepository(postgresDataSource)
const battleRepository = new BattleRepository(postgresDataSource)
const masterRepository = new MasterRepository(postgresDataSource)
const userRepository = new UserRepository(postgresDataSource)

// instanciating services

const servantService = new ServantService(servantRepository, attributesFetcher, servantFactory, armorFactory, weaponFactory)
const battleService = new BattleService(battleRepository, battleFactory)
const masterService = new MasterService(masterRepository, masterFactory)
const userService = new UserService(userRepository, userFactory)

// instanciating validators
const servantValidator = new ServantValidator()
const battleValidator = new BattleValidator()
const masterValidator = new MasterValidator()
const userValidator = new UserValidator()

// instanciating the servant controller
const servantController = new ServantController(servantService, servantValidator)
const battleController = new BattleController(battleService, battleValidator)
const masterController = new MasterController(masterService, masterValidator)
const userController = new UserController(userService, userValidator)

// instanciating the command manager
const commandManager = new CommandManager(new ServantSorter(), randomNumberGenerator, new Sleeper(), servantService, battleService, new ServantUpgrader(randomNumberGenerator), new CombatManager(servantService, new ServantUpgrader(randomNumberGenerator), randomNumberGenerator))
// instanciating message handler
const messageHandler = new MessageHandler(commandManager)

// instanciating discord manipulation class
const discordBot = new DiscordBot(messageHandler)

// instanciating helpers
const server = new Server()

// instanciating router

const servantRouter = new ServantRouter(servantController)
const battleRouter = new BattleRouter(battleController)
const masterRouter = new MasterRouter(masterController)
const userRouter = new UserRouter(userController)

// instanciating app related classes
const api = new Api(express(), servantRouter, battleRouter, masterRouter, userRouter)
const app = new App(api, server)

// getting .env configuration
dotenv.config()

// starting database and app
void postgresDataSource.bootstrap()
app.start()
discordBot.client.start()
