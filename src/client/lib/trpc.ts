import { createTRPCClient, httpBatchStreamLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "../../server/trpc";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchStreamLink({
      url: "/trpc",
      transformer: superjson,
    }),
  ],
});
