// importando interfaces
import { type Server } from 'http'

import config from '../config'
import type Api from '../helper/Api'

class App {
  listener: Server
  hasStarted: boolean = false
  constructor (readonly api: Api, listener: Server) {
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
