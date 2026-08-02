import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";

import MobileDrawer from "./MobileDrawer";
import MobileMenu from "./MobileMenu";
import NavbarActions from "./NavbarActions";
import NavbarAuth from "./NavbarAuth";
import NavbarBrand from "./NavbarBrand";
import NavbarLinks from "./NavbarLinks";

/**
 * Website navbar (Server Component).
 * Campaign chrome lives in `CampaignNavbar` — do not import this into client modules.
 *
 * @param {{ variant?: "default" | "minimal" }} props
 */
export default function Navbar({ variant = "default" }) {
  if (variant === "minimal") {
    return (
      <header className="sticky top-0 z-50 w-full">
        <div className="glass-strong border-b border-border/60">
          <div className="container flex h-16 items-center gap-3 md:h-18">
            <NavbarBrand />
            <div className="flex-1" />
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass-strong border-b border-border/60">
        <div className="container flex h-16 items-center gap-4 md:h-18">
          <NavbarBrand />
          <NavbarLinks />
          <div className="flex-1" />
          <NavbarActions />
          <NavbarAuth />
          <MobileMenu />
        </div>
        <MobileDrawer />
      </div>
    </header>
  );
}
