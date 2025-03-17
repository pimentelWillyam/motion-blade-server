import { WebSocketServer, OPEN } from 'ws'
import { type PostgresDataSource } from '../data/PostgresDataSource'

class WebSocket {
  private readonly server: WebSocketServer
  constructor (private readonly postgresDataSource: PostgresDataSource) {
    this.server = new WebSocketServer({ port: 5000 })
  }

  async start (): Promise<void> {
    try {
      const databaseClient = await this.postgresDataSource.getClient()
      console.log('Cliente do banco de dados obtido')

      // Verificar estado da conexão

      // Reconectar para garantir
      await databaseClient.connect()
      console.log('Conexão estabelecida com o banco de dados')

      // Verificar se o LISTEN está funcionando
      await databaseClient.query('UNLISTEN *') // Limpa todos os listeners anteriores
      await databaseClient.query('LISTEN table_changes')
      console.log('Listening no canal table_changes')

      // Testar notificação
      await databaseClient.query(`
        DO $$
        BEGIN
          PERFORM pg_notify('table_changes', '{"operation":"TEST","table":"test","new":{"message":"test"},"old":null}');
        END $$;
      `)
      console.log('Notificação de teste enviada')

      // Adicionar verificação dos triggers ativos
      const triggersResult = await databaseClient.query(`
        SELECT 
          tgname, 
          tgrelid::regclass as table_name,
          tgenabled,
          tgtype,
          tgfoid::regproc as function_name
        FROM pg_trigger 
        WHERE tgname LIKE '%changes_trigger';
      `)
      console.log('Triggers ativos:', JSON.stringify(triggersResult.rows, null, 2))

      // Verificar função de notificação
      const functionResult = await databaseClient.query(`
        SELECT 
          p.proname as function_name,
          p.provolatile,
          p.prosrc as source_code
        FROM pg_proc p
        WHERE p.proname = 'notify_table_change';
      `)
      console.log('Função de notificação:', JSON.stringify(functionResult.rows, null, 2))

      databaseClient.on('notification', (msg) => {
        try {
          console.log('\n=== Nova Notificação ===')
          console.log('Notificação bruta recebida:', msg)
          const payload = JSON.parse(msg.payload as string)
          console.log('Notificação processada:', {
            canal: msg.channel,
            operacao: payload.operation,
            tabela: payload.table,
            dados: payload.new ?? payload.old
          })

          const message = {
            operation: payload.operation,
            table: payload.table,
            newData: payload.new,
            oldData: payload.old,
            timestamp: new Date().toISOString()
          }

          this.broadcast(JSON.stringify(message))
        } catch (error) {
          console.error('\n=== Erro na Notificação ===')
          console.error('Erro ao processar notificação:', error)
          console.error('Payload recebido:', msg.payload)
        }
      })

      this.server.on('connection', (ws) => {
        console.log('\n=== Nova Conexão WebSocket ===')
        console.log('Novo cliente conectado ao WebSocket')
        console.log('Total de clientes:', this.server.clients.size)

        ws.send(JSON.stringify({
          type: 'connection',
          message: 'Conectado ao servidor WebSocket',
          timestamp: new Date().toISOString()
        }))

        // Monitorar desconexão
        ws.on('close', () => {
          console.log('\n=== Cliente Desconectado ===')
          console.log('Total de clientes restantes:', this.server.clients.size)
        })
      })

      console.log('\n=== Servidor Iniciado ===')
      console.log('Servidor WebSocket rodando na porta 5000')
      console.log('Aguardando conexões...')
    } catch (error) {
      console.error('\n=== Erro de Inicialização ===')
      console.error('Erro ao iniciar o WebSocket:', error)
      throw error // Propagar o erro para saber se falhou na inicialização
    }
  }

  private broadcast (message: string): void {
    console.log('\n=== Broadcasting ===')
    console.log('Transmitindo mensagem para', this.server.clients.size, 'clientes')
    this.server.clients.forEach(client => {
      if (client.readyState === OPEN) {
        client.send(message)
      }
    })
  }
}

export default WebSocket
