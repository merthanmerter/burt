import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import index from "./index.html";
import { appRouter, createContext } from "./server/trpc";

function handleTrpc(req: Request) {
	return fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,
		createContext,
	});
}

Bun.serve({
	port: Number(process.env.PORT ?? 3000),
	routes: {
		"/api/trpc": handleTrpc,
		"/api/trpc/*": handleTrpc,
		"/": index,
		"/*": index,
	},
	development:
		process.env.NODE_ENV !== "production"
			? { hmr: true, console: true }
			: false,
});
