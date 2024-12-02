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
import { SubmitButtons } from "./submit-buttons";
import { MenuItems, MenuItemsPath, menuItemsSchema } from "./schema";

export const STORAGE_KEY = "menuItems";

export const getStateFromLocalStorage = <T,>(storageKey: string) => {
  const savedData = localStorage.getItem(storageKey);
  return savedData ? (JSON.parse(savedData) as T) : undefined;
};

export const NavMenuBuilder = () => {
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
  const [preventEditingState, setPreventEditingState] = useState(true);
  const { reset, getValues } = form;
  const { fields, appendItem, removeItem } = useMenuItemsArray(form);

  const onSubmit = (values: MenuItems) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    reset(values);
  };

  const hasItems = !!getValues().items.length;

  useEffect(() => {
    const data = getStateFromLocalStorage<MenuItems>(STORAGE_KEY);
    if (data) reset(data);
    setTimeout(() => {
      setPreventEditingState(false);
    }, 0);
  }, [reset]);

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
                  {fields.map((field, index) => (
                    <div className="w-full" key={field.id}>
                      <MenuItem
                        path={`items.${index}` as MenuItemsPath}
                        removeItem={removeItem(index)}
                        preventEditingState={preventEditingState}
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
          <SubmitButtons />
        </form>
      </Form>
    </div>
  );
};
