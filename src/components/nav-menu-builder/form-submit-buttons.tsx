import { Button } from "@/components/button";
import { ButtonWithConfirm } from "@/components/button-with-confirm";
import { useFormContext } from "react-hook-form";
import { MenuItem as MenuItemT } from "./schema";
import { FC } from "react";
import { getStateFromLocalStorage } from "@/lib/utils";

export const FormSubmitButtons: FC<{ storageKey: string }> = ({
  storageKey,
}) => {
  const { reset } = useFormContext();

  return (
    <div className="flex justify-end gap-2">
      <ButtonWithConfirm
        TriggerBody={
          <Button type="reset" variant="secondary">
            Anuluj
          </Button>
        }
        onConfirm={() => {
          const data = getStateFromLocalStorage<MenuItemT>(storageKey);
          reset(data);
        }}
        description="Anulowanie oznacza usunięcie wszelkich zmian dokonanych od ostatniego zapisania."
      />

      <Button type="submit" variant="primary">
        Zapisz
      </Button>
    </div>
  );
};
