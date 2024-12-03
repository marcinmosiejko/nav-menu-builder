import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form";
import { Input } from "@/components/input";
import { InputWithIcon } from "@/components/input-with-icon";
import SearchIcon from "@/components/icons/search-icon";
import { useFormContext } from "react-hook-form";
import { type MenuItem as MenuItemT } from "../schema";

export const MenuItemBaseFields: React.FC<{
  nameFieldProps: { label: string; placeholder: string; name: "name" };
  linkFieldProps: { name: "link" };
}> = ({ nameFieldProps, linkFieldProps }) => {
  const form = useFormContext<MenuItemT>();

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 'Enter' keydown in input triggers onClick of an edit button of the first menu item, not sure why this would happen
    // This fixes the issue
    if (e.key === "Enter") e.preventDefault();
  };

  return (
    <>
      <FormField
        control={form.control}
        name={nameFieldProps.name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{nameFieldProps.label}</FormLabel>
            <FormControl>
              <Input
                placeholder={nameFieldProps.placeholder}
                {...field}
                onKeyDown={onKeyDown}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={linkFieldProps.name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Link</FormLabel>
            <FormControl>
              <InputWithIcon
                onKeyDown={onKeyDown}
                placeholder="Wklej lub wyszukaj"
                {...field}
                Icon={SearchIcon}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
