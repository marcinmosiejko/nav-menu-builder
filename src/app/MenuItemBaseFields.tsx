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
import { MenuItems } from "./page";

export const MenuItemBaseFields: React.FC<{
  nameFieldProps: { label: string; placeholder: string; name: "name" };
  linkFieldProps: { name: "link" };
}> = ({ nameFieldProps, linkFieldProps }) => {
  const form = useFormContext<MenuItems>();
  return (
    <>
      <FormField
        control={form.control}
        name={nameFieldProps.name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{nameFieldProps.label}</FormLabel>
            <FormControl>
              <Input placeholder={nameFieldProps.placeholder} {...field} />
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
                placeholder="np. Promocje"
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
