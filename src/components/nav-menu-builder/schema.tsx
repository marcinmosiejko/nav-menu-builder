import { z } from "zod";

export const baseMenuItemSchema = z.object({
  name: z
    .string({ required_error: "Nazwa jest wymagana." })
    .min(1, { message: "Nazwa nie może być pusta." }),
  link: z.string().optional(),
});
export const menuItemsSchema: z.ZodType<MenuItem> = baseMenuItemSchema.extend({
  items: z.lazy(() => menuItemsSchema.array()),
});

export type BaseMenu = z.infer<typeof baseMenuItemSchema>;
export type MenuItem = BaseMenu & {
  items: MenuItem[];
};
export type MenuItemsPath = "items.0";
export type MenuItems = z.infer<typeof menuItemsSchema>;
