import { serve } from "bun";
import index from "./client/index.html";
import trpcServer from "./server/trpc";

const server = serve({
  fetch(req, server) {
    // Switch the request to a WebSocket connection if valid
    const url = new URL(req.url);
    if (url.pathname === "/ws") {
      server.upgrade(req);
      return undefined;
    }
  },
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,
    // Serve trpc requests
    "/trpc/*": trpcServer.fetch,
  },
  websocket: {
    async message(ws, message) {
      console.log(`Received: ${message}`);
      ws.send(`You said: ${message}`);
    },
    perMessageDeflate: true,
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}, env:${process.env.NODE_ENV}`);
