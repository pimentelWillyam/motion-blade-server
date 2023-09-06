import type IApiMiddleware from '../api/interface/IApiMiddleware'
import { type Express } from 'express'
import type ILogRouter from '../api/interface/ILogRouter'

import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import { json } from 'express'

class Api {
  constructor (readonly server: Express, readonly apiMiddleware: IApiMiddleware, readonly logRouter: ILogRouter) {
    this.server.use(bodyParser.json())
    this.server.use(json())
    this.server.use(cors())
    this.server.use('/api', logRouter.routes)
  }
}

export default Api
