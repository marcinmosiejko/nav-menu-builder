"use client";

import { Button } from "@/components/button";
import ArrowLeftIcon from "@/components/icons/arrow-left-icon";
import PlusIcon from "@/components/icons/plus-icon";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/form";
import { useState } from "react";
import ArrowsCrossIcon from "@/components/icons/arrows-cross-icon";
import { cn } from "@/lib/utils";
import BinIcon from "@/components/icons/bin-icon";
import { useMenuItemsArray } from "./useItemsArray";
import { MenuItemBaseFields } from "./menu-items-base-fields";

const baseMenuItemSchema = z.object({
  name: z
    .string({ required_error: "Nazwa jest wymagana." })
    .min(1, { message: "Nazwa nie może być pusta." }),
  link: z.string().optional(),
});
type BaseMenuType = z.infer<typeof baseMenuItemSchema>;
export type MenuItem = z.infer<typeof baseMenuItemSchema> & {
  items: MenuItem[];
};
const menuSchema: z.ZodType<MenuItem> = baseMenuItemSchema.extend({
  items: z.lazy(() => menuSchema.array()),
});
export type MenuItems = z.infer<typeof menuSchema>;

export default function Home() {
  const form = useForm<z.infer<typeof menuSchema>>({
    mode: "onChange",
    resolver: zodResolver(menuSchema),
    defaultValues: {
      name: "",
      link: "",
      items: [],
    },
  });

  const { fields, appendItem, removeItem } = useMenuItemsArray(form);
  const hasItems = !!form.getValues().items.length;
  const onSubmit = (values: z.infer<typeof menuSchema>) => {};

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
                        form={form}
                        path={`items.${index}`}
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

const MenuItem = ({
  form,
  path,
  removeItem,
}: {
  form: UseFormReturn<MenuItem, unknown, undefined>;
  path: string;
  removeItem?: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(true);
  const [valueBeforeEditing, setValueBeforeEditing] =
    useState<BaseMenuType | null>(null);
  const {
    fields,
    appendItem,
    removeItem: removeChildItem,
  } = useMenuItemsArray(form, path);

  const value = form.getValues(path as `items.0`);
  const parentItemsCount =
    form.getValues(
      (path.split(".").slice(0, -2).join(".") || undefined) as `items.0`,
    ).items?.length || 1;
  const depth = path.split(".").length / 2;
  const itemIndex = Number(path.split(".").at(-1)!);
  const isItemFirst = itemIndex === 0;
  const isItemLast = itemIndex === parentItemsCount - 1;
  const hasChildren = !!form.getValues((path || undefined) as `items.0`).items
    .length;
  const isErrored = !!form.getFieldState(path as "items.0").error;
  return (
    <div className={cn("flex flex-col rounded-none", depth > 1 && "ml-16")}>
      {isEditing ? (
        <div
          className={cn(
            "bg-background border-border relative flex flex-col gap-4 rounded-md py-4 pl-6 pr-24",
            depth > 1 && "m-6 ml-0 border",
            depth === 1 && !isItemFirst && "m-6 border",
          )}
        >
          <div className="flex flex-col gap-2">
            <MenuItemBaseFields
              nameFieldProps={{
                label: "Nazwa",
                placeholder: "np. Promocje",
                name: `${path}.name` as `name`,
              }}
              linkFieldProps={{ name: `${path}.link` as `link` }}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                if (valueBeforeEditing) {
                  form.setValue(path as "items.0", {
                    ...valueBeforeEditing,
                    items: form.getValues(`${path}.items` as "items"),
                  });
                } else {
                  removeItem?.();
                }
                setIsEditing(false);
              }}
            >
              Anuluj
            </Button>
            <Button
              onClick={() => setIsEditing(false)}
              variant="secondary-color"
              disabled={isErrored}
            >
              {valueBeforeEditing ? "Zapisz" : "Dodaj"}
            </Button>
          </div>

          <Button
            onClick={removeItem}
            className="absolute right-10 top-6 fill-none hover:opacity-70"
            variant="plain"
          >
            <BinIcon />
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "bg-background border-border-secondary m-[-1px] flex items-center justify-between border py-4 pl-8 pr-6",
            depth === 1 && isItemFirst && "mt-0 rounded-t-md border-t-0",
            depth === 1 && "mx-0 border-x-0",
            depth > 1 && "mx-0 border-r-0",
            depth > 1 && (hasChildren || isItemLast) && "rounded-bl-md",
            hasChildren && "mb-0 border-b",
          )}
        >
          <div className="flex items-center gap-4">
            <ArrowsCrossIcon />
            <div className="flex flex-col gap-2 text-sm">
              <span className="font-semibold">{value?.name || ""}</span>
              <span className="text-foreground-tertiary">
                {value?.link || ""}
              </span>
            </div>
          </div>
          <div className="[&>button]:focus-visible:relative">
            <Button
              className="rounded-r-none border-r-transparent"
              onClick={() => {
                setIsEditing(true);
                setValueBeforeEditing({
                  name: value?.name || "",
                  link: value?.link || "",
                });
              }}
              variant="secondary"
            >
              Edytuj
            </Button>
            <Button
              className="rounded-none"
              onClick={removeItem}
              variant="secondary"
            >
              Usuń
            </Button>
            <Button
              className="rounded-l-none border-l-transparent"
              onClick={appendItem}
              variant="secondary"
            >
              Dodaj pozycję menu
            </Button>
          </div>
        </div>
      )}

      <div className="bg-background-secondary">
        {fields.map((field, index) => (
          <div key={field.id}>
            <MenuItem
              path={`${path}.items.${index}`}
              form={form}
              removeItem={removeChildItem(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
