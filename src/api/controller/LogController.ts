// import { type Request, type Response } from 'express'

import type LogService from '../service/LogService'
import type LogValidator from '../validator/LogValidator'

enum LogError {
  LOG_INVALID_REQUEST = 'A requisição inserida foi considerada inválida',
  LOG_LIST_ERROR = 'Houve um erro quando tentamos buscar a lista',
  LOG_NOT_FOUND = 'Não foi possível encontrar este usuário',
  LOG_NOT_UPDATED = 'Não foi possível atualizar este usuário',
  LOG_NOT_DELETED = 'Não foi possível deletar este usuário',
}
class LogController implements ILogController {
  constructor (readonly logService: ILogService, readonly logValidator: ILogValidator) {}

  async create (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      if (this.logValidator.isLogValid(req.body.message)) {
        const log = await this.logService.create(req.body.message)
        return res.status(200).json(log)
      }
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(LogError.LOG_INVALID_REQUEST)
  }

  async getAll (res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const listaLogs = await this.logService.getAll()
      return res.status(200).json(listaLogs)
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(LogError.LOG_INVALID_REQUEST)
  }

  async get (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const log = await this.logService.get(req.params.id)
      if (log != null) {
        return res.status(200).json(log)
      } else {
        return res.status(404).send(LogError.LOG_NOT_FOUND)
      }
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(LogError.LOG_INVALID_REQUEST)
  }
}

export default LogController
