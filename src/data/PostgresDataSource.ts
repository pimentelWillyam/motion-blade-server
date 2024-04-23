import config from '../config'

import { type ServantDTO, type Servant } from '../factories/ServantFactory'
import { type BattleDTO } from '../factories/BattleFactory'
import type DatabaseServant from '../api/model/DatabaseServant'
import { type Client } from 'pg'
import type DatabaseBattle from '../api/model/DatabaseBattle'
import { type Master } from '../factories/MasterFactory'

class PostgresDataSource {
  private readonly databaseCreator: Client
  private readonly client: Client

  constructor (ClientClass: typeof Client) {
    this.databaseCreator = new ClientClass({
      user: config.postgres.user,
      host: config.postgres.host,
      password: config.postgres.password,
      port: config.postgres.port
    })
    this.client = new ClientClass({
      user: config.postgres.user,
      host: config.postgres.host,
      database: config.postgres.database,
      password: config.postgres.password,
      port: config.postgres.port
    })
  }

  async start (): Promise<void> {
    await this.client.connect()
  }

  async stopConnection (): Promise<void> {
    await this.client.end()
  }

  private async motionBladeDatabaseExists (): Promise<boolean> {
    const query = "SELECT datname FROM pg_database WHERE datname LIKE '%motion_blade_2%';"
    const databaseList = await this.databaseCreator.query(query)
    if (databaseList.rowCount === 0) {
      return false
    }
    return true
  }

  private async createMotionBladeDatabase (): Promise<void> {
    await this.databaseCreator.query('CREATE DATABASE motion_blade_2 ;')
  }

  private async tableExists (tableName: string): Promise<boolean> {
    const query = `SELECT EXISTS ( SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '${tableName}');`
    const res = await this.client.query(query)
    if (res.rows[0].exists as boolean) {
      return true
    }
    return false
  }

  private async createServantTable (): Promise<boolean> {
    // await this.client.query('USE motion_blade_2 ;').finally(() => {
    const query3 = `CREATE TABLE servant (
        id UUID NOT NULL,
        master_id VARCHAR NOT NULL,
        name VARCHAR NOT NULL,
        father_profession VARCHAR NOT NULL,
        youth_profession VARCHAR NOT NULL,
        current_attributes JSON NOT NULL,
        maximum_attributes JSON NOT NULL,
        combat_capabilities JSON NOT NULL,
        battle_points JSON NOT NULL,
        battle_info JSON NOT NULL,
        inventory JSON NOT NULL,
        maestry JSON NOT NULL,
        PRIMARY KEY (id)
    );`

    // const query2 = "CREATE TABLE `servant` (`id` UUID NOT NULL, `master_id` VARCHAR(50) NOT NULL DEFAULT '', `name` VARCHAR(50) NOT NULL DEFAULT '', `father_profession` VARCHAR(50) NOT NULL DEFAULT '', `youth_profession` VARCHAR(50) NOT NULL DEFAULT '', `current_attributes` JSON NOT NULL, `maximum_attributes` JSON NOT NULL, `combat_capabilities` JSON NOT NULL, `battle_info` JSON NOT NULL, `inventory` JSON NOT NULL, `maestry` JSON NOT NULL)COLLATE='latin1_swedish_ci';"

    // })
    // const query2 = "CREATE TABLE `servant` (`id` UUID NOT NULL, `master_id` VARCHAR(50) NOT NULL DEFAULT '', `name` VARCHAR(50) NOT NULL DEFAULT '', `father_profession` VARCHAR(50) NOT NULL DEFAULT '', `youth_profession` VARCHAR(50) NOT NULL DEFAULT '', `current_attributes` JSON NOT NULL, `maximum_attributes` JSON NOT NULL, `combat_capabilities` JSON NOT NULL, `battle_info` JSON NOT NULL, `inventory` JSON NOT NULL, `maestry` JSON NOT NULL)COLLATE='latin1_swedish_ci';"
    // await this.pool?.query(query2)
    await this.client.query(query3)
    return true
  }

  private async createBattleTable (): Promise<boolean> {
    // await this.client.query('USE motion_blade_2 ;').finally(() => {
    // const query = "CREATE TABLE `battle` (`id` UUID NOT NULL, `name` VARCHAR(50) NOT NULL DEFAULT '', `participants_list` JSON NOT NULL, `turn_info` JSON NULL, `map` JSON NOT NULL)COLLATE='latin1_swedish_ci';"
    const query2 = `CREATE TABLE battle (
        id UUID NOT NULL,
        name VARCHAR(50) NOT NULL DEFAULT '',
        participants_name_list TEXT[] NOT NULL,
        turn_info JSON,
        map TEXT[][] NOT NULL
    );`
    await this.client.query(query2)
    return true
  }

  private async createMasterTable (): Promise<boolean> {
    const query2 = `CREATE TABLE master (
      id UUID NOT NULL,
      name VARCHAR(50) NOT NULL DEFAULT '',
      login VARCHAR(50) NOT NULL,
      password VARCHAR(50) NOT NULL,
      type VARCHAR(50) NOT NULL,
      servants_name_list JSON
  );`
    await this.client.query(query2)
    return true
  }

  private async createNecessaryTables (): Promise<void> {
    if (!await this.tableExists('servant')) await this.createServantTable()
    if (!await this.tableExists('battle')) await this.createBattleTable()
    if (!await this.tableExists('master')) await this.createMasterTable()
  }

  async bootstrap (): Promise<void> {
    await this.databaseCreator.connect()
    if (!await this.motionBladeDatabaseExists()) await this.createMotionBladeDatabase()
    await this.client.connect()
    await this.createNecessaryTables()
  }

  async insertMasterRegistry (master: Master): Promise<Master> {
    // const query = 'INSERT INTO motion_blade_2.servant (id, master_id, name, father_profession, youth_profession, current_attributes, maximum_attributes, combat_capabilities, battle_info, inventory, maestry) VALUES (?,?,?,?,?,?,?,?,?,?,?);'
    const query2 = `INSERT INTO master (
      id,
      login,
      password,
      type,
  ) VALUES (
      $1,
      $2,
      $3,
      $4,
  );`
    await this.client.query(query2, [master.id, master.login, master.password, master.type])
    return master
  }

  async insertServantRegistry (servant: Servant): Promise<Servant> {
    // const query = 'INSERT INTO motion_blade_2.servant (id, master_id, name, father_profession, youth_profession, current_attributes, maximum_attributes, combat_capabilities, battle_info, inventory, maestry) VALUES (?,?,?,?,?,?,?,?,?,?,?);'
    const query2 = `INSERT INTO servant (
      id,
      master_id,
      name,
      father_profession,
      youth_profession,
      current_attributes,
      maximum_attributes,
      combat_capabilities,
      battle_points,
      battle_info,
      inventory,
      maestry
  ) VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7,
      $8,
      $9,
      $10,
      $11,
      $12

  );`
    await this.client.query(query2, [servant.id, servant.masterId, servant.name, servant.fatherProfession, servant.youthProfession, servant.currentAttributes, servant.maximumAttributes, servant.combatCapabilities, servant.battlePoints, servant.battleInfo, servant.inventory, servant.maestry])
    return servant
  }

  async insertBattleRegistry (battle: BattleDTO): Promise<BattleDTO> {
    // const query = 'INSERT INTO motion_blade_2.battle (id, name, map) VALUES (?,?,?);'
    // "working" below
  //   const query2 = `INSERT INTO battle (
  //     id,
  //     name,
  //     participants_list,
  //     turn_info,
  //     map
  // ) VALUES (
  //     '$1',
  //     '$2',
  //     '$3',
  //     '$4',
  //     '$5'
  // );`
  //   await this.client.query(query2, [battle.id, battle.name, battle.participantsList, battle.turnInfo, battle.map])
  //   return battle

    const query2 = 'INSERT INTO battle (id, name, participants_name_list, turn_info, map) VALUES ($1,$2,$3,$4,$5);'
    await this.client.query(query2, [battle.id, battle.name, battle.participantsNameList, battle.turnInfo, battle.map])
    return battle
  }

  async fetchEveryServantRegistry (): Promise<ServantDTO[]> {
    const query = `SELECT * FROM servant;
    `

    const databaseData = (await this.client.query(query)).rows as DatabaseServant[]
    const servantList: ServantDTO[] = []
    databaseData.forEach((servant) => {
      servantList.push({
        id: servant.id,
        masterId: servant.master_id,
        name: servant.name,
        fatherProfession: servant.father_profession,
        youthProfession: servant.youth_profession,
        currentAttributes: servant.current_attributes,
        maximumAttributes: servant.maximum_attributes,
        combatCapabilities: servant.combat_capabilities,
        battlePoints: servant.battle_points,
        battleInfo: servant.battle_info,
        inventory: servant.inventory,
        maestry: servant.maestry

      })
    })
    return servantList
  }

  async fetchEveryBattleRegistry (): Promise<BattleDTO[]> {
    const query = 'SELECT * FROM battle;'

    const databaseData = (await this.client.query(query)).rows as DatabaseBattle[]
    const battleList: BattleDTO[] = []
    databaseData.forEach((battle) => {
      battleList.push({
        id: battle.id,
        map: battle.map,
        name: battle.name,
        participantsNameList: battle.participants_name_list,
        turnInfo: { servantAboutToPlay: undefined, servantsYetToPlay: undefined }
      })
    })
    return battleList
  }

  async fetchServantBy (parameter: string, parameterValue: string): Promise<ServantDTO | null> {
    const databaseData = (await this.client.query(`SELECT * FROM servant WHERE ${parameter} = '${parameterValue}' ;`)).rows as unknown as DatabaseServant[]
    if (databaseData[0] === undefined) return null
    else {
      return {
        id: databaseData[0].id,
        masterId: databaseData[0].master_id,
        name: databaseData[0].name,
        fatherProfession: databaseData[0].father_profession,
        youthProfession: databaseData[0].youth_profession,
        currentAttributes: databaseData[0].current_attributes,
        maximumAttributes: databaseData[0].maximum_attributes,
        combatCapabilities: databaseData[0].combat_capabilities,
        battlePoints: databaseData[0].battle_points,

        battleInfo: databaseData[0].battle_info,
        inventory: databaseData[0].inventory,
        maestry: databaseData[0].maestry

      }
    }
  }

  async fetchBattleBy (parameter: string, parameterValue: string): Promise<BattleDTO | null> {
    const battleList = await this.client.query(`SELECT * FROM battle WHERE ${parameter} = '${parameterValue}' ;`)
    if (battleList.rows[0] === undefined) return null
    const battle = battleList.rows[0] as DatabaseBattle
    return {
      id: battle.id,
      map: battle.map,
      name: battle.name,
      participantsNameList: battle.participants_name_list,
      turnInfo: battle.turn_info
    }
  }

  async updateServantBy (parameter: string, parameterValue: string, servantToUpdate: Servant): Promise<Servant> {
    // const query = `UPDATE motion_blade_2.public.servant SET id=? , masterId=? , name=? , fatherProfession=? , youthProfession=? , currentAttributes=? , maximumAttributes=? , guard=? , buff=? , debuff=? , inventory=? , maestry=? WHERE ${parameter} = '${parameterValue}'`
    const query2 = `UPDATE servant
    SET
      master_id = $2,
      name = $3,
      father_profession = $4,
      youth_profession = $5,
      current_attributes = $6,
      maximum_attributes = $7,
      combat_capabilities = $8,
      battle_points = $9,
      battle_info = $10,
      inventory = $11,
      maestry = $12
    WHERE
      id = $1;
    `
    await this.client.query(query2, [servantToUpdate.id, servantToUpdate.masterId, servantToUpdate.name, servantToUpdate.fatherProfession, servantToUpdate.youthProfession, servantToUpdate.currentAttributes, servantToUpdate.maximumAttributes, servantToUpdate.combatCapabilities, servantToUpdate.battlePoints, servantToUpdate.battleInfo, servantToUpdate.inventory, servantToUpdate.maestry])

    return servantToUpdate
  }

  async updateBattleBy (parameter: string, parameterValue: string, battleToUpdate: BattleDTO): Promise<BattleDTO> {
    // const query = `UPDATE motion_blade_2.public.battle SET id=?,name=?,participants_list=?,turn_info=?,map=? WHERE ${parameter} = '${parameterValue}'`
    const query2 = `UPDATE battle
    SET
      name = $1,
      participants_name_list = $2,
      turn_info = $3,
      map = $4
    WHERE
      name = $5;
    `

    await this.client.query(query2, [battleToUpdate.name, battleToUpdate.participantsNameList, battleToUpdate.turnInfo, battleToUpdate.map, parameterValue])

    return battleToUpdate
  }

  async deleteServantBy (parameter: string, parameterValue: string): Promise<ServantDTO | null> {
    const servant = await this.fetchServantBy(parameter, parameterValue)
    if (servant === null) return null
    const query = `DELETE FROM motion_blade_2.public.servant WHERE ${parameter} = '${parameterValue}';`
    await this.client.query(query)
    return servant
  }

  async deleteBattleBy (parameter: string, parameterValue: string): Promise<BattleDTO | null> {
    const battle = await this.fetchBattleBy(parameter, parameterValue)
    if (battle === null) return null
    const query = `DELETE FROM motion_blade_2.public.battle WHERE ${parameter} = '${parameterValue}';`
    await this.client.query(query)
    return battle
  }
}

export { PostgresDataSource }
