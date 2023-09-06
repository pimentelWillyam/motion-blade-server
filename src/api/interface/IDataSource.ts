interface IDataSource {
  startConnection: () => Promise<boolean>
  stopConnection: () => Promise<boolean>
  openConnectionPool: () => Promise<boolean>
  closeConnectionPool: () => Promise<boolean>
  setupDatabase: (databaseToBeUsed: string) => Promise<boolean>
  createDatabase: (databaseName: string) => Promise<boolean>
  databaseExists: (databaseName: string) => Promise<boolean>
  createTable: (databaseName: string, tableName: string, tableColumns: string) => Promise<boolean>
  tableExists: (databaseName: string, tableName: string) => Promise<boolean>
  everyNecessaryTableHaveBeenCreated: (databaseName: string, necessaryTablesList: string[]) => Promise<boolean>
  createNecessaryTables: (databaseName: string, necessaryTablesList: string[]) => Promise<boolean>
  getEverythingFromTable: (databaseName: string, tableName: string) => Promise<unknown[]>
  insertRegistryIntoTable: (databaseName: string, tableName: string, columnList: string[], propertyList: string[]) => Promise<boolean>
  getRegistryBy: (databaseName: string, tableName: string, whereParameter: string, whereValue: string) => Promise<unknown[]>
  updateRegistryBy: (databaseName: string, tableName: string, whereParameter: string, whereValue: string, columnList: string[], registryList: string[]) => Promise<boolean>
  deleteRegistryBy: (databaseName: string, tableName: string, whereParameter: string, whereValue: string) => Promise<boolean>
}

export default IDataSource
