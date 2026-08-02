import { getLocale } from "next-intl/server";

import { getGovernorates } from "@/features/companies/api";
import HomeProductsClient from "@/features/home/components/products/HomeProductsClient";
import { getProducts } from "@/features/products/api";

const HOME_PRODUCTS_PER_PAGE = 8;

export default async function ProductsSection() {
  const locale = await getLocale();
  const [{ products, meta }, governorates] = await Promise.all([
    getProducts({
      page: 1,
      per_page: HOME_PRODUCTS_PER_PAGE,
    }),
    getGovernorates({ locale }),
  ]);

  if (!products.length) return null;

  const catalogGovernorateId = governorates[0]?.id ?? null;

  return (
    <HomeProductsClient
      initialProducts={products}
      initialMeta={meta}
      catalogGovernorateId={catalogGovernorateId}
      perPage={HOME_PRODUCTS_PER_PAGE}
    />
  );
}
