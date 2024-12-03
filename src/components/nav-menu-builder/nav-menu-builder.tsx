"use client";

import { Button } from "@/components/button";
import PlusIcon from "@/components/icons/plus-icon";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/form";
import { useEffect, useState } from "react";
import { useMenuItemsArray } from "./useMenuItemsArray";
import { MenuItemBaseFields } from "./menu-item-base-fields";
import { MenuItem } from "./menu-item";
import { FormSubmitButtons } from "./form-submit-buttons";
import {
  type MenuItem as MenuItemT,
  type MenuItemPath,
  menuItemsSchema,
} from "./schema";
import { toast } from "sonner";
import {
  DnDSortableContextWrap,
  useSortsableExtended,
} from "./dnd-sorting-context-wrap";
import { getStateFromLocalStorage } from "@/lib/utils";

export const STORAGE_KEY = "menuItems";

const topMenuItemPath = "" as MenuItemPath;

export const NavMenuBuilder = () => {
  const form = useForm<MenuItemT>({
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
  const [isLoading, setIsLoading] = useState(true);
  const [preventEditingState, setPreventEditingState] = useState(true);

  const { reset, getValues } = form;
  const arrayField = useMenuItemsArray(form, topMenuItemPath);
  const { fields, appendEmptyItem, remove, swap } = arrayField;

  const onSubmit = (values: MenuItemT) => {
    setPreventEditingState(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    reset(values);
    setTimeout(() => {
      setPreventEditingState(false);
    }, 0);
    toast.success("Your changes have been successfully saved!");
  };

  const hasItems = !!getValues().items.length;

  useEffect(() => {
    const data = getStateFromLocalStorage<MenuItemT>(STORAGE_KEY);
    if (data) reset(data);
    setIsLoading(false);
    setTimeout(() => {
      setPreventEditingState(false);
    }, 0);
  }, [reset, setPreventEditingState]);

  const sortable = useSortsableExtended({
    id: topMenuItemPath,
  });

  // No skeleton for this as data loads too quickly for it to make sense. But it prevents from rendering empty form for a split second before the data comes in.
  if (isLoading) return null;

  return (
    <div className="space-y-6">
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
                  <DnDSortableContextWrap
                    fields={fields}
                    path={topMenuItemPath}
                    swap={swap}
                  >
                    {fields.map((field, index) => (
                      <div key={field.id} style={sortable.style}>
                        <MenuItem
                          key={field.id}
                          path={`items.${index}` as MenuItemPath}
                          removeItem={() => remove(index)}
                          preventEditingState={preventEditingState}
                        />{" "}
                      </div>
                    ))}
                  </DnDSortableContextWrap>
                  <div className="bg-background-tertiary border-border-secondary rounded-md rounded-t-none border-t">
                    <Button
                      className="m-6"
                      variant="secondary"
                      onClick={appendEmptyItem}
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
                  <Button variant="primary" onClick={appendEmptyItem}>
                    <PlusIcon />
                    Dodaj pozycję menu
                  </Button>
                </div>
              )}
            </div>
          </div>
          <FormSubmitButtons storageKey={STORAGE_KEY} />
        </form>
      </Form>
    </div>
  );
};
