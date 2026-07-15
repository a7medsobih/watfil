import { getTranslations } from "next-intl/server";

import NavLink from "@/components/common/NavLink";
import { getVisibleNavItems } from "./nav-items";

export default async function NavbarLinks() {
  const t = await getTranslations();
  const items = getVisibleNavItems();

  return (
    <nav
      className="ms-4 hidden items-center gap-1 lg:flex"
      aria-label={t("nav.primary")}
    >
      {items.map((item) => (
        <NavLink
          key={item.key}
          href={item.href}
          className="relative rounded-full px-4 py-2 text-sm font-medium transition-colors"
        >
          {t(`nav.${item.key}`)}
        </NavLink>
      ))}
    </nav>
  );
}
