import { WebSocketServer, OPEN } from 'ws'
import { type PostgresDataSource } from '../data/PostgresDataSource'

class WebSocket {
  private readonly server: WebSocketServer

  constructor(private readonly postgresDataSource: PostgresDataSource) {
    this.server = new WebSocketServer({ port: 5000 })
  }

  async start(): Promise<void> {
    try {
      const databaseClient = await this.postgresDataSource.getClient()
      await databaseClient.query('UNLISTEN *')
      await databaseClient.query('LISTEN table_changes')

      databaseClient.on('notification', (msg) => {
        try {
          const payload = JSON.parse(msg.payload as string)
          this.broadcast(JSON.stringify({
            operation: payload.operation,
            table: payload.table,
            newData: payload.new,
            oldData: payload.old,
            timestamp: new Date().toISOString()
          }))
        } catch (error) {
          console.error('Erro ao processar notificação:', error)
        }
      })

      this.server.on('connection', (ws) => {
        ws.send(JSON.stringify({ type: 'connection', message: 'Conectado', timestamp: new Date().toISOString() }))

        ws.on('message', (data) => {
          ws.send(JSON.stringify({ type: 'echo', message: data.toString(), timestamp: new Date().toISOString() }))
        })
      })

      console.log('Servidor WebSocket rodando na porta 5000')
    } catch (error) {
      console.error('Erro ao iniciar o WebSocket:', error)
      throw error
    }
  }

  private broadcast(message: string): void {
    this.server.clients.forEach(client => {
      if (client.readyState === OPEN) {
        client.send(message)
      }
    })
  }
}

export default WebSocket
