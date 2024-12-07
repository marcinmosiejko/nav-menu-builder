export const generateRandomId = (length: number) => {
  let id = "";
  const possibleChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    id += possibleChars.charAt(
      Math.floor(Math.random() * possibleChars.length),
    );
  }

  return id;
};

type Item = {
  id: string;
  items: Item[];
  [key: string]: unknown;
};
type Items = Item[];

export const getItem = <T extends Items>(
  id: string,
  items: T,
): T[number] | null => {
  const searchItem = <T extends Items>(
    items: T,
    id: string,
  ): T[number] | null => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.id === id) {
        return item;
      }

      const foundItem: T[number] | null = searchItem(item.items, id);

      if (foundItem) {
        return foundItem;
      }
    }

    return null;
  };

  return searchItem(items, id);
};

export const getParentArray = (childId: string, items: Items): Items | null => {
  let parentArray: Items | null = null;

  function findParent(childId: string, items: Items) {
    for (const item of items) {
      if (item.id === childId) {
        parentArray = items;
        return;
      }
      if (item.items.length > 0) {
        findParent(childId, item.items);
      }
    }
  }

  findParent(childId, items);
  return parentArray;
};

export const getParentId = (id: string, items: Items): string | undefined => {
  const searchParent = (
    id: string,
    items: Items,
    parent?: Item,
  ): Item | undefined => {
    for (const item of items) {
      if (item.id === id) {
        return parent;
      }
      if (item.items.length > 0) {
        const result = searchParent(id, item.items, item);
        if (result) {
          return result;
        }
      }
    }
    return undefined;
  };

  const parent = searchParent(id, items);
  return parent?.id;
};

export const getParentItems = <T extends Items>(
  childId: string | undefined,
  items: T,
): T => {
  if (childId === undefined) {
    return items;
  }

  const findParent = <T extends Items>(childId: string, items: T): T | null => {
    for (const item of items) {
      if (item.id === childId) {
        return item.items as T;
      } else if (item.items.length > 0) {
        const parentItems = findParent(childId, item.items as T);
        if (parentItems) {
          return parentItems;
        }
      }
    }
    return null;
  };

  return findParent(childId, items) as T;
};

export const addNode = <T extends Item>(
  items: T[],
  childId: string | undefined,
  value: T,
): T[] => {
  if (childId === undefined) {
    items.push(value);

    return items;
  } else {
    const parent = getItem(childId, items);
    parent?.items.push(value);

    return items;
  }
};

export const removeNode = (childId: string, items: Items): Items => {
  const parentItems = getParentArray(childId, items);
  if (parentItems) {
    const index = parentItems.findIndex((item) => item.id === childId);
    if (index !== -1) {
      parentItems.splice(index, 1);
    }
  }
  return items;
};

export const updateNode = <T extends Items>(
  items: T,
  childId: string | undefined,
  value: T,
): T => {
  if (childId === undefined) {
    return value;
  } else {
    const parent = getItem(childId, items);

    if (parent?.items) parent.items = value;
  }

  return items;
};
