import { createFileRoute } from "@tanstack/react-router";
import { LoaderIcon } from "lucide-react";
import { Suspense } from "react";
import ReadmeMarkdown from "@/components/readme-markdown";

export const Route = createFileRoute("/readme")({
	head: () => ({
		meta: [
			{
				title: "Burt - Readme",
				description: "Readme for Burt",
			},
		],
	}),
	beforeLoad: ({ context }) => {
		context.queryClient.prefetchQuery(context.trpc.readme.queryOptions());
	},
	component: Page,
});

function Page() {
	return (
		<>
			<Suspense
				fallback={
					<div className="flex items-center justify-center min-h-96">
						<LoaderIcon className="size-8 animate-spin text-muted-foreground" />
					</div>
				}
			>
				<ReadmeMarkdown />
			</Suspense>
		</>
	);
}
