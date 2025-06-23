import { useSuspenseQuery } from "@tanstack/react-query";
import { marked } from "marked";
import { useTRPC } from "@/lib/trpc-client";

export default function ReadmeMarkdown() {
	const trpc = useTRPC();
	const { data } = useSuspenseQuery(trpc.readme.queryOptions());
	const __html = marked(data);

	return (
		<div
			className="markdown"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Trusted content from our own README.md
			dangerouslySetInnerHTML={{ __html }}
		/>
	);
}
