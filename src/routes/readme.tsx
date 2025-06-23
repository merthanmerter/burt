import { createFileRoute } from "@tanstack/react-router";
import { LoaderIcon } from "lucide-react";
import { Suspense } from "react";
import ReadmeMarkdown from "@/components/readme-markdown";

export const Route = createFileRoute("/readme")({
	beforeLoad: async ({ context }) => {
		context.queryClient.prefetchQuery(context.trpc.readme.queryOptions());
	},
	component: Readme,
	head: () => ({
		meta: [
			{
				title: "Burt - Readme",
				description: "Readme for Burt",
			},
		],
	}),
});

function Readme() {
	return (
		<div className="p-4 max-w-4xl mx-auto">
			<Suspense
				fallback={
					<LoaderIcon className="size-8 animate-spin text-muted-foreground" />
				}
			>
				<ReadmeMarkdown />
			</Suspense>
		</div>
	);
}
