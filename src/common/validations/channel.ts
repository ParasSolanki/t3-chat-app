import { z } from "zod";

export const createChannelSchema = z.object({
  name: z
    .string()
    .min(1, "Channel name is required")
    .max(30, "Channel name must contain at most 30 character(s)"),
  description: z
    .string()
    .max(200, "Description must contain at most 200 character(s)")
    .optional(),
});
