import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { generateRandomId } from "./utils";

const emptyMenuItem = {
  name: "",
  link: "",
  items: [],
};
export const getNewMenuItem = () => ({
  ...emptyMenuItem,
  id: generateRandomId(12),
});

export type MenuItem = {
  id: string;
  name: string;
  link?: string;
  items: MenuItem[];
};
export type Menu = MenuItem;
export type MenuItemPath = number[];

const getItemAndContext = (
  path: MenuItemPath,
  menu: Menu,
): { item: MenuItem; parentItems: MenuItem[]; itemIndex: number } => {
  const [parentPath, itemIndex] = [path.slice(0, -1), path.at(-1)!];
  let current = menu.items;
  for (const index of parentPath) {
    current = current[index].items;
  }

  return { parentItems: current, item: current[itemIndex], itemIndex };
};

export type SetMenuItems = (newItems: MenuItem[]) => void;
export type MoveItem = (
  path: MenuItemPath,
  newIndex: MenuItemPath[number],
) => void;

export const useMenuStore = create<
  { menu: MenuItem } & {
    setMenu: (menu: MenuItem) => void;
    setMenuItems: SetMenuItems;
    appendItem: (path: MenuItemPath, newItem: MenuItem) => void;
    updateItem: (path: MenuItemPath, newItem: MenuItem) => void;
    removeItem: (path: MenuItemPath) => void;
    moveItem: MoveItem;
  }
>()(
  immer((set) => ({
    menu: {
      id: "qGmmFvXRqB5M",
      name: "",
      link: "",
      items: [],
    },
    setMenu: (menu: MenuItem) =>
      set((state) => {
        state.menu = menu;
      }),

    setMenuItems: (newItems: MenuItem[]) =>
      set((state) => {
        state.menu.items = newItems;
      }),

    appendItem: (path, newItem) =>
      set((state) => {
        if (!path.length) {
          state.menu.items.push(newItem);
          return;
        }
        const { item } = getItemAndContext(path, state.menu);
        item.items.push(newItem);
      }),

    updateItem: (path, newItem) =>
      set((state) => {
        if (!path.length) {
          state.menu = newItem;
          return;
        }
        const { parentItems, itemIndex } = getItemAndContext(path, state.menu);
        parentItems[itemIndex] = newItem;
      }),

    removeItem: (path) =>
      set((state) => {
        if (!path.length) {
          state.menu.items.splice(path.at(-1)!, 1);
          return;
        }
        const { parentItems, itemIndex } = getItemAndContext(path, state.menu);
        parentItems.splice(itemIndex, 1);
      }),

    moveItem: (path, newIndex) =>
      set((state) => {
        const { parentItems, item, itemIndex } = getItemAndContext(
          path,
          state.menu,
        );
        parentItems.splice(itemIndex, 1);
        parentItems.splice(newIndex, 0, item);
      }),
  })),
);
