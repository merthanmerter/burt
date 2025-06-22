import { serve } from "bun";
import index from "./client/index.html";
import trpcServer from "./server/trpc";

const server = serve({
  fetch: (req, server) => {
    if (new URL(req.url).pathname === "/ws") {
      server.upgrade(req);
      return undefined;
    }
    return fetch(req);
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

console.log(`🚀 ${process.env.NODE_ENV} server running at ${server.url}`);
