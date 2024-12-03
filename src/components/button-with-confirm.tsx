import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

export const ButtonWithConfirm: React.FC<{
  TriggerBody: React.ReactNode;
  removeItem: () => void;
}> = ({ TriggerBody, removeItem }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{TriggerBody}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader className="space-y-4">
          <DialogTitle>Jesteś pewny?</DialogTitle>
          <DialogDescription>
            Usunięcie tego elementu oznacza usunięcie także wszystkich jego
            pod-elementów.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Anuluj
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="primary" onClick={() => removeItem()}>
              Potwierdź
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
