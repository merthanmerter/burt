import { serveStatic } from "hono/bun";
import app from "./server/app";

// Serve static files from public directory
app.use("/*", serveStatic({ root: "./public" }));

// SPA fallback - serve index.html for all other routes
app.get("*", serveStatic({ path: "./public/index.html" }));

// For local development with Bun
const server = Bun.serve({
	port: 3000,
	fetch: app.fetch,
});

console.log(`🚀 Server running at http://localhost:${server.port}`);
