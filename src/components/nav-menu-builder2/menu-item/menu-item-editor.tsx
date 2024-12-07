import { FC } from "react";
import { cn } from "@/lib/utils";
import { MenuItemBaseFields } from "./menu-item-base-fields";
import { Button } from "@/components/button";
import { ButtonWithConfirm } from "@/components/button-with-confirm";
import BinIcon from "@/components/icons/bin-icon";
import { useForm, useFormState } from "react-hook-form";
import { buttonTextAndPadding, MenuItemStats } from "./menu-item";
import { zodResolver } from "@hookform/resolvers/zod";
import { BaseMenuItem, baseMenuItemSchema } from "../schema";
import { MenuItem } from "../store";
import { Form } from "@/components/form";

export const confirmRemoveDescription =
  "Usunięcie tego elementu oznacza usunięcie także wszystkich jego pod-elementów.";

const SubmitButton = () => {
  const formState = useFormState<MenuItem>();

  return (
    <Button
      className={buttonTextAndPadding}
      variant="secondary-color"
      disabled={!formState.isValid}
      type="submit"
    >
      Dodaj
    </Button>
  );
};

export const MenuItemEditor: FC<{
  item: MenuItem;
  menuItemStats: MenuItemStats;
  onRemoveItem: () => void;
  onSaveItem: (newItem: MenuItem) => void;
  onCancelEditItem: () => void;
}> = ({ menuItemStats, item, onRemoveItem, onCancelEditItem, onSaveItem }) => {
  const { depth, isItemFirst, hasSiblings, hasChildren } = menuItemStats;

  const form = useForm<BaseMenuItem>({
    mode: "onChange",
    reValidateMode: "onChange",
    shouldFocusError: true,
    resolver: zodResolver(baseMenuItemSchema),
    defaultValues: { name: item.name, link: item.link },
  });

  const onSubmit = (value: BaseMenuItem) => {
    onSaveItem({ ...item, ...value });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div
          className={cn(
            "bg-background border-border relative flex flex-col gap-4 rounded-md py-4 pl-6 pr-6 md:pr-24",
            depth > 1 && "m-6 ml-0 border",
            depth === 1 && !isItemFirst && "m-6 border",
            depth === 1 &&
              isItemFirst &&
              (hasChildren || hasSiblings) &&
              "m-6 border",
          )}
        >
          <div className="flex flex-col gap-2">
            <MenuItemBaseFields
              nameFieldProps={{
                label: "Nazwa",
                placeholder: "np. Promocje",
                name: "name",
              }}
              linkFieldProps={{
                name: "link",
              }}
            />
          </div>
          <div className="w-full space-x-2 text-right md:text-left">
            <Button
              className={buttonTextAndPadding}
              variant="secondary"
              onClick={onCancelEditItem}
            >
              Anuluj
            </Button>
            <SubmitButton />
          </div>
          <ButtonWithConfirm
            TriggerBody={
              <Button
                className="absolute right-4 top-2 h-8 w-8 fill-none hover:opacity-70 md:right-10 md:top-6"
                variant="plain"
              >
                <BinIcon />
              </Button>
            }
            onConfirm={onRemoveItem}
            description={confirmRemoveDescription}
          />
        </div>
      </form>
    </Form>
  );
};
