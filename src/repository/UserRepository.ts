import type { User, UserDTO } from '../factories/UserFactory'
import type { PostgresDataSource } from '../data/PostgresDataSource'

class UserRepository {
  constructor (readonly dataSource: PostgresDataSource) {}

  async create (user: User): Promise<UserDTO> {
    return await this.dataSource.insertUserRegistry(user)
  }

  async getAll (): Promise<UserDTO[]> {
    return await this.dataSource.fetchEveryUserRegistry()
  }

  async getByLogin (login: string): Promise<UserDTO | null> {
    return await this.dataSource.fetchUserBy('login', login)
  }

  async update (login: string, updatedUser: User): Promise<UserDTO | null> {
    return await this.dataSource.updateUserBy('login', login, updatedUser)
  }

  async delete (login: string): Promise<UserDTO | null> {
    return await this.dataSource.deleteUserBy('login', login)
  }
}

export default UserRepository
