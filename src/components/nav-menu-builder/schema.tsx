import { z } from "zod";

export const baseMenuItemSchema = z.object({
  name: z
    .string({ required_error: "Nazwa jest wymagana." })
    .min(1, { message: "Nazwa nie może być pusta." }),
  link: z.string().optional(),
});

export type BaseMenuItem = z.infer<typeof baseMenuItemSchema>;
