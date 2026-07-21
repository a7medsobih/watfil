import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function NavbarAuth() {
  const t = await getTranslations();

  return (
    <div className="ms-2 hidden items-center gap-2 md:flex">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/login">{t("nav.login")}</Link>
      </Button>
      <Button variant="hero" size="sm" className="" asChild>
        <Link href="/register">{t("nav.register")}</Link>
      </Button>
    </div>
  );
}
