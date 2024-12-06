import { FC } from "react";
import { MenuItemBaseFields } from "./menu-item/menu-item-base-fields";
import { Button } from "../button";
import PlusIcon from "../icons/plus-icon";
import { Label } from "../label";
import { Switch } from "../switch";

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

export const DnDMode: FC<{
  value: boolean;
  onChange: (v: boolean) => void;
}> = ({ value, onChange }) => {
  return (
    <div className="flex h-6 w-full items-center justify-between space-x-2 md:h-auto md:w-auto md:justify-normal">
      <Label htmlFor="mode">
        {value
          ? "Pełny D&D (zbugowany)"
          : "Okrojony D&D (jeden poziom, działa w większości przypadków)"}
      </Label>
      <Switch id="mode" checked={value} onCheckedChange={onChange} />
    </div>
  );
};
