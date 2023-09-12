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
import ApiMiddleware from './helper/ApiMiddleware'
import DateManager from './helper/DateManager'

// importing data classes
import MariadbDataSource from './data/MariadbDataSource'
// importing routers
import LogRouter from './api/router/LogRouter'

// importing controllers
import LogController from './api/controller/LogController'

// importing validators
import LogValidator from './api/validator/LogValidator'

// importing services
import LogService from './api/service/LogService'

// importing repositories
import LogRepository from './api/repository/LogRepository'

// importing entities
// import FileEntity from './api/entity/FileEntity'
// import LogEntity from './api/entity/LogEntity'
// import UserEntity from './api/entity/UserEntity'

// importing app
import App from './api/App'
import DatabaseHelper from './helper/DatabaseHelper'
import ServantController from './bot/controllers/ServantController'
import MemoryDataSource from './data/memory/MemoryDataSource'
import WeaponFetcher from './bot/fetchers/WeaponFetcher'
import Axe from './bot/model/weapons/Axe'
import BareHand from './bot/model/weapons/BareHand'
import BastardSword from './bot/model/weapons/BastardSword'
import BattleAxe from './bot/model/weapons/BattleAxe'
import Bow from './bot/model/weapons/Bow'
import Crossbow from './bot/model/weapons/Crossbow'
import Dagger from './bot/model/weapons/Dagger'
import Hammer from './bot/model/weapons/Hammer'
import Mace from './bot/model/weapons/Mace'
import Spear from './bot/model/weapons/Spear'
import Staff from './bot/model/weapons/Staff'
import Sword from './bot/model/weapons/Sword'
import AttributesFetcher from './bot/fetchers/AttributesFetcher'
import ArmorFetcher from './bot/fetchers/ArmorFetcher'
import Cloth from './bot/model/armors/Cloth'
import Leather from './bot/model/armors/Leather'
import Chainmail from './bot/model/armors/Chainmail'
import Plate from './bot/model/armors/Plate'
import Pleather from './bot/model/armors/Pleather'

// instanciating discord bot related classes

// instanciating uuid generator
const uuidGenerator = new UuidGenerator()
// instanciating the random number generator
const randomNumberGenerator = new RandomNumberGenerator()

// instanciating weapon fetcher
const weaponFetcher = new WeaponFetcher(new Axe(), new BareHand(), new BastardSword(), new BattleAxe(), new Bow(), new Crossbow(), new Dagger(), new Hammer(), new Mace(), new Spear(), new Staff(), new Sword())

// instanciating armor fetcher
const armorFetcher = new ArmorFetcher(new Cloth(), new Leather(), new Chainmail(), new Plate(), new Pleather())
// instanciating memory data source
const memoryDataSource = new MemoryDataSource(uuidGenerator, weaponFetcher, new AttributesFetcher(), armorFetcher)

// instanciating the servant controller
const servantController = new ServantController(memoryDataSource)

// instanciating the command manager
const commandManager = new CommandManager(randomNumberGenerator, memoryDataSource, new Sleeper(), servantController)
// instanciating message handler
const messageHandler = new MessageHandler(commandManager)

// instanciating discord manipulation class
const discordBot = new DiscordBot(messageHandler)

// instanciating api related classes

// instanciating helpers
const dateManager = new DateManager()
const server = new Server()
const apiMiddleware = new ApiMiddleware()

// instanciating data classes
const databaseHelper = new DatabaseHelper()
const mariadbDataSource = new MariadbDataSource(databaseHelper)
// const oracledbDataSource = new OracledbDataSource()

// instanciating repositories
// using repositories with mariadb
const logRepository = new LogRepository(mariadbDataSource, uuidGenerator, dateManager)

// instanciating services
const logService = new LogService(logRepository, uuidGenerator, dateManager)

// instanciating validators
const logValidator = new LogValidator()

// instanciating controllers
const logController = new LogController(logService, logValidator)

// instanciating routers
const logRouter = new LogRouter(logController)

// instanciating app related classes
const api = new Api(express(), apiMiddleware, logRouter)
const app = new App(api, server)

// getting .env configuration
dotenv.config()

// starting database and app
void mariadbDataSource.openConnectionPool()
app.start()

discordBot.client.start()
