import { FC, useEffect, useState } from "react";
import {
  BaseMenu,
  MenuItem as MenuItemT,
  MenuItemPath,
} from "@/components/nav-menu-builder/schema";
import { useMenuItemsArray } from "../useMenuItemsArray";
import { cn } from "@/lib/utils";
import {
  UseFieldArrayRemove,
  useFormContext,
  UseFormReturn,
} from "react-hook-form";
import { SortableContextWrap, useSortableExtended } from "../dnd";
import { MenuItemEditor } from "./menu-item-editor";
import { MenuItemDisplay } from "./menu-item-display";
import { useHandleArrayFieldById } from "../context";

export type MenuItemStats = ReturnType<typeof getMenuItemStats>;
export const getMenuItemStats = (
  path: MenuItemPath,
  form: UseFormReturn<MenuItemT, unknown, undefined>,
) => {
  const item = form.getValues(path);
  const parentPath = (path.split(".").slice(0, -2).join(".") ||
    undefined) as MenuItemPath;
  const parentItems = form.getValues(parentPath)?.items;
  const parentItemsCount = parentItems?.length || 1;
  const depth = path.split(".").length / 2;
  const itemIndex = Number(path.split(".").at(-1)!);
  const isItemFirst = itemIndex === 0;
  const isItemLast = itemIndex === parentItemsCount - 1;
  const hasChildren = !!form.getValues((path || undefined) as MenuItemPath)
    ?.items.length;
  return {
    path,
    parentPath,
    parentItems,
    depth,
    isItemFirst,
    isItemLast,
    hasChildren,
    hasSiblings: parentItemsCount > 1,
    item,
  };
};

export const buttonTextAndPadding = "px-2 text-xs md:px-[14px] md:text-sm";

export const MenuItem: FC<{
  parentId: string;
  path: MenuItemPath;
  removeItem: UseFieldArrayRemove;
  allowEditing: boolean;
  activeId?: string;
  isOverlay?: boolean;
}> = ({ path, parentId, removeItem, allowEditing, activeId, isOverlay }) => {
  const [isEditing, setIsEditing] = useState(allowEditing ? true : false);
  const [valueBeforeEditing, setValueBeforeEditing] = useState<BaseMenu | null>(
    null,
  );

  const form = useFormContext<MenuItemT>();
  const arrayField = useMenuItemsArray(form, path);
  const { fields, appendEmptyItem, remove: removeChild } = arrayField;
  const item = form.getValues(path);
  const itemId = item?.id;

  useEffect(() => {
    if (!allowEditing) setIsEditing(false);
  }, [allowEditing]);

  useHandleArrayFieldById(arrayField, itemId);

  const menuItemStats = getMenuItemStats(path, form);
  const { depth } = menuItemStats;
  const isBeingDragged = !!activeId && activeId === itemId;

  const sortable = useSortableExtended({
    id: itemId,
    transition: null,
    data: { ...menuItemStats, parentId },
    disabled: activeId === item?.id,
  });

  return (
    <div
      className={cn("flex flex-col rounded-none", depth > 1 && "ml-4 md:ml-16")}
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
          appendEmptyItem={appendEmptyItem}
          menuItemStats={menuItemStats}
          path={path}
          removeItem={removeItem}
          setIsEditing={setIsEditing}
          setValueBeforeEditing={setValueBeforeEditing}
          valueBeforeEditing={valueBeforeEditing}
          sortable={sortable}
          isBeingDragged={isBeingDragged}
          isOverlay={isOverlay}
        />
      )}

      {!isBeingDragged && (
        <div className="bg-background-secondary">
          <SortableContextWrap items={item?.items || []}>
            {fields.map((field, index) => (
              <div key={field.id}>
                <MenuItem
                  parentId={itemId}
                  path={`${path}.items.${index}` as MenuItemPath}
                  removeItem={() => removeChild(index)}
                  allowEditing={allowEditing}
                  activeId={activeId}
                  isOverlay={isOverlay}
                />
              </div>
            ))}
          </SortableContextWrap>
        </div>
      )}
    </div>
  );
};
