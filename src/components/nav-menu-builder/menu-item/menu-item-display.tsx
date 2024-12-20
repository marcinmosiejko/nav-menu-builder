import { FC } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/button";
import { ButtonWithConfirm } from "@/components/button-with-confirm";
import ArrowsCrossIcon from "@/components/icons/arrows-cross-icon";
import { useSortableExtended } from "../dnd";
import { MenuItemStats } from "./menu-item";
import { confirmRemoveDescription } from "./menu-item-editor";
import { DEPTH_LIMIT } from "../nav-menu-builder";
import { MenuItem } from "../store";

export const MenuItemDisplay: FC<{
  menuItemStats: MenuItemStats;
  sortable: ReturnType<typeof useSortableExtended>;
  isDragged: boolean;
  isDnDAllowed: boolean;
  isOverlay?: boolean;
  item: MenuItem;
  onRemoveItem: () => void;
  onAddItem: () => void;
  onEdititem: () => void;
}> = ({
  menuItemStats,
  sortable,
  isDragged,
  isDnDAllowed,
  isOverlay,
  item,
  onRemoveItem,
  onAddItem,
  onEdititem,
}) => {
  const { depth, isItemFirst, hasChildren, isItemLast } = menuItemStats;
  const { attributes, listeners, setActivatorNodeRef, setNodeRef, style } =
    sortable;
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
        isDragged && !isOverlay && "bg-primary/10 border border-r-0",
        isOverlay && "ring-primary/10 ml-0 opacity-70 ring",
      )}
      style={style}
      ref={setNodeRef}
    >
      <div className="flex items-center gap-4">
        <Button
          className="size-auto p-0 hover:opacity-70 md:p-0"
          variant="plain"
          ref={setActivatorNodeRef}
          {...listeners}
          {...attributes}
          aria-disabled={!isDnDAllowed}
          disabled={!isDnDAllowed}
        >
          <ArrowsCrossIcon className="duration-250 transition-all hover:opacity-70" />
        </Button>
        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold">{item.name}</span>
          <span className="text-foreground-tertiary">{item.link}</span>
        </div>
      </div>
      <div className="md:text-auto w-full text-right md:w-auto">
        <Button
          className={cn(
            "rounded-r-none border-r-transparent focus-visible:relative",
          )}
          onClick={onEdititem}
          variant="secondary"
        >
          Edytuj
        </Button>
        <ButtonWithConfirm
          TriggerBody={
            <Button
              className={cn(
                "rounded-none focus-visible:relative",
                !showAddItemButton && "rounded-r-md",
              )}
              variant="secondary"
            >
              Usuń
            </Button>
          }
          onConfirm={onRemoveItem}
          description={confirmRemoveDescription}
        />
        {showAddItemButton && (
          <Button
            className={cn("rounded-l-none border-l-transparent")}
            onClick={onAddItem}
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
