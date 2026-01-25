import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { appRouter, createContext } from "../src/server/trpc";

const app = new Hono().basePath("/api");

app.all("/trpc/*", async (c) => {
	return fetchRequestHandler({
		endpoint: "/api/trpc",
		req: c.req.raw,
		router: appRouter,
		createContext,
	});
});

export const config = {
	runtime: "edge",
};

export default handle(app);
