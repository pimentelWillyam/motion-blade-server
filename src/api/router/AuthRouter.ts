// importando core da rota
import * as express from 'express'
import { type Router, type Request, type Response } from 'express'
import type AuthController from '../controller/AuthController'

// importando service da rota

// criando rotas

class AuthRouter {
  readonly routes: Router
  constructor (readonly authController: AuthController) {
    this.routes = express.Router()
    this.routes.post('/auth', (req: Request, res: Response) => {
      console.log('aaa')
      void authController.validate(req, res)
    })
  }
}

export default AuthRouter
