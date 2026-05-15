import { handleTrpc } from "@/server/trpc";

export default function handler(req: Request) {
	return handleTrpc(req);
}
