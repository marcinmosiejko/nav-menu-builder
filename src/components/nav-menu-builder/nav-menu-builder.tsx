"use client";

import { Button } from "@/components/button";
import PlusIcon from "@/components/icons/plus-icon";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/form";
import { FC, useCallback, useEffect, useState } from "react";
import { useMenuItemsArray } from "./useMenuItemsArray";
import { MenuItemBaseFields } from "./menu-item/menu-item-base-fields";
import { MenuItem } from "./menu-item/menu-item";
import { FormSubmitButtons } from "../form-submit-buttons";
import {
  type MenuItem as MenuItemT,
  type MenuItemPath,
  menuItemsSchema,
  getEmptyMenuItem,
} from "./schema";
import { toast } from "sonner";
import {
  DnDActiveWithContext,
  DndContextWrap,
  SortableContextWrap,
  useSortableExtended,
} from "./dnd";
import { getStateFromLocalStorage, runAtEndOfCallStack } from "@/lib/utils";
import { DragOverlay } from "@dnd-kit/core";
import { createPortal } from "react-dom";
import { useHandleArrayFieldById } from "./context";
import { Switch } from "../switch";
import { Label } from "../label";

export const STORAGE_KEY = "menuItems";

const topMenuItemPath = "" as MenuItemPath;

const TopMenuItemFields = () => {
  return (
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
  );
};

const MenuEmptyState: FC<{ onAddItem: () => void }> = ({ onAddItem }) => {
  return (
    <div className="space-y-4 py-6 text-center">
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm font-semibold">Menu jest puste</span>
        <span className="text-xs">
          W tym menu nie ma jeszcze żadnych linków
        </span>
      </div>
      <Button variant="primary" onClick={onAddItem}>
        <PlusIcon />
        Dodaj pozycję menu
      </Button>
    </div>
  );
};

const DnDMode: FC<{
  value: boolean;
  onChange: (v: boolean) => void;
}> = ({ value, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="mode">
        {value
          ? "Pełny D&D (zbugowany)"
          : "Okrojony D&D (jeden poziom, działa w większości przypadków)"}
      </Label>
      <Switch id="mode" checked={value} onCheckedChange={onChange} />
    </div>
  );
};

export const NavMenuBuilder = () => {
  const [isFullDnD, setIsFullDnD] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<DnDActiveWithContext | null>(
    null,
  );
  // form by default shows items in editing mode which we want to prevent on first page load, reload and rerenders caused by form reset
  const [allowEditing, setAllowEditing] = useState(false);
  const setAllowEditingDeferred = useCallback(
    (allow: boolean) => runAtEndOfCallStack(setAllowEditing)(allow),
    [],
  );

  const form = useForm<MenuItemT>({
    mode: "onChange",
    reValidateMode: "onChange",
    shouldFocusError: true,
    resolver: zodResolver(menuItemsSchema),
    defaultValues: getEmptyMenuItem(),
  });

  const { reset, getValues } = form;
  const item = getValues();
  const hasChildren = !!item.items.length;
  const arrayField = useMenuItemsArray(form, topMenuItemPath);
  useHandleArrayFieldById(arrayField, item.id);
  const { fields, appendEmptyItem, remove } = arrayField;

  const onSubmit = (values: MenuItemT) => {
    setAllowEditing(false);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    reset(values);
    setAllowEditingDeferred(true);
    toast.success("Twoje zmiany zostały zapisane!");
  };
  const onReset = () => {
    setAllowEditing(false);
    const data = getStateFromLocalStorage<MenuItemT>(STORAGE_KEY);
    reset(data);
    setAllowEditingDeferred(true);
    toast.success("Twoje zmiany zostały cofnięte!");
  };

  useEffect(() => {
    const data = getStateFromLocalStorage<MenuItemT>(STORAGE_KEY);
    if (data) reset(data);
    setIsLoading(false);
    setAllowEditingDeferred(true);
  }, [reset, setAllowEditingDeferred]);

  const sortable = useSortableExtended({
    id: topMenuItemPath,
  });

  const beforeOnDragStart = () => setAllowEditing(false);
  const afterOnDragEnd = () => setAllowEditingDeferred(true);

  const onDnDModeChange = (v: boolean) => {
    setIsFullDnD(v);
    setAllowEditing(false);
    const data = getStateFromLocalStorage<MenuItemT>(STORAGE_KEY);
    reset(data);
    setAllowEditingDeferred(true);
    toast.success(
      "Pomyślnie zmieniłeś tryb D&D (twoje ostatnie zmiany zostały cofnięte)",
    );
  };

  // No skeleton for this as data loads too quickly for it to make sense. But it prevents from rendering empty form for a split second before the data comes in.
  if (isLoading) return null;

  return (
    <DndContextWrap<DnDActiveWithContext>
      form={form}
      beforeOnDragStart={beforeOnDragStart}
      afterOnDragEnd={afterOnDragEnd}
      setActiveItem={setActiveItem}
      allowHandleDragOver={isFullDnD}
    >
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dodaj nawigację</h1>
        <Form {...form}>
          <form
            className="flex flex-col gap-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <TopMenuItemFields />
            <div className="bg-background border-border flex flex-col gap-6 rounded-md border p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Pozycje menu</h2>
                <DnDMode value={isFullDnD} onChange={onDnDModeChange} />
              </div>
              <div className="bg-background-secondary border-border flex flex-col items-center justify-center gap-4 rounded-md border">
                {hasChildren ? (
                  <div className="w-full">
                    <SortableContextWrap items={item.items}>
                      {fields.map((field, index) => (
                        <div key={field.id} style={sortable.style}>
                          <MenuItem
                            parentId={item.id}
                            key={field.id}
                            path={`items.${index}` as MenuItemPath}
                            removeItem={() => remove(index)}
                            allowEditing={allowEditing}
                            activeId={activeItem?.id}
                          />
                        </div>
                      ))}
                    </SortableContextWrap>
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
                  <MenuEmptyState onAddItem={appendEmptyItem} />
                )}
              </div>
            </div>
            <FormSubmitButtons onReset={onReset} />
          </form>
          {createPortal(
            <DragOverlay>
              {activeItem && (
                <MenuItem
                  parentId={item.id}
                  path={activeItem?.data?.current?.path as MenuItemPath}
                  removeItem={() => {}}
                  allowEditing={false}
                  activeId={activeItem.id}
                  isOverlay
                />
              )}
            </DragOverlay>,
            document.body,
          )}
        </Form>
      </div>
    </DndContextWrap>
  );
};
