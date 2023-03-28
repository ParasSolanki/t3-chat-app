import { TRPCError } from "@trpc/server";
import { authSchema } from "~/common/validations/auth";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import bcryptjs from "bcryptjs";

export const authRouter = createTRPCRouter({
  signup: publicProcedure.input(authSchema).mutation(async ({ input }) => {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (user)
      throw new TRPCError({ code: "CONFLICT", message: "User already exists" });

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(input.password, salt);

    try {
      await prisma.user.create({
        data: {
          email: input.email,
          password: {
            create: {
              hash: hashedPassword,
            },
          },
        },
      });
    } catch (error) {
      console.log({ error });
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }

    return { ok: true };
  }),
});
