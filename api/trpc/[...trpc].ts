import { handleTrpc } from "@/server/trpc";

export default {
	async fetch(req: Request) {
		return handleTrpc(req);
	},
};
