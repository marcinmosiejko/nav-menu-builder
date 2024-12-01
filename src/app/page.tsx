import { Button } from "@/components/button";
import ArrowLeftIcon from "@/components/icons/arrow-left-icon";
import { NavMenuBuilder } from "@/components/nav-menu-builder/nav-menu-builder";

export default function NavMenuBuilderPage() {
  return (
    <div className="flex flex-col gap-6">
      <nav>
        <Button variant="neutral" className="px-0">
          <ArrowLeftIcon />
          Wróć do listy nawigacji
        </Button>
      </nav>
      <NavMenuBuilder />
    </div>
  );
}
