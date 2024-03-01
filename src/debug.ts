import RandomNumberGenerator from './bot/helper/RandomNumberGenerator'
import UuidGenerator from './bot/helper/UuidGenerator'
import { ArmorFactory } from './factories/ArmorFactory'
import { BattleFactory } from './factories/BattleFactory'
import { ServantFactory } from './factories/ServantFactory'
import { WeaponFactory } from './factories/WeaponFactory'

const debug = async () => {
  const battleFactory = new BattleFactory(new RandomNumberGenerator(), new UuidGenerator())
  const servantFactory = new ServantFactory(new UuidGenerator(), new ArmorFactory(), new WeaponFactory())
  let battle = battleFactory.create('battle')
  const servant1 = servantFactory.create('mestre', 'servo1', 'soldado', 'soldado', { agility: 5, fortitude: 10, strength: 5, technique: 10 })
  const servant2 = servantFactory.create('mestre', 'servo2', 'soldado', 'soldado', { agility: 5, fortitude: 10, strength: 5, technique: 10 })

  battle.insertServant(servant1)
  battle.insertServant(servant2)
  // console.log(battle.map[0].toString())
  // console.log(battle.map[1].toString())
  // console.log(battle.map[2].toString())
  // console.log(battle.map[3].toString())
  // console.log(battle.map[4].toString())
  // console.log(battle.map[5].toString())
  // console.log(battle.map[6].toString())
  // console.log(battle.map[7].toString())
  // console.log('\n\n\n')

  // const moveServantReturn = await battle.moveServant(servant1, 'c')
  // console.log('o id de batalha do servo 1 é ', servant1.battleInfo.battleId)

  // battle = moveServantReturn[1]
  // console.log(battle.map[0].toString())
  // console.log(battle.map[1].toString())
  // console.log(battle.map[2].toString())
  // console.log(battle.map[3].toString())
  // console.log(battle.map[4].toString())
  // console.log(battle.map[5].toString())
  // console.log(battle.map[6].toString())
  // console.log(battle.map[7].toString())
}

void debug()
