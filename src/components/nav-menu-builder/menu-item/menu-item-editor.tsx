import { Dispatch, FC, SetStateAction } from "react";
import {
  baseMenuItemSchema,
  BaseMenu,
  MenuItem as MenuItemT,
  MenuItemPath,
} from "@/components/nav-menu-builder/schema";
import { cn } from "@/lib/utils";
import { MenuItemBaseFields } from "./menu-item-base-fields";
import { Button } from "@/components/button";
import { ButtonWithConfirm } from "@/components/button-with-confirm";
import BinIcon from "@/components/icons/bin-icon";
import { useFormContext, useWatch } from "react-hook-form";
import { buttonTextAndPadding, MenuItemStats } from "./menu-item";

export const confirmRemoveDescription =
  "Usunięcie tego elementu oznacza usunięcie także wszystkich jego pod-elementów.";

const AddButton: FC<{
  onClick: () => void;
  path: MenuItemPath;
}> = ({ onClick, path }) => {
  const { control } = useFormContext<MenuItemT>();
  const item = useWatch({
    control,
    name: path,
  });
  const isValid = baseMenuItemSchema.safeParse(item).success;
  return (
    <Button
      className={buttonTextAndPadding}
      onClick={onClick}
      variant="secondary-color"
      disabled={!isValid}
    >
      {"Dodaj"}
    </Button>
  );
};

export const MenuItemEditor: FC<{
  valueBeforeEditing: BaseMenu | null;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  path: MenuItemPath;
  removeItem: () => void;
  menuItemStats: MenuItemStats;
}> = ({
  valueBeforeEditing,
  setIsEditing,
  path,
  removeItem,
  menuItemStats,
}) => {
  const form = useFormContext<MenuItemT>();
  const { depth, isItemFirst, hasSiblings, hasChildren } = menuItemStats;

  const onCancel = () => {
    if (valueBeforeEditing) {
      form.setValue(path, {
        ...valueBeforeEditing,
        items: form.getValues(`${path}.items` as "items"),
      });
    } else {
      removeItem();
    }
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        "bg-background border-border relative flex flex-col gap-4 rounded-md py-4 pl-6 pr-6 md:pr-24",
        depth > 1 && "m-6 ml-0 border",
        depth === 1 && !isItemFirst && "m-6 border",
        depth === 1 &&
          isItemFirst &&
          valueBeforeEditing &&
          (hasChildren || hasSiblings) &&
          "m-6 border",
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
      <div className="w-full space-x-2 text-right md:text-left">
        <Button
          className={buttonTextAndPadding}
          variant="secondary"
          onClick={onCancel}
        >
          Anuluj
        </Button>
        <AddButton path={path} onClick={() => setIsEditing(false)} />
      </div>
      <ButtonWithConfirm
        TriggerBody={
          <Button
            className="absolute right-4 top-2 h-8 w-8 fill-none hover:opacity-70 md:right-10 md:top-6"
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
