import { Dispatch, FC, SetStateAction, useState } from "react";
import {
  baseMenuItemSchema,
  BaseMenu,
  MenuItems,
  MenuItemsPath,
} from "@/components/nav-menu-builder/schema";
import { useMenuItemsArray } from "./useMenuItemsArray";
import { cn } from "@/lib/utils";
import { MenuItemBaseFields } from "./menu-item-base-fields";
import { Button } from "@/components/button";
import { ButtonWithConfirm } from "@/components/button-with-confirm";
import BinIcon from "@/components/icons/bin-icon";
import ArrowsCrossIcon from "@/components/icons/arrows-cross-icon";
import { useFormContext, useWatch } from "react-hook-form";

type MenuItemStats = ReturnType<typeof useMenuItemStats>;
const useMenuItemStats = (path: MenuItemsPath) => {
  const form = useFormContext<MenuItems>();
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
  return { depth, isItemFirst, isItemLast, hasChildren };
};

const AddOrSaveButton: FC<{
  value: BaseMenu | null;
  onClick: () => void;
  path: MenuItemsPath;
}> = ({ onClick, value, path }) => {
  const { control } = useFormContext<MenuItems>();
  const item = useWatch({
    control,
    name: path,
  });
  const isValid = baseMenuItemSchema.safeParse(item).success;
  return (
    <Button onClick={onClick} variant="secondary-color" disabled={!isValid}>
      {value ? "Zapisz" : "Dodaj"}
    </Button>
  );
};

const confirmRemoveDescription =
  "Usunięcie tego elementu oznacza usunięcie także wszystkich jego pod-elementów.";

const MenuItemEditor: FC<{
  valueBeforeEditing: BaseMenu | null;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  path: MenuItemsPath;
  removeItem: () => void;
  menuItemStats: MenuItemStats;
}> = ({
  valueBeforeEditing,
  setIsEditing,
  path,
  removeItem,
  menuItemStats,
}) => {
  const form = useFormContext<MenuItems>();
  const { depth, isItemFirst } = menuItemStats;
  return (
    <div
      className={cn(
        "bg-background border-border relative flex flex-col gap-4 rounded-md py-4 pl-6 pr-24",
        depth > 1 && "m-6 border",
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
          linkFieldProps={{
            name: `${path}.link` as `link`,
          }}
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            if (valueBeforeEditing) {
              form.setValue(path as MenuItemsPath, {
                ...valueBeforeEditing,
                items: form.getValues(`${path}.items` as "items"),
              });
            } else {
              removeItem();
            }
            setIsEditing(false);
          }}
        >
          Anuluj
        </Button>
        <AddOrSaveButton
          value={valueBeforeEditing}
          path={path}
          onClick={() => setIsEditing(false)}
        />
      </div>
      <ButtonWithConfirm
        TriggerBody={
          <Button
            className="absolute right-10 top-6 fill-none hover:opacity-70"
            variant="plain"
          >
            <BinIcon />
          </Button>
        }
        onConfirm={removeItem}
        description={confirmRemoveDescription}
      />
    </div>
  );
};

const MenuItemDisplay: FC<{
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  setValueBeforeEditing: Dispatch<SetStateAction<BaseMenu | null>>;
  valueBeforeEditing: BaseMenu | null;
  removeItem: () => void;
  path: MenuItemsPath;
  appendItem: () => void;
  menuItemStats: MenuItemStats;
}> = ({
  setValueBeforeEditing,
  setIsEditing,
  removeItem,
  path,
  appendItem,
  menuItemStats,
}) => {
  const form = useFormContext<MenuItems>();
  const value = form.getValues(path);
  const { depth, isItemFirst, hasChildren, isItemLast } = menuItemStats;
  return (
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
          <span className="text-foreground-tertiary">{value?.link || ""}</span>
        </div>
      </div>
      <div>
        <Button
          className="rounded-r-none border-r-transparent focus-visible:relative"
          onClick={() => {
            setValueBeforeEditing({
              name: value?.name || "",
              link: value?.link || "",
            });
            setIsEditing(true);
          }}
          variant="secondary"
        >
          Edytuj
        </Button>
        <ButtonWithConfirm
          TriggerBody={
            <Button
              className="rounded-none focus-visible:relative"
              variant="secondary"
            >
              Usuń
            </Button>
          }
          onConfirm={removeItem}
          description={confirmRemoveDescription}
        />
        <Button
          className="rounded-l-none border-l-transparent"
          onClick={appendItem}
          variant="secondary"
        >
          Dodaj pozycję menu
        </Button>
      </div>
    </div>
  );
};

export const MenuItem = ({
  path,
  removeItem,
}: {
  path: MenuItemsPath;
  removeItem: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(true);
  const [valueBeforeEditing, setValueBeforeEditing] = useState<BaseMenu | null>(
    null,
  );
  const form = useFormContext<MenuItems>();
  const {
    fields,
    appendItem,
    removeItem: removeChildItem,
  } = useMenuItemsArray(form, path);
  const menuItemStats = useMenuItemStats(path);
  const { depth } = menuItemStats;

  return (
    <div
      className={cn(
        "flex flex-col rounded-none",
        depth > 1 && !isEditing && "ml-16",
      )}
    >
      {isEditing ? (
        <MenuItemEditor
          menuItemStats={menuItemStats}
          path={path}
          removeItem={removeItem}
          setIsEditing={setIsEditing}
          valueBeforeEditing={valueBeforeEditing}
        />
      ) : (
        <MenuItemDisplay
          appendItem={appendItem}
          menuItemStats={menuItemStats}
          path={path}
          removeItem={removeItem}
          setIsEditing={setIsEditing}
          setValueBeforeEditing={setValueBeforeEditing}
          valueBeforeEditing={valueBeforeEditing}
        />
      )}
      <div className="bg-background-secondary">
        {fields.map((field, index) => (
          <div key={field.id}>
            <MenuItem
              path={`${path}.items.${index}` as MenuItemsPath}
              removeItem={removeChildItem(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};