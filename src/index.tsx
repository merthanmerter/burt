import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { appRouter, createContext } from "./server/trpc";

const app = new Hono();

// 1. API routes first (before static middleware)
app.all("/api/trpc/*", async (c) => {
	return fetchRequestHandler({
		endpoint: "/api/trpc",
		req: c.req.raw,
		router: appRouter,
		createContext,
	});
});

// 2. Serve static files from public directory
app.use("/*", serveStatic({ root: "./public" }));

// 3. SPA fallback - serve index.html for client-side routing
app.get("*", serveStatic({ path: "./public/index.html" }));

// For local development with Bun
const server = Bun.serve({
	port: 3000,
	fetch: app.fetch,
});

console.log(`🚀 Server running at http://localhost:${server.port}`);
