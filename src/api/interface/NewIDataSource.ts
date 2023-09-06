interface IDataSource {
  startConnection: () => Promise<boolean>
  stopConnection: () => Promise<boolean>
  openConnectionPool: () => Promise<boolean>
  closeConnectionPool: () => Promise<boolean>
  setupDatabase: (databaseToBeUsed: string) => Promise<boolean>
}

export default IDataSource
