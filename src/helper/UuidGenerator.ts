import { v4 as uuidv4 } from 'uuid'

class IUuidGenerator implements IUuidGenerator {
  generate (): string {
    return uuidv4()
  }
}

export default IUuidGenerator
