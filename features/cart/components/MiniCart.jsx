"use client";

import { ShoppingBag } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import MediaImage from "@/components/common/MediaImage";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/navigation";
import CartItemRow from "@/features/cart/components/CartItemRow";
import { useCartStore } from "@/stores/cart-store";

export default function MiniCart() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const currency = locale === "ar" ? "ج.م" : "EGP";
  const side = locale === "ar" ? "left" : "right";

  const isOpen = useCartStore((state) => state.isMiniCartOpen);
  const setMiniCartOpen = useCartStore((state) => state.setMiniCartOpen);
  const closeMiniCart = useCartStore((state) => state.closeMiniCart);
  const company = useCartStore((state) => state.company);
  const items = useCartStore((state) => state.items);
  const uniqueCount = items.length;
  const quantityCount = items.reduce((sum, row) => sum + row.quantity, 0);
  const total = items.reduce(
    (sum, row) => sum + (row.price ?? 0) * row.quantity,
    0,
  );

  const isEmpty = items.length === 0;

  return (
    <Sheet open={isOpen} onOpenChange={setMiniCartOpen}>
      <SheetContent
        side={side}
        className="flex w-full flex-col sm:max-w-md"
        showCloseButton
      >
        <SheetHeader className="border-b border-border/60">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="size-4.5" />
            {t("title")}
          </SheetTitle>
          <SheetDescription>
            {isEmpty
              ? t("empty.description")
              : t("summary.meta", {
                  products: uniqueCount,
                  quantity: quantityCount,
                })}
          </SheetDescription>
        </SheetHeader>

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="grid size-14 place-items-center rounded-2xl bg-muted">
              <ShoppingBag className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">{t("empty.title")}</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              {t("empty.description")}
            </p>
            <Button asChild onClick={closeMiniCart}>
              <Link href="/products">{t("empty.browse")}</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              {company ? (
                <div className="mb-3 flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 p-3">
                  <div className="size-10 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-background">
                    <MediaImage
                      src={company.hasLogo ? company.logo : null}
                      alt=""
                      kind="company"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      {t("companyLabel")}
                    </p>
                    <p className="truncate text-sm font-semibold">
                      {company.name}
                    </p>
                  </div>
                </div>
              ) : null}

              <div>
                {items.map((item) => (
                  <CartItemRow key={item.companyProductId} item={item} />
                ))}
              </div>
            </div>

            <SheetFooter className="border-t border-border/60">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                  {t("summary.total")}
                </span>
                <span className="text-lg font-bold text-primary tabular-nums">
                  {total.toLocaleString(locale === "ar" ? "ar-EG" : "en-EG")}{" "}
                  <span className="text-sm font-medium text-muted-foreground">
                    {currency}
                  </span>
                </span>
              </div>
              <Button asChild size="lg" className="w-full" onClick={closeMiniCart}>
                <Link href="/checkout">{t("checkout")}</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
