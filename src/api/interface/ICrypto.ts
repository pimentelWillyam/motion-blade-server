interface ICrypto {
  getPasswordHash: (passwordToHash: string) => Promise<string>
  areTheyHashmatched: (password: string, hash: string) => Promise<boolean>
}

export default ICrypto
