"use client";

import { ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";

export default function MiniCartTrigger({ className }) {
  const t = useTranslations("cart");
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const items = useCartStore((state) => state.items);
  const openMiniCart = useCartStore((state) => state.openMiniCart);

  // Avoid SSR/client mismatch: persisted cart is empty on the server.
  const count = hasHydrated
    ? items.reduce((total, entry) => total + entry.quantity, 0)
    : 0;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={className}
      onClick={openMiniCart}
      aria-label={t("title")}
    >
      <span className="relative">
        <ShoppingBag className="h-4.5 w-4.5" />
        {count > 0 ? (
          <Badge className="absolute -end-1 -top-1 h-4 min-w-4 px-1 text-[10px]">
            {count > 99 ? "99+" : count}
          </Badge>
        ) : null}
      </span>
    </Button>
  );
}
