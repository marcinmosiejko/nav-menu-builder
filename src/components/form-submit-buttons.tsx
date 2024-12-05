import { Button } from "@/components/button";
import { ButtonWithConfirm } from "@/components/button-with-confirm";
import { FC } from "react";
import { useFormState } from "react-hook-form";

export const FormSubmitButtons: FC<{
  onReset: () => void;
}> = ({ onReset }) => {
  const form = useFormState();
  return (
    <div className="flex justify-end gap-2">
      <ButtonWithConfirm
        TriggerBody={
          <Button type="reset" variant="secondary" disabled={!form.isDirty}>
            Anuluj
          </Button>
        }
        onConfirm={onReset}
        description="Anulowanie oznacza usunięcie wszelkich zmian dokonanych od ostatniego zapisania."
      />

      <Button type="submit" variant="primary" disabled={!form.isDirty}>
        Zapisz
      </Button>
    </div>
  );
};
