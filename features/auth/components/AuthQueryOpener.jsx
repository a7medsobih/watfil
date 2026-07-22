"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useAuthDialogStore } from "@/stores/auth-dialog-store";

/**
 * Opens the auth Dialog from ?auth=login|register deep links.
 */
export default function AuthQueryOpener() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const openAuthDialog = useAuthDialogStore((state) => state.openAuthDialog);

  useEffect(() => {
    const auth = searchParams.get("auth");
    if (auth !== "login" && auth !== "register") return;

    openAuthDialog(auth);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("auth");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [searchParams, openAuthDialog, router, pathname]);

  return null;
}
