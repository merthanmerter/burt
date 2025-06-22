import { initTRPC } from "@trpc/server";
import {
  fetchRequestHandler,
  type FetchCreateContextFnOptions,
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

export const appRouter = t.router({
  hello: t.procedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(({ input }) => {
      return z
        .object({
          message: z.string(),
        })
        .parse({ message: `Hello, ${input.name}` });
    }),
  getUsers: t.procedure.query(({ ctx }) => {
    return z
      .array(
        z.object({
          id: z.number(),
          name: z.string(),
        }),
      )
      .parse(ctx.db.query("SELECT * FROM users").all());
  }),
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
