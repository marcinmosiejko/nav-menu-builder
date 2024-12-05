import { Button } from "@/components/button";
import ArrowLeftIcon from "@/components/icons/arrow-left-icon";
import PlusIcon from "@/components/icons/plus-icon";
import SearchIcon from "@/components/icons/search-icon";
import { InputWithLabel } from "@/components/input-with-label";

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <nav>
        <Button variant="plain" className="px-0">
          <ArrowLeftIcon />
          Wróć do listy nawigacji
        </Button>
      </nav>
      <h1 className="text-2xl font-bold">Dodaj nawigację</h1>
      <div className="bg-background flex flex-col gap-4 p-6 rounded-md border border-border">
        <h2 className="font-semibold">Nazwa</h2>
        <InputWithLabel
          label="menu"
          inputProps={{ type: "text", placeholder: "np. Menu główne" }}
        />
        <InputWithLabel
          label="Link"
          inputProps={{ type: "text", placeholder: "Wklej lub wyszukaj" }}
          Icon={SearchIcon}
        />
      </div>

      <div className="bg-background flex flex-col gap-4 p-6 rounded-md border border-border">
        <h2 className="font-semibold">Pozycje menu</h2>
        <div className="bg-background-secondary p-6 border border-border flex flex-col justify-center items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold text-sm">Menu jest puste</span>
            <span className="text-xs">
              W tym menu nie ma jeszcze żadnych linków
            </span>
          </div>
          <Button variant="primary">
            <PlusIcon />
            Dodaj pozycję menu
          </Button>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="secondary">Anuluj</Button>
        <Button variant="secondary" disabled>
          Zapisz
        </Button>
      </div>
    </div>
  );
}
