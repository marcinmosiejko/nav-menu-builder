import { Button } from "@/components/button";
import { ButtonWithConfirm } from "@/components/button-with-confirm";
import { FC } from "react";

export const FormSubmitButtons: FC<{
  onReset: () => void;
}> = ({ onReset }) => {
  return (
    <div className="flex justify-end gap-2">
      <ButtonWithConfirm
        TriggerBody={
          <Button type="reset" variant="secondary">
            Anuluj
          </Button>
        }
        onConfirm={onReset}
        description="Anulowanie oznacza usunięcie wszelkich zmian dokonanych od ostatniego zapisania."
      />

      <Button type="submit" variant="primary">
        Zapisz
      </Button>
    </div>
  );
};
