import { v4 as uuidv4 } from 'uuid'

class UuidGenerator {
  generate (): string {
    return uuidv4()
  }
}

export default UuidGenerator
