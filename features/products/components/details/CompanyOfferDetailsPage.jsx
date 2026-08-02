"use client";

import { useTranslations } from "next-intl";

import AppBreadcrumb from "@/components/common/AppBreadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useProductViews } from "@/features/browsing/hooks/use-product-views";
import { normalizeProductSource } from "@/features/browsing/types";
import { useAddToCart } from "@/features/cart";
import ProductDetailsTabs from "@/features/products/components/details/ProductDetailsTabs";
import ProductHero from "@/features/products/components/details/ProductHero";

function groupPerks(perks = []) {
  const warranty = [];
  const installation = [];
  const offers = [];
  const other = [];

  for (const perk of perks) {
    if (perk?.type === "warranty") warranty.push(perk);
    else if (perk?.type === "installation") installation.push(perk);
    else if (
      perk?.type === "gift" ||
      perk?.type === "other" ||
      perk?.type === "support" ||
      perk?.type === "maintenance"
    ) {
      offers.push(perk);
    } else {
      other.push(perk);
    }
  }

  return { warranty, installation, offers, other };
}

/**
 * Company product purchase page composition.
 * `children` is reserved for server-streamed blocks (e.g. similar products).
 */
export default function CompanyOfferDetailsPage({
  product,
  company,
  locale = "ar",
  breadcrumbs = [],
  children = null,
}) {
  const t = useTranslations("product");
  const { addToCart } = useAddToCart();
  const currency = locale === "ar" ? "ج.م" : "EGP";

  const productSource = normalizeProductSource(
    product?.source ?? product?.likeSource ?? "catalog",
  );

  const { viewsCount } = useProductViews({
    companyId: company?.id,
    productId: product?.id,
    productSource,
    initialViewsCount: product?.viewsCount ?? 0,
  });

  const grouped = groupPerks(product?.hasPerks ? product.perks ?? [] : []);

  if (!product || !company) return null;

  const handleAddToCart = () => {
    addToCart({ company, product, quantity: 1, openCart: true });
  };

  const viewProduct = { ...product, viewsCount };

  return (
    <div className="container pb-16 pt-4 md:pt-8">
      {breadcrumbs.length > 0 && (
        <div className="mb-6 md:mb-8">
          <AppBreadcrumb items={breadcrumbs} />
        </div>
      )}

      <ProductHero
        product={viewProduct}
        locale={locale}
        company={company}
        showOfferingCompanies={false}
        mode="company"
      />

      <ProductDetailsTabs
        product={viewProduct}
        locale={locale}
        mode="company"
      />

      <section className="mt-12 space-y-8 sm:mt-16">
        <div
          id="purchase"
          className="rounded-3xl border border-border/60 bg-card p-5 sm:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight">
                {t("purchase.title")}
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                {t("purchaseFromCompany")}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {product.hasInstallment && (
                  <Badge className="rounded-full">{t("badges.installment")}</Badge>
                )}
                {grouped.warranty.length > 0 && (
                  <Badge variant="secondary" className="rounded-full">
                    {t("warranty")}
                  </Badge>
                )}
                {grouped.installation.length > 0 && (
                  <Badge variant="secondary" className="rounded-full">
                    {t("installation")}
                  </Badge>
                )}
                {(product.isOnSale || grouped.offers.length > 0) && (
                  <Badge variant="secondary" className="rounded-full">
                    {t("offers")}
                  </Badge>
                )}
              </div>
              <div className="pt-2">
                <div className="text-xs text-muted-foreground">{t("price")}</div>
                <div className="mt-1 flex flex-wrap items-baseline gap-2">
                  <span className="text-3xl font-black text-primary">
                    {product.cashPrice.toLocaleString(
                      locale === "ar" ? "ar-EG" : "en-EG",
                    )}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {currency}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:max-w-xs">
              <Button size="lg" className="w-full" onClick={handleAddToCart}>
                {t("purchase.addToCart")}
              </Button>
              <Button size="lg" variant="outline" className="w-full" asChild>
                <Link href={`/companies/${company.id}`}>
                  {t("purchase.goToCompany")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {children}
    </div>
  );
}
