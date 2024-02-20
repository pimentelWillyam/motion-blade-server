import { type Express } from 'express'

import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import { json } from 'express'
import type ServantRouter from '../api/router/ServantRouter'
import type BattleRouter from '../api/router/BattleRouter'

class Api {
  constructor (readonly server: Express, readonly servantRouter: ServantRouter, readonly battleRouter: BattleRouter) {
    this.server.use(bodyParser.json())
    this.server.use(json())
    this.server.use(cors())
    this.server.use('/api', servantRouter.routes)
    this.server.use('/api', battleRouter.routes)
  }
}

export default Api
