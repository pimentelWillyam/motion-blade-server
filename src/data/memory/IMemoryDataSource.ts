interface IMemoryDataSource {
  createMasterTable: () => void
  createServantTable: () => void
  insertMasterRegistry: (id: string, name: string, servantsOwnedIdList: string[]) => void
  insertServantRegistry: () => void
  updateMasterRegistryBy: () => void
  updateServantRegistryBy: () => void
  deleteMasterRegistryBy: () => void
  deleteServantRegistryBy: () => void

}

export default IMemoryDataSource
