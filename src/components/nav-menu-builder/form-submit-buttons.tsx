import { Button } from "@/components/button";
import { ButtonWithConfirm } from "@/components/button-with-confirm";
import { useFormContext, useFormState } from "react-hook-form";
import { MenuItem as MenuItemT } from "./schema";
import { FC } from "react";
import { getStateFromLocalStorage } from "@/lib/utils";

export const FormSubmitButtons: FC<{ storageKey: string }> = ({
  storageKey,
}) => {
  const { control, reset } = useFormContext();
  const formValues = useFormState({
    control,
  });

  return (
    <div className="flex justify-end gap-2">
      <ButtonWithConfirm
        TriggerBody={
          <Button
            type="reset"
            variant="secondary"
            disabled={!formValues.isDirty}
          >
            Anuluj
          </Button>
        }
        onConfirm={() => {
          const data = getStateFromLocalStorage<MenuItemT>(storageKey);
          reset(data);
        }}
        description="Anulowanie oznacza usunięcie wszelkich zmian dokonanych od ostatniego zapisania."
      />

      <Button type="submit" variant="primary" disabled={!formValues.isDirty}>
        Zapisz
      </Button>
    </div>
  );
};
