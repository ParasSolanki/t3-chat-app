import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { authRouter } from "~/server/api/routers/auth";
import { channelRouter } from "~/server/api/routers/channel";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  auth: authRouter,
  channel: channelRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
