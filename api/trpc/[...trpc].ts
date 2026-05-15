import { handleTrpc } from "../../src/server/trpc";

export default {
	async fetch(req: Request) {
		return handleTrpc(req);
	},
};
