import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("Email is not valid"),
  password: z
    .string()
    .min(8, "Password must contain at least 8 character(s)")
    .max(10, "Password must contain at most 10 character(s)"),
});
