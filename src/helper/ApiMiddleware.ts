import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import type IApiMiddleware from '../api/interface/IApiMiddleware'

bodyParser.json()

class ApiMiddleware implements IApiMiddleware {
  constructor () {}
}

export default ApiMiddleware
