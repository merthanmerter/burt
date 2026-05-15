import { handleTrpc } from "@/server/trpc";
import index from "./index.html";

const port = Number(process.env.PORT ?? 3000);

Bun.serve({
	port,
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

console.log(`→ http://localhost:${port}`);
