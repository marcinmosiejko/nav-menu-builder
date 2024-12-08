import { FC } from "react";
import { Button } from "../button";
import PlusIcon from "../icons/plus-icon";

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
