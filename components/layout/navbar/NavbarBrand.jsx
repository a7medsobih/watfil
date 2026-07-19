import Image from "next/image";
import { getTranslations } from "next-intl/server";

import logo from "@/assets/watfil-logo.png";
import { Link } from "@/i18n/navigation";

export default async function NavbarBrand() {
  const t = await getTranslations();

  return (
    <Link href="/" className="group flex shrink-0 items-center gap-2.5">
      <Image src={logo} alt={t("brand.name")} width={100} height={100} priority />
      {/* <span className="text-xl font-extrabold tracking-tight">
        {t("brand.name")}
      </span> */}
    </Link>
  );
}
