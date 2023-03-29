import crypto from "crypto";
import bcryptjs from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { signupSchema } from "~/common/validations/auth";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { z } from "zod";

function generateRandomUsernameFromEmail(
  email: Pick<z.infer<typeof signupSchema>, "email">["email"]
) {
  // Retrieve name from email address
  const nameParts = email.replace(/@.+/, "");
  // Replace all special characters like "@ . _ ";
  const name = nameParts.replace(/[&/\\#,+()$~%._@'":*?<>{}]/g, "");

  const randomNumber = crypto.randomInt(1000, 9999).toString();

  return `${name}${randomNumber}`;
}

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(signupSchema)
    .mutation(async ({ input, ctx }) => {
      // TODO: this could also throw add error handling
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (user)
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });

      let randomUsername = "";

      while (true) {
        randomUsername = generateRandomUsernameFromEmail(input.email);

        try {
          const user = await ctx.prisma.user.findUnique({
            where: { username: randomUsername },
          });
          // if user does not exists with this username take this username
          if (!user) break;
        } catch (error) {
          console.log("Error generating random username", { error });
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
          });
        }
      }

      // TODO: this could also throw add error handling
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(input.password, salt);

      try {
        await ctx.prisma.user.create({
          data: {
            name: input.name,
            email: input.email,
            username: randomUsername,
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
