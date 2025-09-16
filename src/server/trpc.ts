import { initTRPC } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
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

const middleware = t.middleware(async ({ next }) => {
	// simulate slow response
	// await new Promise((resolve) => setTimeout(resolve, 1000));
	return await next();
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
		const response = await fetch(
			"https://raw.githubusercontent.com/merthanmerter/burt/main/README.md",
		)
			.then((res) => (res.ok ? res.text() : null))
			.catch(() => null);

		if (response) return response;

		return await Bun.file("README.md")
			.text()
			.catch(() => "README.md not available");
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

// This is now handled by the Vercel API route at /api/trpc/[trpc].ts

export type AppRouter = typeof appRouter;
