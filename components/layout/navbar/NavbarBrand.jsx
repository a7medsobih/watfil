import { Droplets } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export default async function NavbarBrand() {
  const t = await getTranslations();

  return (
    <Link href="/" className="group flex shrink-0 items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl [background:var(--gradient-hero)] text-primary-foreground shadow-soft transition-transform group-hover:scale-105">
        <Droplets className="size-5" />
      </span>
      <span className="text-xl font-extrabold tracking-tight">
        {t("brand.name")}
      </span>
    </Link>
  );
}
