import { type Request, type Response } from 'express'

import type ServantValidator from '../validator/ServantValidator'
import type ServantService from '../../service/ServantService'

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
      if (this.servantValidator.isServantValid('need to test better')) {
        if (req.body.agility === undefined || req.body.technique === undefined || req.body.strength === undefined || req.body.fortitude === undefined) {
          const servant = await this.servantService.create(req.body.masterId, req.body.name, req.body.fatherProfession, req.body.youthProfession, false)
          return res.status(200).json(servant)
        }
        const servant = await this.servantService.create(req.body.masterId, req.body.name, 'soldado', 'soldado', true, { agility: req.body.agility, technique: req.body.technique, strength: req.body.strength, fortitude: req.body.fortitude })
        return res.status(200).json(servant)
      }
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(ServantError.SERVANT_INVALID_REQUEST)
  }

  async getAll (res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const servantList = await this.servantService.getAll()
      return res.status(200).json(servantList)
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(ServantError.SERVANT_INVALID_REQUEST)
  }

  async getAllByUser (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const servantList = await this.servantService.getAllByUser(req.params.login)
      return res.status(200).json(servantList)
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(ServantError.SERVANT_INVALID_REQUEST)
  }

  async get (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const servant = await this.servantService.get(req.params.name)
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

  async update (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      if (this.servantValidator.isServantValid('need to test better')) {
        const servant = await this.servantService.get(req.params.name)
        if (servant === null) throw new Error(ServantError.SERVANT_NOT_FOUND)
        if (req.body.agility !== undefined) servant.currentAttributes.agility = req.body.agility; servant.maximumAttributes.agility = req.body.agility
        if (req.body.technique !== undefined) servant.currentAttributes.technique = req.body.technique; servant.maximumAttributes.technique = req.body.technique
        if (req.body.strength !== undefined) servant.currentAttributes.strength = req.body.strength; servant.maximumAttributes.strength = req.body.strength
        if (req.body.fortitude !== undefined) servant.currentAttributes.fortitude = req.body.fortitude; servant.maximumAttributes.fortitude = req.body.fortitude
        const updatedServant = await this.servantService.update(req.params.name, servant)
        if (servant != null) {
          return res.status(200).json(updatedServant)
        } else {
          return res.status(404).send(ServantError.SERVANT_NOT_UPDATED)
        }
      }
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(ServantError.SERVANT_INVALID_REQUEST)
  }

  async delete (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const servant = await this.servantService.delete(req.params.name)
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
