/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const UserContext = z.object({
  id: z.string(),
});

export const RssReaderRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ url: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      const newFeed = await ctx.prisma.rssFeed.create({
        data: {
          userId: ctx.session.user.id,
          url: input.url,
        },
      });
      return newFeed;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const newFeed = await ctx.prisma.rssFeed.findMany({
      where: {
        userId: UserContext.parse(ctx.session.user).id,
      },
    });
    return newFeed;
  }),
});
