import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter, createContext } from "./server/trpc";

Bun.serve({
	port: 3000,
	async fetch(req) {
		const path = new URL(req.url).pathname;

		// API
		if (path.startsWith("/api/trpc")) {
			return fetchRequestHandler({
				endpoint: "/api/trpc",
				req,
				router: appRouter,
				createContext,
			});
		}

		// Static files
		const file = Bun.file(`./public${path}`);
		if (await file.exists()) return new Response(file);

		// SPA fallback
		return new Response(Bun.file("./public/index.html"));
	},
});
