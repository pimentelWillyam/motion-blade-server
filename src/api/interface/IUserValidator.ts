interface IUserValidator {
  isUserValid: (login: string, password: string, email: string, type: string) => Promise<boolean>
  isEmpty: (value: string) => boolean
  loginAlreadyExists: (value: string) => Promise<boolean>
  emailAlreadyExists: (value: string) => Promise<boolean>
}

export default IUserValidator
