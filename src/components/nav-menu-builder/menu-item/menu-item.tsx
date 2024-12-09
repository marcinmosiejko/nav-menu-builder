import { FC } from "react";
import { cn } from "@/lib/utils";
import { SortableContextWrap, useSortableExtended } from "../dnd";
import { MenuItemDisplay } from "./menu-item-display";
import { MenuItem as MenuItemT } from "../store";
import {
  useIsEditingItem,
  useItemActions,
  useNavMenuBuilderContext,
} from "../context";
import { MenuItemEditor } from "./menu-item-editor";

export type MenuItemStats = ReturnType<typeof getMenuItemStats>;
export const getMenuItemStats = ({
  path,
  parentItems,
  item,
  parentId,
}: {
  item: MenuItemT;
  path: number[];
  parentItems: MenuItemT[];
  parentId: string;
}) => {
  const parentPath = path.slice(0, -1);

  const parentItemsCount = parentItems?.length || 1;
  const depth = path.length;
  const itemIndex = path.at(-1);
  const isItemFirst = itemIndex === 0;
  const isItemLast = itemIndex === parentItemsCount - 1;
  const hasChildren = item.items.length;
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
    parentId,
  };
};

export const MenuItem: FC<{
  parentId: string;
  path: number[];
  activeId?: string;
  isOverlay?: boolean;
  item: MenuItemT;
  parentItems: MenuItemT[];
}> = ({ path, activeId, item, isOverlay, parentItems, parentId }) => {
  const itemId = item.id;
  const {
    handleAddItem,
    handleEditItem,
    handleRemoveItem,
    handleSaveItem,
    handleCancelEditItem,
  } = useItemActions(itemId, path, item);
  const { isDnDAllowed } = useNavMenuBuilderContext();
  const isEditing = useIsEditingItem(itemId);
  const menuItemStats = getMenuItemStats({ path, parentItems, item, parentId });
  const { depth } = menuItemStats;
  const isDragged = !!activeId && activeId === itemId;

  const sortable = useSortableExtended({
    id: itemId,
    transition: null,
    disabled: activeId === item.id,
    data: menuItemStats,
  });
  const children = item.items;

  return (
    <div
      className={cn("flex flex-col rounded-none", depth > 1 && "ml-4 md:ml-16")}
    >
      {isEditing ? (
        <MenuItemEditor
          item={item}
          menuItemStats={menuItemStats}
          onRemoveItem={handleRemoveItem}
          onSaveItem={handleSaveItem}
          onCancelEditItem={handleCancelEditItem}
        />
      ) : (
        <MenuItemDisplay
          item={item}
          menuItemStats={menuItemStats}
          onRemoveItem={handleRemoveItem}
          onAddItem={handleAddItem}
          onEdititem={handleEditItem}
          sortable={sortable}
          isDragged={isDragged}
          isOverlay={isOverlay}
          isDnDAllowed={isDnDAllowed}
        />
      )}

      {!isDragged && (
        <div className="bg-background-secondary">
          <SortableContextWrap items={children}>
            {children.map((child, index) => (
              <MenuItem
                key={child.id}
                parentId={itemId}
                item={child}
                path={[...path, index]}
                activeId={activeId}
                parentItems={children}
              />
            ))}
          </SortableContextWrap>
        </div>
      )}
    </div>
  );
};
