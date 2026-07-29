import { getTranslations } from "next-intl/server";

import PageHeader from "@/components/common/PageHeader";
import { getCustomerLikes } from "@/features/wishlist/api";
import { WishlistPage } from "@/features/wishlist";
import { getCustomerTokenFromCookies } from "@/lib/auth/customer-token";

const PRODUCTS_PER_PAGE = 12;
const COMPANIES_PER_PAGE = 12;

export default async function Page() {
  const t = await getTranslations();
  const token = await getCustomerTokenFromCookies();

  let initialData = null;
  if (token) {
    try {
      initialData = await getCustomerLikes(token, {
        products_page: 1,
        products_per_page: PRODUCTS_PER_PAGE,
        companies_page: 1,
        companies_per_page: COMPANIES_PER_PAGE,
      });
    } catch {
      initialData = null;
    }
  }

  return (
    <>
      <PageHeader
        title={t("wishlist.title")}
        subtitle={t("wishlist.subtitle")}
        breadcrumbs={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.wishlist") },
        ]}
      />

      <section className="container pb-16 pt-2 sm:pt-4">
        <WishlistPage
          initialData={initialData}
          initialAuthenticated={Boolean(token)}
          productsPerPage={PRODUCTS_PER_PAGE}
          companiesPerPage={COMPANIES_PER_PAGE}
        />
      </section>
    </>
  );
}
