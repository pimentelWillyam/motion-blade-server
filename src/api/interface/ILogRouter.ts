import type { Router } from 'express'

import type ILogController from './ILogController'

interface ILogRouter {
  readonly logController: ILogController
  readonly routes: Router
}

export default ILogRouter
