import type ILogEntity from './ILogEntity'
import type IUserEntity from './IUserEntity'
import type IBattle from './IBattle'
import type IServant from './IServant'
import type IMaster from './IMaster'
import type Attributes from '../type/Attributes'

interface IMariadbDataSource {
  startConnection: () => Promise<boolean>
  stopConnection: () => Promise<boolean>
  openConnectionPool: () => Promise<boolean>
  closeConnectionPool: () => Promise<boolean>
  createMotionBladeDatabase: () => Promise<boolean>
  motionBladeDatabaseExists: () => Promise<boolean>
  createBattleTable: () => Promise<boolean>
  createLogTable: () => Promise<boolean>
  createMasterTable: () => Promise<boolean>
  createServantTable: () => Promise<boolean>
  createUserTable: () => Promise<boolean>
  tableExists: (tableName: string) => Promise<boolean>
  createNecessaryTables: () => Promise<boolean>
  insertBattleRegistry: (id: string, map: [number, number], participants: IServant[]) => Promise<IBattle>
  insertLogRegistry: (id: string, date: string, message: string) => Promise<ILogEntity>
  insertMasterRegistry: (id: string, name: string, servantList: IServant[]) => Promise<IMaster>
  insertServantRegistry: (id: string, masterId: string, name: string, profession: string, seniority: number, attributes: Attributes, isInBattle: boolean, battlePosition: [number, number]) => Promise<IServant>
  insertUserRegistry: (id: string, login: string, password: string, email: string, type: string) => Promise<IUserEntity>
  getEveryBattleRegistry: () => Promise<IBattle[]>
  getEveryLogRegistry: () => Promise<ILogEntity[]>
  getEveryMasterRegistry: () => Promise<IMaster[]>
  getEveryServantRegistry: () => Promise<IServant[]>
  getEveryUserRegistry: () => Promise<IUserEntity[]>
  getBattleBy: (parameter: string, value: string) => Promise<IBattle | null>
  getLogBy: (parameter: string, value: string) => Promise<ILogEntity | null>
  getMasterBy: (parameter: string, value: string) => Promise<IMaster | null>
  getServantBy: (parameter: string, value: string) => Promise<IServant | null>
  getUserBy: (parameter: string, value: string) => Promise<IUserEntity | null>
  updateBattleById: (id: string, map: [number, number], participants: IServant[]) => Promise<IBattle>
  updateMasterById: (id: string, nam: string, servantList: IServant[]) => Promise<IMaster>
  updateServantById: (id: string, masterId: string, name: string, profession: string, seniority: number, attributes: Attributes, isInBattle: boolean, battlePosition: [number, number]) => Promise<IServant>
  deleteBattleById: (id: string) => Promise<boolean>
  deleteUserById: (id: string) => Promise<boolean>
  deleteMasterById: (id: string) => Promise<boolean>
  deleteServantById: (id: string) => Promise<boolean>
  updateUserById: (id: string, login: string, password: string, email: string, type: string) => Promise<IUserEntity>
}

export default IMariadbDataSource
