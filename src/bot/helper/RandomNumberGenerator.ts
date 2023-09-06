import type IRandomNumberGenerator from '../interface/IRandomNumberGenerator'

class RandomNumberGenerator implements IRandomNumberGenerator {
  generate (minimum: number, maximum: number): number {
    minimum = Math.ceil(minimum)
    maximum = Math.floor(maximum)
    return Math.floor(Math.random() * (maximum - minimum + 1) + minimum)
  }
}

export default RandomNumberGenerator
