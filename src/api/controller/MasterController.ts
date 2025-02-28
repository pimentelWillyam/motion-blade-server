import { type Request, type Response } from 'express'

import type MasterValidator from '../validator/MasterValidator'
import type MasterService from '../../service/MasterService'

enum MasterError {
  MASTER_INVALID_REQUEST = 'A requisição inserida foi considerada inválida',
  MASTER_LIST_ERROR = 'Houve um erro quando tentamos buscar a lista',
  MASTER_NOT_FOUND = 'Não foi possível encontrar este usuário',
  MASTER_NOT_UPDATED = 'Não foi possível atualizar este usuário',
  MASTER_NOT_DELETED = 'Não foi possível deletar este usuário',
}
class MasterController {
  constructor (readonly masterService: MasterService, readonly masterValidator: MasterValidator) {}

  async create (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      if (this.masterValidator.isMasterValid('need to test better')) {
        const master = await this.masterService.create(req.body.login, req.body.password, req.body.type)
        return res.status(200).json(master)
      }
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(MasterError.MASTER_INVALID_REQUEST)
  }

  async getAll (res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const masterList = await this.masterService.getAll()
      return res.status(200).json(masterList)
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(MasterError.MASTER_INVALID_REQUEST)
  }

  async get (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const master = await this.masterService.get(req.params.name)
      if (master != null) {
        return res.status(200).json(master)
      } else {
        return res.status(404).send(MasterError.MASTER_NOT_FOUND)
      }
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(MasterError.MASTER_INVALID_REQUEST)
  }

  async update (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      if (this.masterValidator.isMasterValid('need to test better')) {
        const master = await this.masterService.get(req.params.login)
        if (master == null) throw new Error(MasterError.MASTER_NOT_UPDATED)
        if (req.body.password !== undefined) master.password = req.body.password
        if (req.body.type !== undefined) master.type = req.body.type
        if (req.body.servantNameList !== undefined) master.servantNameList = req.body.servantNameList
        const updatedMaster = await this.masterService.update(req.params.login, master)
        return res.status(200).json(updatedMaster)
      }
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(MasterError.MASTER_INVALID_REQUEST)
  }

  async delete (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const master = await this.masterService.delete(req.params.name)
      if (master != null) {
        return res.status(200).json(master)
      } else {
        return res.status(404).send(MasterError.MASTER_NOT_FOUND)
      }
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(MasterError.MASTER_INVALID_REQUEST)
  }
}

export default MasterController
