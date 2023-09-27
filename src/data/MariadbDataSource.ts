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

  async insertServantRegistry (servant: Servant): Promise<Servant> {
    const query = 'INSERT INTO motion_blade.servant (id, masterId, name, fatherProfession, youthProfession, currentAttributes, maximumAttributes, guard, buff, debuff, inventory, maestry) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);'
    await this.pool?.query(query, [servant.id, servant.masterId, servant.name, servant.fatherProfession, servant.youthProfession, servant.currentAttributes, servant.maximumAttributes, servant.guard, servant.buff, servant.debuff, servant.inventory, servant.maestry])

    return servant
  }

  async fetchEveryServantRegistry (): Promise<Servant[]> {
    return await this.pool?.query('SELECT * FROM motion_blade.servant ;') as Servant[]
  }

  async fetchServantBy (parameter: string, parameterValue: string): Promise<Servant | null> {
    const servantList = await this.pool?.query(`SELECT * FROM motion_blade.servant WHERE ${parameter} = '${parameterValue}' ;`)
    if (servantList[0] === undefined) return null
    else return servantList[0] as Servant
  }

  async updateServantBy (parameter: string, parameterValue: string, servantToUpdate: Servant): Promise<Servant> {
    const query = `UPDATE motion_blade.servant SET id=?,masterId=?,name=?,fatherProfession=?,youthProfession=?,currentAttributes=?,maximumAttributes=?,guard=?,buff=?,debuff=?,inventory=?,maestry=? WHERE ${parameter} = '${parameterValue}'`
    // 
    // await this.pool?.query(`UPDATE  motion_blade.user SET id = '${id}', login = '${login}', password = '${password}', email = '${email}', type= '${type}' WHERE id = '${id}';`)

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
