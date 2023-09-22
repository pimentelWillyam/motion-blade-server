import { type Express } from 'express'

import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import { json } from 'express'
import type ServantRouter from '../api/router/ServantRouter'

class Api {
  constructor (readonly server: Express, readonly servantRouter: ServantRouter) {
    this.server.use(bodyParser.json())
    this.server.use(json())
    this.server.use(cors())
    this.server.use('/api', servantRouter.routes)
  }
}

export default Api
