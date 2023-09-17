class ServantService {
  constructor (readonly ServantRepository: IServantRepository, readonly uuidGenerator: IUuidGenerator, readonly dateManager: IDateManager) {}

  async create (message: string): Promise<IServantEntity> {
    return await this.ServantRepository.create(this.uuidGenerator.generate(), message, this.dateManager.getCurrentDateTime())
  }

  async getAll (): Promise<IServantEntity[]> {
    return await this.ServantRepository.getAll()
  }

  async get (id: string): Promise<IServantEntity | null> {
    return await this.ServantRepository.get(id)
  }
}

export default ServantService
