import { Button } from "@/components/button";
import ArrowLeftIcon from "@/components/icons/arrow-left-icon";
import { NavMenuBuilderProvider } from "@/components/nav-menu-builder/context";
import { NavMenuBuilder } from "@/components/nav-menu-builder/nav-menu-builder";

export default function NavMenuBuilderPage() {
  return (
    <div className="space-y-6">
      <nav>
        <Button variant="neutral" className="px-0">
          <ArrowLeftIcon />
          Wróć do listy nawigacji
        </Button>
      </nav>
      <NavMenuBuilderProvider>
        <NavMenuBuilder />
      </NavMenuBuilderProvider>
    </div>
  );
}
