"use client";

import { Button } from "@/components/button";
import ArrowLeftIcon from "@/components/icons/arrow-left-icon";
import PlusIcon from "@/components/icons/plus-icon";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/form";
import { useMenuItemsArray } from "./useMenuItemsArray";
import { MenuItemBaseFields } from "./MenuItemBaseFields";
import { MenuItem } from "./MenuItem";

export const baseMenuItemSchema = z.object({
  name: z
    .string({ required_error: "Nazwa jest wymagana." })
    .min(1, { message: "Nazwa nie może być pusta." }),
  link: z.string().optional(),
});
const menuItemsSchema: z.ZodType<MenuItem> = baseMenuItemSchema.extend({
  items: z.lazy(() => menuItemsSchema.array()),
});
export type BaseMenu = z.infer<typeof baseMenuItemSchema>;
export type MenuItem = BaseMenu & {
  items: MenuItem[];
};
const menuSchema: z.ZodType<MenuItem> = baseMenuItemSchema.extend({
  items: z.lazy(() => menuSchema.array()),
});
export type MenuItems = z.infer<typeof menuItemsSchema>;

export default function Home() {
  const form = useForm<MenuItems>({
    mode: "onChange",
    reValidateMode: "onChange",
    shouldFocusError: false,
    resolver: zodResolver(menuItemsSchema),
    defaultValues: {
      name: "",
      link: "",
      items: [],
    },
  });
  const { getValues } = form;
  const { fields, appendItem, removeItem } = useMenuItemsArray(form);

  const onSubmit = (values: z.infer<typeof menuItemsSchema>) => {};
  const hasItems = !!getValues().items.length;

  return (
    <div className="flex flex-col gap-6">
      <nav>
        <Button variant="neutral" className="px-0">
          <ArrowLeftIcon />
          Wróć do listy nawigacji
        </Button>
      </nav>

      <h1 className="text-2xl font-bold">Dodaj nawigację</h1>
      <Form {...form}>
        <form
          className="flex flex-col gap-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="bg-background border-border flex flex-col gap-4 rounded-md border p-6">
            <h2 className="font-semibold">Nazwa</h2>
            <MenuItemBaseFields
              nameFieldProps={{
                label: "Menu",
                placeholder: "np. Menu główne",
                name: "name",
              }}
              linkFieldProps={{ name: "link" }}
            />
          </div>
          <div className="bg-background border-border flex flex-col gap-4 rounded-md border p-6">
            <h2 className="font-semibold">Pozycje menu</h2>
            <div className="bg-background-secondary border-border flex flex-col items-center justify-center gap-4 rounded-md border">
              {hasItems ? (
                <div className="w-full">
                  {fields.map((field, index) => (
                    <div className="w-full" key={field.id}>
                      <MenuItem
                        path={`items.${index}` as "items.0"}
                        removeItem={removeItem(index)}
                      />
                    </div>
                  ))}
                  <div className="bg-background-tertiary border-border-secondary rounded-md rounded-t-none border-t">
                    <Button
                      className="m-6"
                      variant="secondary"
                      onClick={appendItem}
                    >
                      Dodaj pozycję menu
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 py-6 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-sm font-semibold">
                      Menu jest puste
                    </span>
                    <span className="text-xs">
                      W tym menu nie ma jeszcze żadnych linków
                    </span>
                  </div>
                  <Button variant="primary" onClick={appendItem}>
                    <PlusIcon />
                    Dodaj pozycję menu
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="reset" variant="secondary">
              Anuluj
            </Button>
            <Button type="submit" variant="primary">
              Zapisz
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
