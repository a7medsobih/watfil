"use client";

import { useLocale, useTranslations } from "next-intl";

import MediaImage from "@/components/common/MediaImage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCartStore } from "@/stores/cart-store";

export default function CartCompanyConflictDialog() {
  const t = useTranslations("cart.conflict");
  const locale = useLocale();
  const isOpen = useCartStore((state) => state.isConflictOpen);
  const company = useCartStore((state) => state.company);
  const pendingAdd = useCartStore((state) => state.pendingAdd);
  const closeConflict = useCartStore((state) => state.closeConflict);
  const keepCurrentCart = useCartStore((state) => state.keepCurrentCart);
  const confirmReplaceAndAdd = useCartStore(
    (state) => state.confirmReplaceAndAdd,
  );

  const pendingCompany = pendingAdd?.company;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeConflict();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription className="text-start leading-relaxed">
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {company ? (
            <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/40 p-3">
              <div className="size-10 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-background">
                <MediaImage
                  src={company.hasLogo ? company.logo : null}
                  alt=""
                  kind="company"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  {t("currentCompany")}
                </p>
                <p className="truncate text-sm font-semibold">{company.name}</p>
              </div>
            </div>
          ) : null}

          {pendingCompany ? (
            <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-3">
              <div className="size-10 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-background">
                <MediaImage
                  src={pendingCompany.hasLogo ? pendingCompany.logo : null}
                  alt=""
                  kind="company"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  {t("newCompany")}
                </p>
                <p className="truncate text-sm font-semibold">
                  {pendingCompany.name}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button type="button" className="w-full" onClick={keepCurrentCart}>
            {t("keepCurrent")}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={confirmReplaceAndAdd}
          >
            {t("replace")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={closeConflict}
          >
            {locale === "ar" ? "إلغاء" : "Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
