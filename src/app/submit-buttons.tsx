import { Button } from "@/components/button";
import { ButtonWithConfirm } from "@/components/button-with-confirm";
import { useFormContext, useFormState } from "react-hook-form";
import { getMenuStateFromLocalStorage } from "./page";

export const SubmitButtons = () => {
  const { control, reset } = useFormContext();
  const formValues = useFormState({
    control,
  });
  const isValid = !Object.keys(formValues.errors).length;

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
          const data = getMenuStateFromLocalStorage();
          reset(data);
        }}
        description="Anulowanie oznacza usunięcie wszelkich zmian dokonanych od ostatniego zapisania."
      />

      <Button
        type="submit"
        variant="primary"
        disabled={!formValues.isDirty || !isValid}
      >
        Zapisz
      </Button>
    </div>
  );
};
