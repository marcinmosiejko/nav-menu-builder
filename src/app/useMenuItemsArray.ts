import { useFieldArray, UseFormReturn } from "react-hook-form";
import { MenuItem } from "./page";

const emptyMenuItem = {
  name: "",
  link: "",
  items: [],
};

export const useMenuItemsArray = (
  form: UseFormReturn<MenuItem, unknown, undefined>,
  path: string = "",
) => {
  const { fields, append, remove } = useFieldArray({
    name: `${path}.items` as "items",
    control: form.control,
  });

  const appendItem = () => {
    append(emptyMenuItem);
  };

  const removeItem = (i: number) => () => {
    remove(i);
  };

  return { fields, appendItem, removeItem };
};
