// importando interfaces
import type IApi from './interface/IApi'
import { type Server } from 'http'

import config from '../config'
import type IApp from './interface/IApp'

class App implements IApp {
  listener: Server
  hasStarted: boolean = false
  constructor (readonly api: IApi, listener: Server) {
    this.listener = listener
  }

  start (): void {
    this.listener = this.api.server.listen(config.api.port, () => {
      console.log('Servidor inicializado na porta', config.api.port)
    })
  }

  stop (): void {
    this.listener.close()
  }
}

export default App
