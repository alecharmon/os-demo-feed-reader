import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { RssReaderRouter } from "./routers/rssFeed";
import { UserRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  rssFeed: RssReaderRouter,
  user: UserRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
