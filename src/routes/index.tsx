import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { APITester } from "@/components/api-tester";
import LogoArea from "@/components/logo-area";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
	beforeLoad: ({ context }) => {
		context.queryClient.prefetchQuery(context.trpc.users.list.queryOptions());
		context.queryClient.prefetchQuery(
			context.trpc.users.find.queryOptions({ id: 1 }),
		);
	},
	component: () => (
		<div>
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
		</div>
	),
});
