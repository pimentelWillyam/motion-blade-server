// importando core da rota
import * as express from 'express'
import { type Router, type Request, type Response } from 'express'
import type UserController from '../controller/UserController'

// importando service da rota

// criando rotas

class UserRouter {
  readonly routes: Router
  constructor (readonly userController: UserController) {
    this.routes = express.Router()
    this.routes.post('/user', (req: Request, res: Response) => {
      void userController.create(req, res)
    })
    this.routes.get('/user', (req: Request, res: Response) => {
      void userController.getAll(res)
    })
    this.routes.get('/user/:login', (req: Request, res: Response) => {
      void userController.get(req, res)
    })

    this.routes.patch('/user/:login', (req: Request, res: Response) => {
      void userController.update(req, res)
    })

    this.routes.delete('/user/:login', (req: Request, res: Response) => {
      void userController.delete(req, res)
    })
  }
}

export default UserRouter
