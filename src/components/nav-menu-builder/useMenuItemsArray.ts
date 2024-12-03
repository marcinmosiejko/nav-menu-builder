import { useFieldArray, UseFormReturn } from "react-hook-form";
import { MenuItem as MenuItemT, MenuItemPath } from "./schema";
import { useCallback } from "react";

const emptyMenuItem = {
  name: "",
  link: "",
  items: [],
};

export const useMenuItemsArray = (
  form: UseFormReturn<MenuItemT, unknown, undefined>,
  path: MenuItemPath,
) => {
  const { fields, append, ...rest } = useFieldArray({
    name: `${path}.items` as "items",
    control: form.control,
  });

  const appendEmptyItem = useCallback(() => {
    append(emptyMenuItem);
  }, [append]);

  return { fields, appendEmptyItem, append, ...rest };
};
