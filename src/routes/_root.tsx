import githubLogo from "@/components/logo/github.svg";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { TRPCProxyClient } from "@/lib/trpc-client";
import { QueryClient } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export type RootContext = {
  queryClient: QueryClient;
  trpc: TRPCProxyClient;
};
export const rootRoute = createRootRouteWithContext<RootContext>()({
  head: () => ({
    meta: [
      {
        title: "Burt",
      },
      // {
      //   name: "viewport",
      //   content: "width=device-width, initial-scale=1.0",
      // },
      // {
      //   name: "description",
      //   content:
      //     "A modern React application built with Bun, TanStack Router, and tRPC",
      // },
      // {
      //   name: "theme-color",
      //   content: "#000000",
      // },
      // {
      //   rel: "icon",
      //   href: "/favicon.ico",
      // },
      // {
      //   rel: "stylesheet",
      //   href: "/output.css",
      // },
    ],
  }),
  component: () => (
    <>
      <HeadContent />
      <div className='mb-auto p-2.5 bg-muted/20 w-full border-b space-x-3 flex items-center'>
        <Link
          to='/'
          className='[&.active]:font-bold'>
          Home
        </Link>{" "}
        <Link
          to='/about'
          className='[&.active]:font-bold'>
          About
        </Link>
        <div className='ml-auto flex items-center gap-2'>
          <Button
            variant='outline'
            size='icon'
            asChild>
            <a
              href='https://github.com/merthanmerter/bun-react-trpc/tree/v2'
              target='_blank'
              className=''>
              <img
                src={githubLogo}
                alt='GitHub Logo'
                className='size-5 hover:scale-110 transition-transform duration-200 dark:invert'
              />
            </a>
          </Button>
          <ModeToggle />
        </div>
      </div>
      <div className='app'>
        <Outlet />
        <TanStackRouterDevtools />
      </div>
    </>
  ),
});
