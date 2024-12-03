import { useFieldArray, UseFormReturn } from "react-hook-form";
import {
  MenuItem as MenuItemT,
  MenuItemPath,
  getEmptyMenuItem,
} from "./schema";
import { useCallback } from "react";

export const useMenuItemsArray = (
  form: UseFormReturn<MenuItemT, unknown, undefined>,
  path: MenuItemPath,
) => {
  const { fields, append, ...rest } = useFieldArray({
    name: `${path}.items` as "items",
    control: form.control,
  });

  const appendEmptyItem = useCallback(() => {
    append(getEmptyMenuItem());
  }, [append]);

  return { fields, appendEmptyItem, append, ...rest };
};
