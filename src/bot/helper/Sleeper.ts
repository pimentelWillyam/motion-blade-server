
class Sleeper {
  async sleep (miliseconds: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, miliseconds))
  }
}

export default Sleeper
