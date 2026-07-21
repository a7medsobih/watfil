//src/app/[locale]/(public)/products/page.js
import { getLocale } from "next-intl/server";

import { getProducts } from "@/features/products/api";
import { resolveProductsParams } from "@/features/products/utils/resolve-products-params";
import ProductCard from "@/components/common/ProductCard";

export default async function Page({ searchParams }) {
  const locale = await getLocale();
  const params = resolveProductsParams(await searchParams);
  const { products } = await getProducts(params);

  return (
    <section className="container py-16">

      <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
    </section>
  );
}
