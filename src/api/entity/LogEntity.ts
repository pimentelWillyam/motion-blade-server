import type ILogEntity from '../interface/ILogEntity'

class LogEntity implements ILogEntity {
  constructor (id: string, date: string, message: string) {
    this.id = id
    this.date = date
    this.message = message
  }

  id!: string
  date!: string
  message!: string
}

export default LogEntity
