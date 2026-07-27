"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import MediaImage from "@/components/common/MediaImage";
import { Button } from "@/components/ui/button";
import { PAYMENT_TYPE, useCartStore } from "@/stores/cart-store";

export default function CartItemRow({ item }) {
  const t = useTranslations("cart");
  const locale = useLocale();
  const currency = locale === "ar" ? "ج.م" : "EGP";
  const paymentType = useCartStore((state) => state.paymentType);
  const increase = useCartStore((state) => state.increase);
  const decrease = useCartStore((state) => state.decrease);
  const remove = useCartStore((state) => state.remove);
  const isInstallment = paymentType === PAYMENT_TYPE.INSTALLMENT;

  const lineTotal = (item.price ?? 0) * item.quantity;

  const onIncrease = () => {
    const result = increase(item.companyProductId);
    if (result?.ok === false) {
      toast.message(t("toast.installmentSingle"));
    }
  };

  return (
    <div className="flex gap-3 border-b border-border/50 py-3 last:border-0">
      <div className="size-16 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted">
        <MediaImage src={item.image} alt="" kind="product" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-semibold leading-snug">
          {item.name}
        </p>
        <p className="mt-1 text-sm font-bold text-primary tabular-nums">
          {lineTotal.toLocaleString(locale === "ar" ? "ar-EG" : "en-EG")}{" "}
          <span className="text-xs font-medium text-muted-foreground">
            {currency}
          </span>
        </p>

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1 rounded-full border border-border/60 p-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-7 rounded-full"
              onClick={() => decrease(item.companyProductId)}
              aria-label={t("decrease")}
            >
              <Minus className="size-3.5" />
            </Button>
            <span className="min-w-6 text-center text-sm font-semibold tabular-nums">
              {item.quantity}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-7 rounded-full"
              disabled={isInstallment}
              onClick={onIncrease}
              aria-label={t("increase")}
            >
              <Plus className="size-3.5" />
            </Button>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => remove(item.companyProductId)}
            aria-label={t("remove")}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
