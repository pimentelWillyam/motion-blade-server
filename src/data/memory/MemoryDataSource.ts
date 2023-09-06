import type Master from '../../bot/model/Master'
import type Servant from '../../bot/model/Servant'
import type IMemoryDataSource from './IMemoryDataSource'

class MemoryDataSource implements IMemoryDataSource {
  private servantList: Servant[] = []
  private masterList: Master[] = []

  createMasterTable = (): void => {
    this.masterList = []
  }

  createServantTable = (): void => {
    this.servantList = []
  }

  insertMasterRegistry = (id: string, name: string, servantsOwnedIdList: string[]): void => {
    this.masterList.push({ id, name, servantsOwnedIdList })
  }

  insertServantRegistry = (id: string, name: string, servantsOwnedIdList: string[]): void => {
    const servant: Servant
    servant
      .this.masterList.push({ id, name, servantsOwnedIdList })
  }
}

export default MemoryDataSource
