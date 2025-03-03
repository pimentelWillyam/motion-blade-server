// importando core da rota
import * as express from 'express'
import { type Router, type Request, type Response } from 'express'
import type ServantController from '../controller/ServantController'

// importando service da rota

// criando rotas

class ServantRouter {
  readonly routes: Router
  constructor (readonly servantController: ServantController) {
    this.routes = express.Router()
    this.routes.post('/servant', (req: Request, res: Response) => {
      void servantController.create(req, res)
    })
    this.routes.get('/servant', (req: Request, res: Response) => {
      void servantController.getAll(res)
    })
    this.routes.get('/servants/:login', (req: Request, res: Response) => {
      void servantController.getAllByUser(req, res)
    })
    this.routes.get('/servant/:name', (req: Request, res: Response) => {
      void servantController.get(req, res)
    })
    this.routes.patch('/servant/:name', (req: Request, res: Response) => {
      void servantController.update(req, res)
    })
    this.routes.delete('/servant/:name', (req: Request, res: Response) => {
      void servantController.delete(req, res)
    })
  }
}

export default ServantRouter
