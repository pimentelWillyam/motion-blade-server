import { type Request, type Response } from 'express'

import type UserValidator from '../validator/UserValidator'
import type UserService from '../../service/UserService'

enum UserError {
  USER_INVALID_REQUEST = 'A requisição inserida foi considerada inválida',
  USER_LIST_ERROR = 'Houve um erro quando tentamos buscar a lista',
  USER_NOT_FOUND = 'Não foi possível encontrar este usuário',
  USER_NOT_UPDATED = 'Não foi possível atualizar este usuário',
  USER_NOT_DELETED = 'Não foi possível deletar este usuário',
}
class UserController {
  constructor (readonly userService: UserService, readonly userValidator: UserValidator) {}

  async create (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      if (this.userValidator.isUserValid('need to test better')) {
        if (req.body.login === undefined || req.body.password === undefined) {
          const user = await this.userService.create(req.body.login, req.body.password)
          return res.status(200).json(user)
        }
        const user = await this.userService.create(req.body.login, req.body.password)
        return res.status(200).json(user)
      }
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(UserError.USER_INVALID_REQUEST)
  }

  async getAll (res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const userList = await this.userService.getAll()
      return res.status(200).json(userList)
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(UserError.USER_INVALID_REQUEST)
  }

  async get (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const user = await this.userService.get(req.params.login)
      if (user != null) {
        return res.status(200).json(user)
      } else {
        return res.status(404).send(UserError.USER_NOT_FOUND)
      }
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(UserError.USER_INVALID_REQUEST)
  }

  async update (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      if (this.userValidator.isUserValid('need to test better')) {
        if (req.body.login === undefined || req.body.password === undefined) {
          const user = await this.userService.get(req.params.login)
          if (user == null) throw new Error(UserError.USER_NOT_UPDATED)
          if (req.body.password !== undefined) user.password = req.body.password
          if (req.body.battleList !== undefined) user.battleList = req.body.battleList
          if (req.body.servantList !== undefined) user.servantList = req.body.servantList
          const updatedUser = await this.userService.update(req.params.login, user)
          return res.status(200).json(updatedUser)
        }
      }
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(UserError.USER_INVALID_REQUEST)
  }

  async delete (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const user = await this.userService.delete(req.params.login)
      if (user != null) {
        return res.status(200).json(user)
      } else {
        return res.status(404).send(UserError.USER_NOT_FOUND)
      }
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(UserError.USER_INVALID_REQUEST)
  }
}

export default UserController
