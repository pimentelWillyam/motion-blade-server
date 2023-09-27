import config from '../config'

import * as mariadb from 'mariadb'
import type { Connection, Pool } from 'mariadb'
import { type Servant } from '../factories/ServantFactory'

class MariadbDataSource {
  private connection: Connection | undefined
  private pool: Pool | undefined

  async bootstrap (): Promise<boolean> {
    await this.openConnectionPool()
    await this.createNecessaryDatabases()
    await this.useMotionBladeDatabase()
    await this.createNecessaryTables()
    return true
  }

  async startConnection (): Promise<boolean> {
    console.log('connection started')
    this.connection = await mariadb.createConnection({ host: config.mariadb.host, user: config.mariadb.username, password: config.mariadb.password })
    return true
  }

  async stopConnection (): Promise<boolean> {
    if (this.connection === undefined) {
      return false
    }
    console.log('connection stopped')
    await this.connection.end()
    return true
  }

  async openConnectionPool (): Promise<boolean> {
    this.pool = mariadb.createPool({ host: config.mariadb.host, user: config.mariadb.username, password: config.mariadb.password })
    return true
  }

  async closeConnectionPool (): Promise<boolean> {
    if (this.pool === undefined) {
      return false
    }
    await this.pool.end()
    return true
  }

  async createNecessaryDatabases (): Promise<boolean> {
    if (!await this.motionBladeDatabaseExists()) await this.createMotionBladeDatabase()
    return true
  }

  async createMotionBladeDatabase (): Promise<boolean> {
    await this.pool?.query('CREATE DATABASE motion_blade ;')
    return true
  }

  async useMotionBladeDatabase (): Promise<boolean> {
    await this.pool?.query('USE motion_blade ;')
    return true
  }

  async motionBladeDatabaseExists (): Promise<boolean> {
    const databaseList = await this.pool?.query("SHOW DATABASES LIKE 'motion_blade' ;")
    if (databaseList.length === 0) {
      return false
    }
    return true
  }

  async createServantTable (): Promise<boolean> {
    console.log('creating servant table')

    const query = "CREATE TABLE `servant` (`id` UUID NOT NULL, `masterId` VARCHAR(50) NOT NULL DEFAULT '', `name` VARCHAR(50) NOT NULL DEFAULT '', `fatherProfession` VARCHAR(50) NOT NULL DEFAULT '', `youthProfession` VARCHAR(50) NOT NULL DEFAULT '', `currentAttributes` JSON NOT NULL, `maximumAttributes` JSON NOT NULL, `guard` SMALLINT NOT NULL DEFAULT 0, `buff` SMALLINT NOT NULL DEFAULT 0, `debuff` SMALLINT NOT NULL DEFAULT 0, `inventory` JSON NOT NULL, `maestry` JSON NOT NULL)COLLATE='latin1_swedish_ci';"
    // await this.pool?.query("CREATE TABLE `servant` (`id` UUID NOT NULL, `master_id` VARCHAR(50) NOT NULL DEFAULT '', `name` VARCHAR(50) NOT NULL DEFAULT '', `father_profession` VARCHAR(50) NOT NULL DEFAULT '', `youth_profession` VARCHAR(50) NOT NULL DEFAULT '', `current_attributes` JSON NOT NULL, `maximum_attributes` JSON NOT NULL, `guard` SMALLINT NOT NULL DEFAULT 0, `buff` SMALLINT NOT NULL DEFAULT 0, `debuff` SMALLINT NOT NULL DEFAULT 0, `inventory` JSON NOT NULL, `maestry` JSON NOT NULL)COLLATE='latin1_swedish_ci';")

    await this.pool?.query(query)

    return true
  }

  async tableExists (tableName: string): Promise<boolean> {
    const res = await this.pool?.query("SHOW TABLES FROM motion_blade LIKE '" + tableName + "' ;")
    if (res[0] == null) {
      return false
    }
    return true
  }

  async createNecessaryTables (): Promise<boolean> {
    if (!await this.tableExists('servant')) await this.createServantTable()
    return true
  }

  async insertBattleRegistry (id: string, map: [number, number], participants: IServant[]): Promise<IBattle> {
    await this.pool?.query(`INSERT INTO motion_blade.battle (id, map, participants) VALUES ('${id}', '${map}', '${participants}');`)
    return { id, map: [0, 0], participants }
  }

  async insertLogRegistry (id: string, date: string, message: string): Promise<ILogEntity> {
    await this.pool?.query(`INSERT INTO motion_blade.log (id, date, message) VALUES ('${id}', '${date}', '${message}');`)
    return { id, date, message }
  }

  async insertMasterRegistry (id: string, name: string, servantList: IServant[]): Promise<IMaster> {
    await this.pool?.query(`INSERT INTO motion_blade.master (id, name, servant_list) VALUES ('${id}', '${name}', '${servantList}');`)
    return { id, name, servantList }
  }

  async insertServantRegistry (id: string, masterId: string, name: string, profession: string, seniority: number, attributes: Attributes, isInBattle: boolean, battlePosition: [number, number]): Promise<IServant> {
    await this.pool?.query(`INSERT INTO motion_blade.servant (id, master_id, name, profession, seniority, attributes, is_in_battle, battle_position ) VALUES ('${id}', '${masterId}', '${name}', '${profession}', '${seniority}', '${attributes}', '${isInBattle}', '${battlePosition}' ;`)
    return { id, masterId, name, profession, seniority, attributes, isInBattle, battlePosition }
  }

  async insertUserRegistry (id: string, login: string, password: string, email: string, type: string): Promise<IUserEntity> {
    await this.pool?.query(`INSERT INTO motion_blade.servant (id, login, password, email, type) VALUES ('${id}', '${login}', '${password}', '${email}', '${type}' ;`)
    return { id, login, password, email, type }
  }

  async getEveryBattleRegistry (): Promise<IBattle[]> {
    return await this.pool?.query('SELECT * FROM motion_blade.battle ;') as IBattle[]
  }

  async getEveryLogRegistry (): Promise<ILogEntity[]> {
    return await this.pool?.query('SELECT * FROM motion_blade.log ;') as ILogEntity[]
  }

  async getEveryMasterRegistry (): Promise<IMaster[]> {
    return await this.pool?.query('SELECT * FROM motion_blade.master ;') as IMaster[]
  }

  async getEveryServantRegistry (): Promise<IServant[]> {
    return await this.pool?.query('SELECT * FROM motion_blade.servant ;') as IServant[]
  }

  async getEveryUserRegistry (): Promise<IUserEntity[]> {
    return await this.pool?.query('SELECT * FROM motion_blade.user ;') as IUserEntity[]
  }

  async getBattleBy (parameter: string, value: string): Promise<IBattle> {
    return await this.pool?.query(`SELECT * FROM motion_blade.battle WHERE ${parameter} = ${value} ;`) as IBattle
  }

  async getLogBy (parameter: string, value: string): Promise<ILogEntity> {
    return await this.pool?.query(`SELECT * FROM motion_blade.log WHERE ${parameter} = ${value} ;`) as ILogEntity
  }

  async getMasterBy (parameter: string, value: string): Promise<IMaster> {
    return await this.pool?.query(`SELECT * FROM motion_blade.master WHERE ${parameter} = ${value} ;`) as IMaster
  }

  async getServantBy (parameter: string, value: string): Promise<IServant> {
    return await this.pool?.query(`SELECT * FROM motion_blade.servant WHERE ${parameter} = ${value} ;`) as IServant
  }

  async getUserBy (parameter: string, value: string): Promise<IUserEntity> {
    return await this.pool?.query(`SELECT * FROM motion_blade.user WHERE ${parameter} = ${value} ;`) as IUserEntity
  }

  async updateUserById (id: string, login: string, password: string, email: string, type: string): Promise<IUserEntity> {
    await this.pool?.query(`UPDATE  motion_blade.user SET id = '${id}', login = '${login}', password = '${password}', email = '${email}', type= '${type}' WHERE id = '${id}';`)
    return { id, login, password, email, type }
  }

  async updateBattleById (id: string, map: [number, number], participants: IServant[]): Promise<IBattle> {
    // await this.pool?.query(`UPDATE  motion_blade.user SET id = '${id}', login = '${login}', password = '${password}', email = '${email}', type= '${type}' WHERE id = '${id}';`)
    return { id, map, participants }
  }

  async updateMasterById (id: string, name: string, servantList: IServant[]): Promise<IMaster> {
    // await this.pool?.query(`UPDATE  motion_blade.user SET id = '${id}', login = '${login}', password = '${password}', email = '${email}', type= '${type}' WHERE id = '${id}';`)
    return { id, name, servantList }
  }

  async updateServantById (id: string, masterId: string, name: string, profession: string, seniority: number, attributes: Attributes, isInBattle: boolean, battlePosition: [number, number]): Promise<IServant> {
    // await this.pool?.query(`UPDATE  motion_blade.user SET id = '${id}', login = '${login}', password = '${password}', email = '${email}', type= '${type}' WHERE id = '${id}';`)
    return { id, masterId, name, profession, seniority, attributes, isInBattle, battlePosition }
  }

  async deleteBattleById (id: string): Promise<boolean> {
    // await this.pool?.query(`UPDATE  motion_blade.user SET id = '${id}', login = '${login}', password = '${password}', email = '${email}', type= '${type}' WHERE id = '${id}';`)
    return true
  }

  async deleteUserById (id: string): Promise<boolean> {
    // await this.pool?.query(`UPDATE  motion_blade.user SET id = '${id}', login = '${login}', password = '${password}', email = '${email}', type= '${type}' WHERE id = '${id}';`)
    return true
  }

  async deleteMasterById (id: string): Promise<boolean> {
    // await this.pool?.query(`UPDATE  motion_blade.user SET id = '${id}', login = '${login}', password = '${password}', email = '${email}', type= '${type}' WHERE id = '${id}';`)
    return true
  }

  async deleteServantById (id: string): Promise<boolean> {
    // await this.pool?.query(`UPDATE  motion_blade.user SET id = '${id}', login = '${login}', password = '${password}', email = '${email}', type= '${type}' WHERE id = '${id}';`)
    return true
  }
}

export default MariadbDataSource
