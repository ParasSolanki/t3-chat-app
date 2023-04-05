import { TRPCError } from "@trpc/server";
import { createChannelSchema } from "~/common/validations/channel";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const channelRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.channel.findMany({
      where: {
        members: {
          some: { userId: ctx.session.user.id },
        },
      },
    });
  }),
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
          createdBy: {
            connect: {
              id: ctx.session.user.id,
              username: ctx.session.user.username,
            },
          },
          members: {
            create: {
              role: "ADMIN",
              user: {
                connect: {
                  id: ctx.session.user.id,
                  username: ctx.session.user.username,
                },
              },
            },
          },
        },
      });

      return { ok: true, channel };
    }),
});
