import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(1).max(25),
  slug: z
    .string()
    .min(1)
    .max(15)
    .regex(/^[0-9a-zA-Z]*$/),
  content: z.string().min(1),
});
