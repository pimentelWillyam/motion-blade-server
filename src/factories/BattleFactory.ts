import { type Servant } from './ServantFactory'
import type RandomNumberGenerator from '../bot/helper/RandomNumberGenerator'
import type TurnInfo from '../bot/type/TurnInfo'
import type UuidGenerator from '../bot/helper/UuidGenerator'

interface BattleDTO {
  id: string
  name: string
  participantsList: Servant[]
  map: string[][]
  turnInfo: TurnInfo
}
class Battle {
  id: string
  name: string
  participantsList: Servant[]
  map: string[][]
  turnInfo: TurnInfo

  constructor (private readonly randomNumberGenerator: RandomNumberGenerator, id: string, name: string, participantsList: Servant[], map: string[][]) {
    this.id = id
    this.name = name
    this.participantsList = participantsList
    this.map = map
    this.turnInfo = { servantAboutToPlay: undefined, servantsYetToPlay: [] }
  }

  insertServant (servant: Servant): Servant {
    if (servant.battleInfo.isInBattle) throw new Error(`O servo ${servant.name} já está inserido em uma batalha`)
    if (this.participantsList.length >= 10) throw new Error('Não é possível inserir mais que 10 servos em uma única batalha')
    let verticalPosition = this.randomNumberGenerator.generate(0, 7)
    let horizontalPosition = this.randomNumberGenerator.generate(0, 7)
    while (this.map[horizontalPosition][verticalPosition] !== '=') {
      verticalPosition = this.randomNumberGenerator.generate(0, 7)
      horizontalPosition = this.randomNumberGenerator.generate(0, 7)
    }
    this.participantsList.push(servant)

    servant.battleInfo.battleId = this.participantsList.length
    servant.battleInfo.horizontalPosition = horizontalPosition
    servant.battleInfo.verticalPosition = verticalPosition
    servant.battleInfo.isInBattle = true
    servant.battleInfo.battleName = this.name
    this.map[verticalPosition][horizontalPosition] = servant.battleInfo.battleId.toString()
    return servant
  }

  removeServant (servant: Servant): Servant {
    if (servant.battleInfo.battleName !== this.name) throw new Error(`O servo ${servant.name} não pode ser removido pois não está nessa batalha`)
    for (let i = 0; i < this.participantsList.length; i++) {
      if (servant.name === this.participantsList[i].name) {
        this.map[servant.battleInfo.verticalPosition][servant.battleInfo.horizontalPosition] = '='
        this.participantsList.splice(i, 1)
        servant.battleInfo.horizontalPosition = -1
        servant.battleInfo.verticalPosition = -1
        servant.battleInfo.isInBattle = false
        servant.battleInfo.battleId = -1
        return servant
      }
    }
    throw new Error(`O servo ${servant.name} não está inserido nessa batalha`)
  }

  async moveServant (servant: Servant, directionToMove: string): Promise<[Servant, Battle]> {
    if (!servant.battleInfo.isInBattle) throw new Error(`O servo ${servant.name} não está em nenhuma batalha`)
    if (servant.battleInfo.battleName !== this.name) throw new Error(`O servo ${servant.name} não está nessa batalha`)
    switch (directionToMove) {
      case 'e':
        if (servant.battleInfo.horizontalPosition - 1 < 0 || this.map[servant.battleInfo.horizontalPosition - 1][servant.battleInfo.verticalPosition] !== '=') throw new Error(`O servo ${servant.name} não pode se mover para esta posição)`)
        this.map[servant.battleInfo.horizontalPosition - 1][servant.battleInfo.verticalPosition] = servant.battleInfo.battleId.toString()
        break
      case 'd':
        if (servant.battleInfo.horizontalPosition + 1 > 7 || this.map[servant.battleInfo.horizontalPosition + 1][servant.battleInfo.verticalPosition] !== '=') throw new Error(`O servo ${servant.name} não pode se mover para esta posição)`)
        this.map[servant.battleInfo.horizontalPosition + 1][servant.battleInfo.verticalPosition] = servant.battleInfo.battleId.toString()
        break
      case 'c':
        if (servant.battleInfo.verticalPosition - 1 < 0 || this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition - 1] !== '=') throw new Error(`O servo ${servant.name} não pode se mover para esta posição)`)
        this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition - 1] = servant.battleInfo.battleId.toString()
        break
      case 'b':
        if (servant.battleInfo.verticalPosition + 1 > 7 || this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition + 1] !== '=') throw new Error(`O servo ${servant.name} não pode se mover para esta posição)`)
        this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition + 1] = servant.battleInfo.battleId.toString()
        break
      case 'ce':
        if (servant.battleInfo.verticalPosition - 1 < 0 || servant.battleInfo.horizontalPosition - 1 < 0 || this.map[servant.battleInfo.horizontalPosition - 1][servant.battleInfo.verticalPosition - 1] !== '=') throw new Error(`O servo ${servant.name} não pode se mover para esta posição)`)
        this.map[servant.battleInfo.horizontalPosition - 1][servant.battleInfo.verticalPosition - 1] = servant.battleInfo.battleId.toString()
        break
      case 'cd':
        if (servant.battleInfo.verticalPosition - 1 < 0 || servant.battleInfo.horizontalPosition + 1 > 7 || this.map[servant.battleInfo.horizontalPosition + 1][servant.battleInfo.verticalPosition - 1] !== '=') throw new Error(`O servo ${servant.name} não pode se mover para esta posição)`)
        this.map[servant.battleInfo.horizontalPosition + 1][servant.battleInfo.verticalPosition - 1] = servant.battleInfo.battleId.toString()
        break
      case 'be':
        if (servant.battleInfo.verticalPosition - 1 < 0 || servant.battleInfo.horizontalPosition + 1 > 7 || this.map[servant.battleInfo.horizontalPosition + 1][servant.battleInfo.verticalPosition - 1] !== '=') throw new Error(`O servo ${servant.name} não pode se mover para esta posição)`)
        this.map[servant.battleInfo.horizontalPosition + 1][servant.battleInfo.verticalPosition - 1] = servant.battleInfo.battleId.toString()
        break
      case 'bd':
        if (servant.battleInfo.verticalPosition + 1 > 7 || servant.battleInfo.horizontalPosition + 1 > 7 || this.map[servant.battleInfo.horizontalPosition + 1][servant.battleInfo.verticalPosition + 1] !== '=') throw new Error(`O servo ${servant.name} não pode se mover para esta posição)`)
        this.map[servant.battleInfo.horizontalPosition + 1][servant.battleInfo.verticalPosition + 1] = servant.battleInfo.battleId.toString()
        break
      default:
        throw new Error('Direção de movimento inválida')
    }
    return [servant, this]
  }
}

class BattleFactory {
  constructor (readonly randomNumberGenerator: RandomNumberGenerator, readonly uuidGenerator: UuidGenerator) {}
  create (name: string): Battle {
    const battleMap = [
      ['=', '=', '=', '=', '=', '=', '=', '='],
      ['=', '=', '=', '=', '=', '=', '=', '='],
      ['=', '=', '=', '=', '=', '=', '=', '='],
      ['=', '=', '=', '=', '=', '=', '=', '='],
      ['=', '=', '=', '=', '=', '=', '=', '='],
      ['=', '=', '=', '=', '=', '=', '=', '='],
      ['=', '=', '=', '=', '=', '=', '=', '='],
      ['=', '=', '=', '=', '=', '=', '=', '=']
    ]
    return new Battle(this.randomNumberGenerator, this.uuidGenerator.generate(), name, [], battleMap)
  }
}

export { type BattleDTO, Battle, BattleFactory }
