import { FC } from "react";
import { MenuItemBaseFields } from "./menu-item/menu-item-base-fields";
import { Button } from "../button";
import PlusIcon from "../icons/plus-icon";

export const TopMenuItemFields = () => {
  return (
    <div className="bg-background border-border flex flex-col gap-2 rounded-md border p-6 md:gap-4">
      <h2 className="font-semibold">Nazwa</h2>
      <MenuItemBaseFields
        nameFieldProps={{
          label: "Menu",
          placeholder: "np. Menu główne",
          name: "name",
        }}
        linkFieldProps={{ name: "link" }}
      />
    </div>
  );
};

export const MenuEmptyState: FC<{ onAddItem: () => void }> = ({
  onAddItem,
}) => {
  return (
    <div className="space-y-4 py-6 text-center">
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm font-semibold">Menu jest puste</span>
        <span className="text-xs">
          W tym menu nie ma jeszcze żadnych linków
        </span>
      </div>
      <Button variant="primary" onClick={onAddItem}>
        <PlusIcon />
        Dodaj pozycję menu
      </Button>
    </div>
  );
};
