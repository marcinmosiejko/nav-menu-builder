"use client";

import { Button } from "@/components/button";
import { useCallback, useEffect, useState } from "react";
import { MenuItem } from "./menu-item/menu-item";
import { DndContextWrap, DragOverlayPortal, SortableContextWrap } from "./dnd";
import { cn, getStateFromLocalStorage } from "@/lib/utils";
import { MenuEmptyState } from "./menu-empty-state";
import { Menu, MenuItemPath, useMenuStore } from "./store";
import { MenuSaveButtons } from "./menu-save-buttons";
import { useItemActions, useNavMenuBuilderContext } from "./context";
import { TopItemEditor } from "./top-item-editor";

export const STORAGE_KEY = "menuItems";
export const DEPTH_LIMIT = 7;

export const NavMenuBuilder = () => {
  const menuStore = useMenuStore();
  const [isLoading, setIsLoading] = useState(true);
  const { activeItem, handleSetActiveItem } = useNavMenuBuilderContext();
  const [lastSavedOrInitData, setLastSavedOrInitData] = useState<
    Menu | undefined
  >();

  useEffect(() => {
    if (lastSavedOrInitData) return;
    const lastSaved = getStateFromLocalStorage<Menu>(STORAGE_KEY);
    if (lastSaved) {
      setLastSavedOrInitData(lastSaved);
      menuStore.setMenu(lastSaved);
    } else {
      setLastSavedOrInitData(menuStore.menu);
    }
    setIsLoading(false);
  }, [lastSavedOrInitData, menuStore]);

  const menu = menuStore.menu;
  const path: MenuItemPath = [];

  const { handleAddItem } = useItemActions(menu.id, path, menu);

  const handleLastSavedDataChange = useCallback((data: Menu) => {
    setLastSavedOrInitData(data);
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
          <TopItemEditor item={menu} />
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
                      className={cn("m-4 md:m-6")}
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
            lastSavedOrInitData={lastSavedOrInitData}
            onLastSavedDataChange={handleLastSavedDataChange}
          />
        </div>
        <DragOverlayPortal activeItem={activeItem} />
      </div>
    </DndContextWrap>
  );
};
