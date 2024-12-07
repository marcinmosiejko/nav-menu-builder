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
  let current = [menu];
  for (const index of parentPath) {
    current = current[index].items;
  }

  return { parentItems: current, item: current[itemIndex], itemIndex };
};

export type SetItems = (newItems: MenuItem[]) => void;
export type MoveItem = (
  path: MenuItemPath,
  newIndex: MenuItemPath[number],
) => void;

export const useMenuStore = create<
  { menu: MenuItem } & {
    setItems: (newItems: MenuItem[]) => void;
    setMenu: (menu: MenuItem) => void;
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

    setItems: (newItems: MenuItem[]) =>
      set((state) => {
        state.menu.items = newItems;
      }),

    appendItem: (path, newItem) =>
      set((state) => {
        const { item } = getItemAndContext(path, state.menu);
        item.items.push(newItem);
      }),

    updateItem: (path, newItem) =>
      set((state) => {
        if (path.length === 1) {
          state.menu = newItem;
          return;
        }
        const { parentItems, itemIndex } = getItemAndContext(path, state.menu);
        parentItems[itemIndex] = newItem;
      }),

    removeItem: (path) =>
      set((state) => {
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
