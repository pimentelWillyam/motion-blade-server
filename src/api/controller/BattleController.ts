import { type Request, type Response } from 'express'

import type BattleValidator from '../validator/BattleValidator'
import type BattleService from '../../service/BattleService'

enum BattleError {
  SERVANT_INVALID_REQUEST = 'A requisição inserida foi considerada inválida',
  SERVANT_LIST_ERROR = 'Houve um erro quando tentamos buscar a lista',
  SERVANT_NOT_FOUND = 'Não foi possível encontrar este usuário',
  SERVANT_NOT_UPDATED = 'Não foi possível atualizar este usuário',
  SERVANT_NOT_DELETED = 'Não foi possível deletar este usuário',
}
class BattleController {
  constructor (readonly battleService: BattleService, readonly battleValidator: BattleValidator) {}

  async create (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      if (this.battleValidator.isBattleValid('need to test better')) {
        const battle = await this.battleService.create(req.body.name)
        return res.status(200).json(battle)
      }
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(BattleError.SERVANT_INVALID_REQUEST)
  }

  async getAll (res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const battleList = await this.battleService.getAll()
      return res.status(200).json(battleList)
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(BattleError.SERVANT_INVALID_REQUEST)
  }

  async get (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const battle = await this.battleService.get(req.params.name)
      if (battle != null) {
        return res.status(200).json(battle)
      } else {
        return res.status(404).send(BattleError.SERVANT_NOT_FOUND)
      }
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(BattleError.SERVANT_INVALID_REQUEST)
  }

  async update (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      if (this.battleValidator.isBattleValid('need to test better')) {
        const battle = await this.battleService.get(req.params.name)
        if (battle == null) throw new Error(BattleError.SERVANT_NOT_UPDATED)
        if (req.body.participantsNameList != null) battle.participantsNameList = req.body.participantsNameList
        if (req.body.map != null) battle.map = req.body.map
        if (req.body.turnInfo != null) battle.turnInfo = req.body.turnInfo
        const updatedBattle = await this.battleService.update(req.params.name, battle)
        if (battle != null) {
          return res.status(200).json(updatedBattle)
        } else {
          return res.status(404).send(BattleError.SERVANT_NOT_UPDATED)
        }
      }
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(BattleError.SERVANT_INVALID_REQUEST)
  }

  async delete (req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const battle = await this.battleService.delete(req.params.name)
      if (battle != null) {
        return res.status(200).json(battle)
      } else {
        return res.status(404).send(BattleError.SERVANT_NOT_FOUND)
      }
    } catch (erro) {
      console.error(erro)
    }
    return res.status(400).send(BattleError.SERVANT_INVALID_REQUEST)
  }
}

export default BattleController
