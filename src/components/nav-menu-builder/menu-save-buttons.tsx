import { Button } from "@/components/button";
import { ButtonWithConfirm } from "@/components/button-with-confirm";
import { FC, useMemo } from "react";
import { STORAGE_KEY } from "./nav-menu-builder";
import { Menu, useMenuStore } from "./store";
import { toast } from "sonner";
import { useNavMenuBuilderContext } from "./context";
import isEqual from "lodash.isequal";

export const MenuSaveButtons: FC<{
  lastSavedOrInitData?: Menu;
  onLastSavedDataChange: (data: Menu) => void;
}> = ({ lastSavedOrInitData, onLastSavedDataChange }) => {
  const {
    formsByItemId,
    editingItemIds,
    basicFormsStateByItemId,
    clearEditingItemIds,
  } = useNavMenuBuilderContext();
  const menuStore = useMenuStore();

  const hasChangesInMenuStore = useMemo(() => {
    const hasDirtyForm = Object.values(basicFormsStateByItemId).some(
      (state) => state.isDirty,
    );
    return hasDirtyForm || !isEqual(lastSavedOrInitData, menuStore.menu);
  }, [menuStore.menu, lastSavedOrInitData, basicFormsStateByItemId]);

  const handleOnSave = () => {
    let isValid = true;
    let isDirty = false;
    for (const form of Object.values(formsByItemId)) {
      if (!form.formState.isValid) {
        isValid = false;
        form.trigger();
      }
      if (form.formState.isDirty) isDirty = true;
    }
    if (!isValid || (!!editingItemIds.length && isDirty)) {
      toast.error(
        "Aby zapisać zmiany menu musisz najpierw uzupełnić brakujące pola i dodać wszystkie edytowane pozycje.",
      );
      return;
    }
    const topItemForm = formsByItemId[menuStore.menu.id];
    const topItemValues = topItemForm.getValues();
    const newMenu = { ...menuStore.menu, ...topItemValues };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMenu));
    menuStore.setMenu(newMenu);
    topItemForm.reset(topItemValues); // resets isDirty
    onLastSavedDataChange(newMenu);
    toast.success("Twoje zmiany zostały zapisane!");
  };

  const handleOnReset = () => {
    if (lastSavedOrInitData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lastSavedOrInitData));
      menuStore.setMenu(lastSavedOrInitData);
      const topItemForm = formsByItemId[menuStore.menu.id];
      topItemForm.reset({
        name: menuStore.menu.name,
        link: menuStore.menu.link,
      });
      clearEditingItemIds();
    }
    toast.success("Twoje zmiany zostały cofnięte!");
  };

  return (
    <div className="flex justify-end gap-2">
      <ButtonWithConfirm
        TriggerBody={
          <Button
            type="reset"
            variant="secondary"
            disabled={!hasChangesInMenuStore}
          >
            Anuluj
          </Button>
        }
        onConfirm={handleOnReset}
        description="Anulowanie oznacza usunięcie wszelkich zmian dokonanych od ostatniego zapisania."
      />

      <Button
        variant="primary"
        onClick={handleOnSave}
        disabled={!hasChangesInMenuStore}
      >
        Zapisz
      </Button>
    </div>
  );
};
