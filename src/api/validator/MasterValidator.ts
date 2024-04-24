class MasterValidator {
  isMasterValid (message: unknown): boolean {
    if (message === '' || message === undefined || message === null) {
      return false
    } else {
      return true
    }
  }
}

export default MasterValidator
