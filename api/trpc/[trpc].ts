import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter, createContext } from '../../src/server/trpc';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request): Promise<Response> {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
  });
}