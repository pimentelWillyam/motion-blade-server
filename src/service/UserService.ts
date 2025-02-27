import type { UserDTO, User, UserFactory } from '../factories/UserFactory'
import type UserRepository from '../repository/UserRepository'

class UserService {
  constructor (private readonly userRepository: UserRepository, private readonly userFactory: UserFactory) {}

  create = async (login: string, password: string): Promise<UserDTO> => {
    if (!await this.userExists(login)) {
      const user = this.userFactory.create(login, password)
      return await this.userRepository.create(user)
    }
    throw new Error('Já existe um servo com esse login')
  }

  getAll = async (): Promise<UserDTO[]> => {
    return await this.userRepository.getAll()
  }

  get = async (login: string): Promise<User> => {
    const fetchedUser = await this.userRepository.getByLogin(login)
    if (fetchedUser != null) return this.userFactory.createThroughDto(fetchedUser)
    throw new Error(`O servo ${login} não existe`)
  }

  userExists = async (login: string): Promise<boolean> => {
    const fetchedUser = await this.userRepository.getByLogin(login)
    if (fetchedUser != null) return true
    return false
  }

  update = async (login: string, contentToUpdate: User): Promise<UserDTO> => {
    const userToBeUpdated = await this.userRepository.update(login, contentToUpdate)
    if (userToBeUpdated !== null) return userToBeUpdated
    throw new Error('Não é possível atualizar um servo que não existe')
  }

  delete = async (login: string): Promise<UserDTO> => {
    const userToBeDeleted = await this.userRepository.delete(login)
    if (userToBeDeleted !== null) return userToBeDeleted
    throw new Error('Não é possível deletar um servo que não existe')
  }
}

export default UserService
