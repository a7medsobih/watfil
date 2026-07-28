import Image from "next/image";
import { getTranslations } from "next-intl/server";

import logo from "@/assets/watfil-logo.png";

/**
 * Minimal footer for the store share landing — brand + copyright only.
 */
export default async function StoreShareFooter() {
  const t = await getTranslations();

  return (
    <footer className="mt-auto border-t border-border/60 bg-surface">
      <div className="container flex flex-col items-center justify-between gap-3 py-6 sm:flex-row sm:py-7">
        <Image
          src={logo}
          alt={t("brand.name")}
          width={120}
          height={34}
          className="h-8 w-auto opacity-90"
        />
        <p className="text-center text-xs text-muted-foreground sm:text-start">
          © {new Date().getFullYear()} {t("brand.name")}. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
