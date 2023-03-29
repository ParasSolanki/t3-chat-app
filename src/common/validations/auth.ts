import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().email("Email is not valid"),
  password: z
    .string()
    .min(8, "Password must contain at least 8 character(s)")
    .max(10, "Password must contain at most 10 character(s)"),
});

export const signupSchema = signinSchema.extend({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must contain at most 50 character(s)"),
});
