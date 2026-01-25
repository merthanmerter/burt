import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Hono } from "hono";
import { appRouter, createContext } from "./server/trpc";

const app = new Hono();

// API routes
app.all("/api/trpc/*", async (c) => {
	return fetchRequestHandler({
		endpoint: "/api/trpc",
		req: c.req.raw,
		router: appRouter,
		createContext,
	});
});

// For local development with Bun
const server = Bun.serve({
	port: 3000,
	async fetch(req) {
		const url = new URL(req.url);

		// Handle API routes with Hono
		if (url.pathname.startsWith("/api/")) {
			return app.fetch(req);
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
