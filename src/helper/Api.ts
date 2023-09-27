import type IApiMiddleware from '../api/interface/IApiMiddleware'
import { type Express } from 'express'

import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import { json } from 'express'
import type ServantRouter from '../api/router/ServantRouter'
import type LogRouter from '../api/router/LogRouter'

class Api {
  constructor (readonly server: Express, readonly apiMiddleware: IApiMiddleware, readonly logRouter: LogRouter, readonly servantRouter: ServantRouter) {
    this.server.use(bodyParser.json())
    this.server.use(json())
    this.server.use(cors())
    // this.server.use('/api', logRouter.routes)
    this.server.use('/api', servantRouter.routes)
  }
}

export default Api
