import { serve } from "bun";
import index from "./index.html";
// import trpcServer from "./server/trpc";

// import websocket from "./server/ws";

const server = serve({
	port: 3000,
	routes: {
		"/*": index,
	},
	// websocket,
	development: process.env.NODE_ENV !== "production" && {
		hmr: true,
		console: true,
	},
});

console.log(`🚀 ${process.env.NODE_ENV} server running at ${server.url}`);
