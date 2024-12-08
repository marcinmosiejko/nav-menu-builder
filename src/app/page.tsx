import { Button } from "@/components/button";
import ArrowLeftIcon from "@/components/icons/arrow-left-icon";
import { NavMenuBuilderProvider as NavMenuBuilderProvider2 } from "@/components/nav-menu-builder2/context";
import { NavMenuBuilder2 } from "@/components/nav-menu-builder2/nav-menu-builder";

export default function NavMenuBuilderPage() {
  return (
    <div className="space-y-2 md:space-y-6">
      <nav>
        <Button variant="neutral" className="px-0">
          <ArrowLeftIcon />
          Wróć do listy nawigacji
        </Button>
      </nav>

      <NavMenuBuilderProvider2>
        <NavMenuBuilder2 />
      </NavMenuBuilderProvider2>
    </div>
  );
}
