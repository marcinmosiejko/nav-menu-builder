import { useFieldArray, UseFormReturn } from "react-hook-form";
import { MenuItem, MenuItemsPath } from "./schema";
import { useCallback } from "react";

const emptyMenuItem = {
  name: "",
  link: "",
  items: [],
};

export const useMenuItemsArray = (
  form: UseFormReturn<MenuItem, unknown, undefined>,
  path: MenuItemsPath,
) => {
  const { fields, append, ...rest } = useFieldArray({
    name: `${path}.items` as "items",
    control: form.control,
  });

  const appendItem = useCallback(() => {
    append(emptyMenuItem);
  }, [append]);

  return { fields, appendItem, append, ...rest };
};
