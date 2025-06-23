import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import superjson from "superjson";

export const queryClient = new QueryClient({
  defaultOptions: {
    hydrate: {
      deserializeData: superjson.deserialize,
    },
    dehydrate: {
      serializeData: superjson.serialize,
      shouldDehydrateQuery: (query) =>
        defaultShouldDehydrateQuery(query) || query.state.status === "pending",
    },
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});
