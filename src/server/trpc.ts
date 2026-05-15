import { initTRPC } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import superjson from "superjson";
import { z } from "zod";
import { db } from "./db";

export function createContext({ req }: FetchCreateContextFnOptions) {
	return { req, db };
}

export const t = initTRPC
	.context<Awaited<ReturnType<typeof createContext>>>()
	.create({
		transformer: superjson,
	});

const middleware = t.middleware(async ({ type, path, next }) => {
	const start = Date.now();
	const result = await next();
	const end = Date.now();

	console.log(`[${type}] ${path} took ${end - start}ms`);

	return result;
});

export const publicProcedure = t.procedure.use(middleware);

export const appRouter = t.router({
	hello: publicProcedure
		.input(
			z.object({
				name: z.string(),
			}),
		)
		.mutation(({ input }) => {
			return z
				.object({
					message: z.string(),
				})
				.parse({ message: `Hello, ${input.name}` });
		}),
	readme: publicProcedure.query(async () => {
		const localReadme =
			typeof Bun === "undefined"
				? null
				: await Bun.file("README.md")
						.text()
						.catch(() => null);

		if (localReadme) return localReadme;

		const remoteReadme = await fetch(
			"https://raw.githubusercontent.com/merthanmerter/burt/main/README.md",
		)
			.then((res) => (res.ok ? res.text() : null))
			.catch(() => null);

		if (remoteReadme) return remoteReadme;

		return "README.md not available";
	}),
	users: {
		find: publicProcedure
			.input(z.object({ id: z.number() }))
			.query(({ ctx, input }) => {
				return z
					.object({
						id: z.number(),
						name: z.string(),
					})
					.parse(ctx.db.query().get(input.id));
			}),
		list: publicProcedure.query(({ ctx }) => {
			return z
				.array(
					z.object({
						id: z.number(),
						name: z.string(),
					}),
				)
				.parse(ctx.db.query().all());
		}),
	},
});

export type AppRouter = typeof appRouter;

/*
 * Centralized tRPC HTTP adapter for all API requests.
 *
 * We use `fetchRequestHandler` instead of manually wiring routes because it:
 *
 * - Bridges the native Fetch API request/response model with tRPC.
 * - Automatically handles procedure routing, batching, serialization,
 *   and response formatting.
 * - Keeps the API layer framework-agnostic and compatible with runtimes
 *   like Node.js, Bun, Cloudflare Workers, Vercel Edge, etc.
 * - Ensures type-safe communication between client and server through
 *   the shared `appRouter`.
 * - Creates a fresh request-scoped context (`createContext`) for every
 *   incoming request, allowing access to auth/session/database instances.
 * - Reduces boilerplate by avoiding custom request parsing and error handling.
 * - Provides a single entry point for all `/api/trpc` procedures,
 *   making middleware, logging, and future integrations easier to manage.
 */
export function handleTrpc(req: Request) {
	return fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,
		createContext,
	});
}
