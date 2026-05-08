import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter, createContext } from "../../src/server/trpc";

export default {
	async fetch(req: Request) {
		return fetchRequestHandler({
			endpoint: "/api/trpc",
			req,
			router: appRouter,
			createContext,
		});
	},
};
