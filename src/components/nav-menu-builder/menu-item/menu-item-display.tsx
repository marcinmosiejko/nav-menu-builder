import { Dispatch, FC, SetStateAction } from "react";
import {
  BaseMenu,
  MenuItem as MenuItemT,
  MenuItemPath,
} from "@/components/nav-menu-builder/schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/button";
import { ButtonWithConfirm } from "@/components/button-with-confirm";
import ArrowsCrossIcon from "@/components/icons/arrows-cross-icon";
import { useFormContext, useWatch } from "react-hook-form";
import { useSortableExtended } from "../dnd";
import { buttonTextAndPadding, MenuItemStats } from "./menu-item";
import { confirmRemoveDescription } from "./menu-item-editor";
import { DEPTH_LIMIT } from "../nav-menu-builder";

export const MenuItemDisplay: FC<{
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  setValueBeforeEditing: Dispatch<SetStateAction<BaseMenu | null>>;
  valueBeforeEditing: BaseMenu | null;
  removeItem: () => void;
  path: MenuItemPath;
  appendEmptyItem: () => void;
  menuItemStats: MenuItemStats;
  sortable: ReturnType<typeof useSortableExtended>;
  isBeingDragged: boolean;
  isOverlay?: boolean;
}> = ({
  setValueBeforeEditing,
  setIsEditing,
  removeItem,
  path,
  appendEmptyItem,
  menuItemStats,
  sortable,
  isBeingDragged,
  isOverlay,
}) => {
  const { control } = useFormContext<MenuItemT>();
  const item = useWatch({ name: path, control });
  const { depth, isItemFirst, hasChildren, isItemLast } = menuItemStats;
  const { attributes, listeners, setActivatorNodeRef } = sortable;
  const showAddItemButton = depth < DEPTH_LIMIT;

  return (
    <div
      className={cn(
        "bg-background border-border-secondary m-[-1px] flex flex-col gap-2 border py-4 pl-4 pr-2 md:flex-row md:items-center md:justify-between md:gap-0 md:pl-8 md:pr-6",
        depth === 1 && isItemFirst && "mt-0 rounded-t-md border-t-0",
        depth === 1 && "mx-0 border-x-0",
        depth > 1 && "mx-0 border-r-0",
        depth > 1 && (hasChildren || isItemLast) && "rounded-bl-md",
        hasChildren && "mb-0 border-b",
        isBeingDragged && !isOverlay && "bg-primary/10 border border-r-0",
        isOverlay && "ring-primary/10 ml-0 opacity-70 ring",
      )}
    >
      <div className="flex items-center gap-4">
        <span
          className="focus-visible:ring-primary ring-offset-background rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          ref={setActivatorNodeRef}
          {...listeners}
          {...attributes}
        >
          <ArrowsCrossIcon className="duration-250 transition-all hover:opacity-70" />
        </span>
        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold">{item?.name}</span>
          <span className="text-foreground-tertiary">{item?.link}</span>
        </div>
      </div>
      <div className="md:text-auto w-full text-right md:w-auto">
        <Button
          className={cn(
            buttonTextAndPadding,
            "rounded-r-none border-r-transparent focus-visible:relative",
          )}
          onClick={() => {
            setValueBeforeEditing({
              id: item.id,
              name: item.name,
              link: item.link,
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
              className={cn(
                buttonTextAndPadding,
                "rounded-none focus-visible:relative",
                !showAddItemButton && "rounded-r-md",
              )}
              variant="secondary"
            >
              Usuń
            </Button>
          }
          onConfirm={removeItem}
          description={confirmRemoveDescription}
        />
        {showAddItemButton && (
          <Button
            className={cn(
              buttonTextAndPadding,
              "rounded-l-none border-l-transparent",
            )}
            onClick={appendEmptyItem}
            variant="secondary"
          >
            <span>Dodaj</span>
            <span className="hidden md:inline">pozycję menu</span>
          </Button>
        )}
      </div>
    </div>
  );
};
