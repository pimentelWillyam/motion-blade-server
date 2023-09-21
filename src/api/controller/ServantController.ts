import { type Request, type Response } from 'express'

import type ServantValidator from '../validator/ServantValidator'
import type ServantService from '../service/ServantService'

enum ServantError {
  SERVANT_INVALID_REQUEST = 'A requisição inserida foi considerada inválida',
  SERVANT_LIST_ERROR = 'Houve um erro quando tentamos buscar a lista',
  SERVANT_NOT_FOUND = 'Não foi possível encontrar este usuário',
  SERVANT_NOT_UPDATED = 'Não foi possível atualizar este usuário',
  SERVANT_NOT_DELETED = 'Não foi possível deletar este usuário',
}
class ServantController {
  constructor (readonly servantService: ServantService, readonly servantValidator: ServantValidator) {}

  async create (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      if (this.servantValidator.isServantValid(req.body.message)) {
        const servant = await this.servantService.create(req.body.message)
        return res.status(200).json(servant)
      }
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(ServantError.SERVANT_INVALID_REQUEST)
  }

  async getAll (res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const listaServants = await this.servantService.getAll()
      return res.status(200).json(listaServants)
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(ServantError.SERVANT_INVALID_REQUEST)
  }

  async get (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const servant = await this.servantService.get(req.params.id)
      if (servant != null) {
        return res.status(200).json(servant)
      } else {
        return res.status(404).send(ServantError.SERVANT_NOT_FOUND)
      }
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(ServantError.SERVANT_INVALID_REQUEST)
  }
}

export default ServantController