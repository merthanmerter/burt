const clients = new Set<Bun.ServerWebSocket<unknown>>();

export default {
  open(ws) {
    clients.add(ws);
    console.log(`Client connected. Total clients: ${clients.size}`);
  },
  async message(_, message) {
    console.log(`Received: ${message}`);
    const broadcastMessage = `You said: ${message}`;
    for (const client of clients) {
      if (client.readyState === 1) {
        client.send(broadcastMessage);
      }
    }
  },
  close(ws) {
    clients.delete(ws);
    console.log(`Client disconnected. Total clients: ${clients.size}`);
  },

  perMessageDeflate: true,
} satisfies Bun.WebSocketHandler<unknown>;
