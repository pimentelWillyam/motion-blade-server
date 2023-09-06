import type { DataSource } from 'typeorm'

interface IDatabase {
  readonly dataSource: DataSource
  isInitialized: boolean

  start: () => Promise<void>
  stop: () => Promise<void>
}

export default IDatabase
