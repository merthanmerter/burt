import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter, createContext } from "./server/trpc";

const server = Bun.serve({
	port: 3000,
	async fetch(req) {
		const url = new URL(req.url);

		// Handle tRPC API routes
		if (url.pathname.startsWith("/api/trpc")) {
			return fetchRequestHandler({
				endpoint: "/api/trpc",
				req,
				router: appRouter,
				createContext,
			});
		}

		// Try to serve static file from public directory
		const filePath = `./public${url.pathname}`;
		const file = Bun.file(filePath);
		if (await file.exists()) {
			return new Response(file);
		}

		// SPA fallback - serve index.html for client-side routing
		return new Response(Bun.file("./public/index.html"), {
			headers: { "Content-Type": "text/html" },
		});
	},
});

console.log(`🚀 Server running at http://localhost:${server.port}`);
