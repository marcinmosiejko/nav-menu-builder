import { z } from "zod";
import { generateRandomId } from "./utils";

export const baseMenuItemSchema = z.object({
  id: z.string(),
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
export type MenuItemPath = "items.0";

const emptyMenuItem = {
  name: "",
  link: "",
  items: [],
};
export const getEmptyMenuItem = () => ({
  ...emptyMenuItem,
  id: generateRandomId(12),
});
