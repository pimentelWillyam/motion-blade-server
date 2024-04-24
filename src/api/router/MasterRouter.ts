// importando core da rota
import * as express from 'express'
import { type Router, type Request, type Response } from 'express'
import type MasterController from '../controller/MasterController'

// importando service da rota

// criando rotas

class MasterRouter {
  readonly routes: Router
  constructor (readonly masterController: MasterController) {
    this.routes = express.Router()
    this.routes.post('/master', (req: Request, res: Response) => {
      void masterController.create(req, res)
    })
    this.routes.get('/master', (req: Request, res: Response) => {
      void masterController.getAll(res)
    })
    this.routes.get('/master/:name', (req: Request, res: Response) => {
      void masterController.get(req, res)
    })
    this.routes.delete('/master/:name', (req: Request, res: Response) => {
      void masterController.delete(req, res)
    })
  }
}

export default MasterRouter
