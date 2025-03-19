class WebSocket {
  private readonly server: WebSocketServer;
  private readonly clients = new Map<WebSocket, number>()

  constructor(private readonly postgresDataSource: PostgresDataSource) {
    this.server = new WebSocketServer({ port: 5000 });
  }

  async start(): Promise<void> {
    try {
      const databaseClient = await this.postgresDataSource.getClient();
      await databaseClient.query('UNLISTEN *');
      await databaseClient.query('LISTEN table_changes');

      databaseClient.on('notification', (msg) => {
        try {
          const payload = JSON.parse(msg.payload as string);
          this.notifyClients(payload);
        } catch (error) {
          console.error('Erro ao processar notificação:', error);
        }
      });

      this.server.on('connection', (ws) => {
        ws.on('message', (data) => this.handleClientMessage(ws, data.toString()));
        ws.on('close', () => this.clients.delete(ws)); // Remove cliente quando desconectar
      });

      console.log('Servidor WebSocket rodando na porta 5000');
    } catch (error) {
      console.error('Erro ao iniciar o WebSocket:', error);
      throw error;
    }
  }

  private handleClientMessage(ws: WebSocket, message: string): void {
    try {
      const data = JSON.parse(message);
      if (data.type === 'subscribe' && typeof data.itemId === 'number') {
        this.clients.set(ws, data.itemId);
        ws.send(JSON.stringify({ type: 'subscribed', itemId: data.itemId }));
      }
    } catch (error) {
      console.error('Erro ao processar mensagem do cliente:', error);
    }
  }

  private notifyClients(payload: any): void {
    this.clients.forEach((itemId, client) => {
      if (payload.new?.id === itemId || payload.old?.id === itemId) {
        client.send(JSON.stringify({
          operation: payload.operation,
          table: payload.table,
          newData: payload.new,
          oldData: payload.old,
          timestamp: new Date().toISOString(),
        }));
      }
    });
  }
}

export default WebSocket;
