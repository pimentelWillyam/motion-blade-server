import { type Servant } from './ServantFactory'
import type RandomNumberGenerator from '../bot/helper/RandomNumberGenerator'
import type TurnInfo from '../bot/type/TurnInfo'
import type UuidGenerator from '../bot/helper/UuidGenerator'
import { type MovementDirection } from '../bot/type/MovementDirection'
import { type ServantSorter } from '../bot/helper/ServantSorter'

interface BattleDTO {
  id: string
  name: string
  participantsNameList: string[]
  map: string[][]
  turnInfo: TurnInfo
  messagesLog: string[]
}
class Battle {
  id: string
  name: string
  participantsNameList: string[]
  map: string[][]
  turnInfo: TurnInfo
  messagesLog: string[]


  constructor (private readonly servantSorter: ServantSorter, private readonly randomNumberGenerator: RandomNumberGenerator, id: string, name: string, participantsNameList: string[], map: string[][]) {
    this.id = id
    this.name = name
    this.participantsNameList = participantsNameList
    this.map = map
    this.turnInfo = { servantAboutToPlay: undefined, servantsYetToPlay: [] }
    this.messagesLog = []
  }

  insertServant (servant: Servant): Servant {
    if (servant.battleInfo.isInBattle) throw new Error(`O servo ${servant.name} já está inserido em uma batalha`)
    if (this.participantsNameList.length >= 10) throw new Error('Não é possível inserir mais que 10 servos em uma única batalha')
    let verticalPosition = this.randomNumberGenerator.generate(0, 7)
    let horizontalPosition = this.randomNumberGenerator.generate(0, 7)
    while (this.map[horizontalPosition][verticalPosition] !== '=') {
      verticalPosition = this.randomNumberGenerator.generate(0, 7)
      horizontalPosition = this.randomNumberGenerator.generate(0, 7)
    }
    this.participantsNameList.push(servant.name)

    servant.battleInfo.battleId = this.participantsNameList.length
    servant.battleInfo.horizontalPosition = horizontalPosition
    servant.battleInfo.verticalPosition = verticalPosition
    servant.battleInfo.isInBattle = true
    servant.battleInfo.battleName = this.name
    this.map[horizontalPosition][verticalPosition] = servant.battleInfo.battleId.toString()
    return servant
  }

  removeServant (servant: Servant): void {
    if (servant.battleInfo.battleName !== this.name) throw new Error(`O servo ${servant.name} não pode ser removido pois não está nessa batalha`)
    for (let i = 0; i < this.participantsNameList.length; i++) {
      if (servant.name === this.participantsNameList[i]) {
        this.map[servant.battleInfo.verticalPosition][servant.battleInfo.horizontalPosition] = '='
        this.participantsNameList.splice(i, 1)
        return
      }
    }
    throw new Error(`O servo ${servant.name} não está inserido nessa batalha`)
  }

  async moveServant (servant: Servant, movementDirection: MovementDirection): Promise<Servant> {
    if (!servant.battleInfo.isInBattle) throw new Error(`O servo ${servant.name} não está em nenhuma batalha`)
    if (servant.battleInfo.battleName !== this.name) throw new Error(`O servo ${servant.name} não está nessa batalha`)
    if (servant.battlePoints.movementPoints < 1) throw new Error(`O servo ${servant.name} não possui pontos o suficiente para se mover `)
    switch (movementDirection) {
      case 'a':
        if (servant.battleInfo.verticalPosition - 1 < 0 || this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition - 1] !== '=') throw new Error(`O servo ${servant.name} não pode se mover para esta posição)`)
        this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition] = '='
        servant.battleInfo.verticalPosition -= 1
        this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition] = servant.battleInfo.battleId.toString()

        break
      case 'd':

        if (servant.battleInfo.verticalPosition + 1 > 7 || this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition + 1] !== '=') throw new Error(`O servo ${servant.name} não pode se mover para esta posição)`)
        this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition] = '='
        servant.battleInfo.verticalPosition += 1
        this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition] = servant.battleInfo.battleId.toString()
        break
      case 'w':
        if (servant.battleInfo.horizontalPosition - 1 < 0 || this.map[servant.battleInfo.horizontalPosition - 1][servant.battleInfo.verticalPosition] !== '=') throw new Error(`O servo ${servant.name} não pode se mover para esta posição)`)
        this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition] = '='
        servant.battleInfo.horizontalPosition -= 1
        this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition] = servant.battleInfo.battleId.toString()
        //
        break
      case 's':

        if (servant.battleInfo.horizontalPosition + 1 > 7 || this.map[servant.battleInfo.horizontalPosition + 1][servant.battleInfo.verticalPosition] !== '=') throw new Error(`O servo ${servant.name} não pode se mover para esta posição)`)
        this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition] = '='
        servant.battleInfo.horizontalPosition += 1
        this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition] = servant.battleInfo.battleId.toString()

        break
      case 'wa':
        if (servant.battleInfo.verticalPosition - 1 < 0 || servant.battleInfo.horizontalPosition - 1 < 0 || this.map[servant.battleInfo.horizontalPosition - 1][servant.battleInfo.verticalPosition - 1] !== '=') throw new Error(`O servo ${servant.name} não pode se mover para esta posição)`)
        this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition] = '='
        servant.battleInfo.horizontalPosition -= 1
        servant.battleInfo.verticalPosition -= 1
        this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition] = servant.battleInfo.battleId.toString()
        break
      case 'aw':
        if (servant.battleInfo.verticalPosition - 1 < 0 || servant.battleInfo.horizontalPosition - 1 < 0 || this.map[servant.battleInfo.horizontalPosition - 1][servant.battleInfo.verticalPosition - 1] !== '=') throw new Error(`O servo ${servant.name} não pode se mover para esta posição)`)
        this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition] = '='
        servant.battleInfo.horizontalPosition -= 1
        servant.battleInfo.verticalPosition -= 1
        this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition] = servant.battleInfo.battleId.toString()
        break
      case 'wd':
        this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition] = '='
        servant.battleInfo.horizontalPosition -= 1
        servant.battleInfo.verticalPosition += 1
        this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition] = servant.battleInfo.battleId.toString()
        break
      case 'dw':
        if (servant.battleInfo.verticalPosition - 1 < 0 || servant.battleInfo.horizontalPosition + 1 > 7 || this.map[servant.battleInfo.horizontalPosition + 1][servant.battleInfo.verticalPosition - 1] !== '=') throw new Error(`O servo ${servant.name} não pode se mover para esta posição)`)
        this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition] = '='
        servant.battleInfo.horizontalPosition -= 1
        servant.battleInfo.verticalPosition += 1
        this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition] = servant.battleInfo.battleId.toString()
        break
      case 'sa':
        if (servant.battleInfo.verticalPosition - 1 < 0 || servant.battleInfo.horizontalPosition + 1 > 7 || this.map[servant.battleInfo.horizontalPosition + 1][servant.battleInfo.verticalPosition - 1] !== '=') throw new Error(`O servo ${servant.name} não pode se mover para esta posição)`)
        this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition] = '='
        servant.battleInfo.horizontalPosition += 1
        servant.battleInfo.verticalPosition -= 1
        this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition] = servant.battleInfo.battleId.toString()
        break
      case 'as':
        if (servant.battleInfo.verticalPosition - 1 < 0 || servant.battleInfo.horizontalPosition + 1 > 7 || this.map[servant.battleInfo.horizontalPosition + 1][servant.battleInfo.verticalPosition - 1] !== '=') throw new Error(`O servo ${servant.name} não pode se mover para esta posição)`)
        this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition] = '='
        servant.battleInfo.horizontalPosition += 1
        servant.battleInfo.verticalPosition -= 1
        this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition] = servant.battleInfo.battleId.toString()
        break
      case 'sd':
        this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition] = '='
        servant.battleInfo.horizontalPosition += 1
        servant.battleInfo.verticalPosition += 1
        this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition] = servant.battleInfo.battleId.toString()
        break
      case 'ds':
        this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition] = '='
        servant.battleInfo.horizontalPosition += 1
        servant.battleInfo.verticalPosition += 1
        this.map[servant.battleInfo.horizontalPosition][servant.battleInfo.verticalPosition] = servant.battleInfo.battleId.toString()
        break
      default:
        throw new Error('Direção de movimento inválida')
    }
    servant.spendBattlePoint('movement')
    return servant
  }

  getServantsInBattleOrderedByInitiative (servantList: Servant[]): Servant[] {
    return this.servantSorter.initiativeServantBubbleSort(servantList)
  }
}

class BattleFactory {
  constructor (readonly servantSorter: ServantSorter, readonly randomNumberGenerator: RandomNumberGenerator, readonly uuidGenerator: UuidGenerator) {}
  create (name: string): Battle {
    const battleMap = [
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '']
    ]
    return new Battle(this.servantSorter, this.randomNumberGenerator, this.uuidGenerator.generate(), name, [], battleMap)
  }
}

export { type BattleDTO, Battle, BattleFactory }
