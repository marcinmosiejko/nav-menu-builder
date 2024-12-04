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
  onConfirm: () => void;
  description: string;
}> = ({ TriggerBody, onConfirm, description }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{TriggerBody}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader className="space-y-4">
          <DialogTitle>Jesteś pewny/a?</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Anuluj
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="primary" onClick={() => onConfirm()}>
              Potwierdź
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
