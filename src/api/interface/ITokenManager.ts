
interface ITokenManager {
  generate: (id: string) => string
  isValid: (token: string) => boolean
}

export default ITokenManager
