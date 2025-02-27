import { type Express } from 'express'

import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import { json } from 'express'
import type ServantRouter from '../api/router/ServantRouter'
import type BattleRouter from '../api/router/BattleRouter'
import type MasterRouter from '../api/router/MasterRouter'
import type UserRouter from '../api/router/UserRouter'

class Api {
  constructor (readonly server: Express, readonly servantRouter: ServantRouter, readonly battleRouter: BattleRouter, readonly masterRouter: MasterRouter, readonly userRouter: UserRouter) {
    this.server.use(bodyParser.json())
    this.server.use(json())
    this.server.use(cors())
    this.server.use('/api', servantRouter.routes)
    this.server.use('/api', battleRouter.routes)
    this.server.use('/api', masterRouter.routes)
    this.server.use('/api', userRouter.routes)
  }
}

export default Api
