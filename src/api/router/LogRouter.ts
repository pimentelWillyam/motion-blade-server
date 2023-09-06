// importando core da rota
import * as express from 'express'
import { type Router, type Request, type Response } from 'express'

// importando service da rota
import type ILogController from '../interface/ILogController'
import type ILogRouter from '../interface/ILogRouter'

// criando rotas

class LogRouter implements ILogRouter {
  readonly routes: Router
  constructor (readonly logController: ILogController) {
    this.routes = express.Router()
    this.routes.post('/log', (req: Request, res: Response) => {
      void logController.create(req, res)
    })
    this.routes.get('/log', (req: Request, res: Response) => {
      void logController.getAll(res)
    })
    this.routes.get('/log/:id', (req: Request, res: Response) => {
      void logController.get(req, res)
    })
  }
}

export default LogRouter
