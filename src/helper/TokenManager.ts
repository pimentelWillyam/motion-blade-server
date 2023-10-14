import type ITokenManager from '../api/interface/ITokenManager'

import * as jsonwebtoken from 'jsonwebtoken'
import config from '../config'

class TokenManager implements ITokenManager {
  generate (id: string): string {
    return jsonwebtoken.sign({ id }, config.json.secret, { expiresIn: '12h' })
  }

  isValid (token: string): boolean {
    try {
      jsonwebtoken.verify(token, config.json.secret)
      return true
    } catch (error) {
      if (error != null) {
        return false
      }
      return true
    }
  }
}

export default TokenManager
