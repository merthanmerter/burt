import { createFileRoute } from "@tanstack/react-router";
import { CopyIcon } from "lucide-react";
import { Suspense } from "react";
import { toast } from "sonner";
import { APITester } from "@/components/api-tester";
import { GitHubStars } from "@/components/github-stars";
import LogoArea from "@/components/logo-area";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
	beforeLoad: ({ context }) => {
		context.queryClient.prefetchQuery(context.trpc.users.list.queryOptions());
		context.queryClient.prefetchQuery(
			context.trpc.users.find.queryOptions({ id: 1 }),
		);
	},
	component: Page,
});

function Page() {
	return (
		<div className="mt-16 max-w-lg mx-auto">
			<LogoArea />
			<Suspense
				fallback={
					<div className="space-y-4">
						<Skeleton className="h-[36px]" />
						<Skeleton className="h-[36px]" />
						<Skeleton className="h-[36px]" />
						<Skeleton className="h-[98px]" />
						<Skeleton className="h-[218px]" />
					</div>
				}
			>
				<APITester />
			</Suspense>
			<div className="mt-4 text-xs text-muted-foreground font-mono space-y-2 p-4 bg-muted/50 rounded-md relative border">
				<Button
					variant="outline"
					size="icon"
					className="absolute top-2 right-2 z-10 dark:bg-border dark:hover:bg-border"
					onClick={() => {
						navigator.clipboard.writeText(TERMINAL_CODE);
						toast.success("Copied to clipboard", {
							description: "Paste it in your terminal",
						});
					}}
				>
					<CopyIcon className="size-4" />
				</Button>
				<pre className="overflow-x-auto">{TERMINAL_CODE}</pre>
			</div>
			<div className="flex justify-end mt-4">
				<GitHubStars />
			</div>
		</div>
	);
}

const TERMINAL_CODE = `curl -fsSL https://bun.sh/install | bash
bun -v
git clone https://github.com/merthanmerter/burt
cd burt
bun install
bun dev
`;
