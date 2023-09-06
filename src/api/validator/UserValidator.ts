import type IUserRepository from '../interface/IUserRepository'
import type IUserValidator from '../interface/IUserValidator'

class UserValidator implements IUserValidator {
  constructor (readonly userRepository: IUserRepository) {}
  async isUserValid (login: string, password: string, email: string, type: string): Promise<boolean> {
    if (this.isEmpty(login) || this.isEmpty(password) || this.isEmpty(type) || this.hasInvalidCharacters(login) || await this.loginAlreadyExists(login) || await this.emailAlreadyExists(password)) {
      return false
    } else {
      return true
    }
  }

  isEmpty (value: string): boolean {
    if (value === '' || value == null) {
      return true
    } else {
      return false
    }
  }

  hasInvalidCharacters (value: string): boolean {
    for (let i = 0; i < value.length; i++) {
      if (value[i] === ' ' || value[i] === '!' || value[i] === '@' || value[i] === '#' || value[i] === '%') {
        return true
      }
    }
    return false
  }

  isLoginEmpty (login: string): boolean {
    if (login === '' || login === null || login === undefined) {
      return true
    } else {
      return false
    }
  }

  isPasswordsEmpty (passwords: string): boolean {
    if (passwords === '' || passwords === null || passwords === undefined) {
      return true
    } else {
      return false
    }
  }

  isPermissionEmpty (permission: string): boolean {
    if (permission === '' || permission === null || permission === undefined) {
      return true
    } else {
      return false
    }
  }

  async loginAlreadyExists (login: string): Promise<boolean> {
    if ((await this.userRepository.getByLogin(login)) != null) {
      return true
    } else {
      return false
    }
  }

  async emailAlreadyExists (email: string): Promise<boolean> {
    if ((await this.userRepository.getByEmail(email)) != null) {
      return true
    } else {
      return false
    }
  }
}

export default UserValidator
