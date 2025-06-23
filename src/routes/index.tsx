import { APITester } from "@/components/api-tester";

import LogoArea from "@/components/logo-area";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      context.trpc.users.list.queryOptions(),
    );
    await context.queryClient.prefetchQuery(
      context.trpc.users.find.queryOptions({ id: 1 }),
    );
  },
  component: () => (
    <div>
      <LogoArea />
      <Suspense
        fallback={
          <div className='skeleton-container'>
            <div className='skeleton' />
            <div className='skeleton' />
            <div className='skeleton' />
            <div className='skeleton' />
            <div className='skeleton' />
          </div>
        }>
        <APITester />
      </Suspense>
    </div>
  ),
});
