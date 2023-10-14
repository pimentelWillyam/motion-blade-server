import * as bcrypt from 'bcrypt'
import type ICrypto from '../api/interface/ICrypto'

class Crypto implements ICrypto {
  async getPasswordHash (passwordToHash: string): Promise<string> {
    return await bcrypt.hash(passwordToHash, 10)
  }

  async areTheyHashmatched (password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }
}
export default Crypto
