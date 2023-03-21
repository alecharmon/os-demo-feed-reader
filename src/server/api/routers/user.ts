/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  UserContext,
} from "~/server/api/trpc";

export const UserRouter = createTRPCRouter({
  addOneSignalUserIDToUser: protectedProcedure
    .input(z.object({ onesingalUserID: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const internalUserID = UserContext.parse(ctx.session.user).id;
      const newFeed = await ctx.prisma.user.update({
        where: {
          id: internalUserID,
        },
        data: {
          id: internalUserID,
          osUserId: input.onesingalUserID,
        },
      });
      return newFeed;
    }),
});
