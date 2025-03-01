// importando core da rota
import * as express from 'express'
import { type Router, type Request, type Response } from 'express'
import type BattleController from '../controller/BattleController'

// importando service da rota

// criando rotas

class BattleRouter {
  readonly routes: Router
  constructor (readonly battleController: BattleController) {
    this.routes = express.Router()
    this.routes.post('/battle', (req: Request, res: Response) => {
      void battleController.create(req, res)
    })
    this.routes.get('/battle', (req: Request, res: Response) => {
      void battleController.getAll(res)
    })
    this.routes.get('/battle/:name', (req: Request, res: Response) => {
      void battleController.get(req, res)
    })
    this.routes.patch('/battle/:name', (req: Request, res: Response) => {
      void battleController.update(req, res)
    })
    this.routes.delete('/battle/:name', (req: Request, res: Response) => {
      void battleController.delete(req, res)
    })
  }
}

export default BattleRouter
