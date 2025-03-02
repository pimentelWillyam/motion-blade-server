import { type Request, type Response } from 'express'

import type UserService from '../../service/UserService'
import type TokenManager from '../../helper/TokenManager'

enum AuthError {
  AUTH_INVALID_REQUEST = 'A requisição inserida foi considerada inválida',
  AUTH_INVALID_TOKEN = 'Token de autenticação inválido',
  AUTH_LIST_ERROR = 'Houve um erro quando tentamos buscar a lista',
  USER_NOT_FOUND = 'Não foi possível encontrar este usuário',
  AUTH_NOT_UPDATED = 'Não foi possível atualizar este usuário',
  AUTH_NOT_DELETED = 'Não foi possível deletar este usuário',
}
class AuthController {
  constructor (readonly userService: UserService, readonly tokenManager: TokenManager) {}

  async validate (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      if (req.body.login === undefined || req.body.password === undefined) throw new Error(AuthError.AUTH_INVALID_REQUEST)
      console.log(req.body.login)
      const user = await this.userService.get(req.body.login)
      if (user === null) throw new Error(AuthError.USER_NOT_FOUND)
      if (req.body.password === user.password) {
        return res.status(200).json({
          login: user.login,
          token: this.tokenManager.generate(user.login)

        })
      }
    } catch (erro) {
      console.error(erro)
      return res.status(400).send(AuthError.AUTH_INVALID_REQUEST)
    }
    return res.status(400).send(AuthError.AUTH_INVALID_REQUEST)
  }

  async authenticate (req: Request, res: Response, next: (req: Request, res: Response) => void): Promise<void> {
    let token = req.headers.authorization
    if (token === null || token === undefined) throw new Error(AuthError.AUTH_INVALID_TOKEN)
    try {
      token = token.substring(7, token.length)
      this.tokenManager.isValid(token)
      next(req, res)
    } catch (erro) {
      res.status(401).send({ message: AuthError.AUTH_INVALID_TOKEN })
    }
  }
}
export default AuthController
