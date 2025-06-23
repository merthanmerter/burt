import type { AppRouter } from "@/server/trpc";
import { createTRPCClient, httpBatchStreamLink } from "@trpc/client";
import {
  createTRPCContext,
  createTRPCOptionsProxy,
} from "@trpc/tanstack-react-query";
import transformer from "superjson";
import { queryClient } from "./query-client";

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchStreamLink({
      url: "/trpc",
      transformer,
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();

export type TRPCProxyClient = typeof trpc;
