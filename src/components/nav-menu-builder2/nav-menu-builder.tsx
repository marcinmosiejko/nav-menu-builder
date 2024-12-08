"use client";

import { Button } from "@/components/button";
import { useCallback, useEffect, useState } from "react";
import { buttonTextAndPadding, MenuItem } from "./menu-item/menu-item";
import { DndContextWrap, DragOverlayPortal, SortableContextWrap } from "./dnd";
import { cn, getStateFromLocalStorage } from "@/lib/utils";
import { MenuEmptyState, TopMenuItemEditor } from "./components";
import { Menu, MenuItemPath, useMenuStore } from "./store";
import { MenuSaveButtons } from "./menu-save-buttons";
import { useItemActions, useNavMenuBuilderContext } from "./context";

export const STORAGE_KEY = "menuItems";
export const DEPTH_LIMIT = 7;

export const NavMenuBuilder2 = () => {
  const menuStore = useMenuStore();
  const [isLoading, setIsLoading] = useState(true);
  const { activeItem, handleSetActiveItem } = useNavMenuBuilderContext();
  const [lastSavedData, setLastSavedData] = useState<Menu | undefined>();

  useEffect(() => {
    if (lastSavedData) return;
    const lastSaved = getStateFromLocalStorage<Menu>(STORAGE_KEY);
    if (lastSaved) {
      setLastSavedData(lastSaved);
      menuStore.setMenu(lastSaved);
    }
    setIsLoading(false);
  }, [lastSavedData, menuStore]);

  const menu = menuStore.menu;
  const path: MenuItemPath = [];

  const { handleAddItem } = useItemActions(menu.id, path);

  const handleLastSavedDataChange = useCallback((data: Menu) => {
    setLastSavedData(data);
  }, []);

  // No loading skeleton for this as data loads too quickly for it to make sense. But it prevents from rendering empty menu for a split second before the data comes in.
  if (isLoading) return null;

  const hasChildren = !!menu.items.length;

  return (
    <DndContextWrap
      setActiveItem={handleSetActiveItem}
      setItems={menuStore.setMenuItems}
      moveItem={menuStore.moveItem}
      items={menuStore.menu.items}
    >
      <div className="space-y-6">
        <h1 className="text-xl font-bold md:text-2xl">Dodaj nawigację</h1>
        <div className="flex flex-col gap-6">
          <TopMenuItemEditor item={menu} />
          <div className="bg-background border-border flex flex-col gap-6 rounded-md border p-6">
            <div className="flex flex-col items-start gap-2 md:flex-row md:justify-between md:gap-0">
              <h2 className="font-semibold">Pozycje menu</h2>
            </div>
            <div className="bg-background-secondary border-border flex flex-col items-center justify-center gap-4 rounded-md border">
              {hasChildren ? (
                <div className="w-full">
                  <SortableContextWrap items={menu.items}>
                    {menu.items.map((item, index) => (
                      <MenuItem
                        key={item.id}
                        activeId={activeItem?.id}
                        item={item}
                        path={[...path, index]}
                        parentId={menu.id}
                        parentItems={menu.items}
                      />
                    ))}
                  </SortableContextWrap>
                  <div className="bg-background-tertiary border-border-secondary rounded-md rounded-t-none border-t">
                    <Button
                      className={cn(buttonTextAndPadding, "m-4 md:m-6")}
                      variant="secondary"
                      onClick={handleAddItem}
                    >
                      Dodaj pozycję menu
                    </Button>
                  </div>
                </div>
              ) : (
                <MenuEmptyState onAddItem={handleAddItem} />
              )}
            </div>
          </div>
          <MenuSaveButtons
            lastSavedData={lastSavedData}
            onLastSavedDataChange={handleLastSavedDataChange}
          />
        </div>
        <DragOverlayPortal activeItem={activeItem} />
      </div>
    </DndContextWrap>
  );
};
