import { APITester } from "@/components/api-tester";

import LogoArea from "@/components/logo-area";
import { createRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { rootRoute } from "./_root";
export const indexRoute = createRoute({
  beforeLoad: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      context.trpc.users.list.queryOptions(),
    );
    await context.queryClient.prefetchQuery(
      context.trpc.users.find.queryOptions({ id: 1 }),
    );
  },
  getParentRoute: () => rootRoute,
  path: "/",
  component: function Index() {
    return (
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
    );
  },
});
