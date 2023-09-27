// importando core da rota
// import * as express from 'express'
// import { type Router, type Request, type Response } from 'express'

// importando service da rota
import type LogController from '../controller/LogController'

// criando rotas

class LogRouter {
  // readonly routes: Router
  constructor (readonly logController: LogController) {
    // this.routes = express.Router()
    // this.routes.post('/log', (req: Request, res: Response) => {
    //   void logController.create(req, res)
    // })
    // this.routes.get('/log', (req: Request, res: Response) => {
    //   void logController.getAll(res)
    // })
    // this.routes.get('/log/:id', (req: Request, res: Response) => {
    //   void logController.get(req, res)
    // })
  }
}

export default LogRouter
