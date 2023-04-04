import { TRPCError } from "@trpc/server";
import { createChannelSchema } from "~/common/validations/channel";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const channelRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createChannelSchema)
    .mutation(async ({ input, ctx }) => {
      const uniqueChannel = await ctx.prisma.channel.findUnique({
        where: {
          name: input.name,
          createdById: ctx.session.user.id,
        },
      });

      if (uniqueChannel) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Channel with name already exists",
        });
      }

      const channel = await ctx.prisma.channel.create({
        data: {
          name: input.name,
          description: input.description,
          createdById: ctx.session.user.id,
          members: {
            create: {
              role: "ADMIN",
              userId: ctx.session.user.id,
            },
          },
        },
      });

      return { ok: true, channel };
    }),
});
