export const isPath = (path: string) => (req: Request) =>
  new URL(req.url).pathname === path;
