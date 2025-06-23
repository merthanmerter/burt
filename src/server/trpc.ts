import { initTRPC } from "@trpc/server";
import {
	type FetchCreateContextFnOptions,
	fetchRequestHandler,
} from "@trpc/server/adapters/fetch";
import superjson from "superjson";
import { z } from "zod";
import db from "./db";

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
		try {
			return await Bun.file("README.md").text();
		} catch {
			throw new Error("Failed to read README.md");
		}
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
					.parse(
						ctx.db.query("SELECT * FROM users WHERE id = ?").get(input.id),
					);
			}),
		list: publicProcedure.query(({ ctx }) => {
			return z
				.array(
					z.object({
						id: z.number(),
						name: z.string(),
					}),
				)
				.parse(ctx.db.query("SELECT * FROM users").all());
		}),
	},
});

export default {
	async fetch(req: Request): Promise<Response> {
		return fetchRequestHandler({
			endpoint: "/trpc",
			req,
			router: appRouter,
			createContext,
		});
	},
};

export type AppRouter = typeof appRouter;
