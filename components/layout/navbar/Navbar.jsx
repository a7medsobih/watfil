import MobileDrawer from "./MobileDrawer";
import MobileMenu from "./MobileMenu";
import NavbarActions from "./NavbarActions";
import NavbarAuth from "./NavbarAuth";
import NavbarBrand from "./NavbarBrand";
import NavbarLinks from "./NavbarLinks";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass-strong border-b border-border/60">
        <div className="container-page flex h-16 items-center gap-4 md:h-20">
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
