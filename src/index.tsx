import { serve } from "bun";
import index from "./index.html";
import trpcServer from "./server/trpc";

const server = serve({
	port: 3000,
	routes: {
		"/*": index,
		"/trpc/*": trpcServer.fetch,
	},
	development: process.env.NODE_ENV !== "production" && {
		hmr: true,
		console: true,
	},
});

console.log(`🚀 ${process.env.NODE_ENV} server running at ${server.url}`);
