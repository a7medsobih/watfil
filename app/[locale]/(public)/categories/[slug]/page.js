import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { getCategories, getCategory } from "@/features/categories/api";
import { CategoryDetailsPage } from "@/features/categories";
import { buildMetadata } from "@/lib/seo/metadata";

/** Categories change infrequently. */
export const revalidate = 3600;

/** Allow on-demand ISR for slugs not in generateStaticParams (Vercel). */
export const dynamicParams = true;

/**
 * Pre-render known category slugs from the taxonomy API.
 */
export async function generateStaticParams() {
  try {
    const locale = "ar";
    const apiCategories = await getCategories({}, { locale });
    return (apiCategories || [])
      .map((category) => category.slug || category.id)
      .filter((slug) => slug != null && slug !== "")
      .slice(0, 50)
      .map((slug) => ({ slug: String(slug) }));
  } catch (error) {
    console.warn("[categories/[slug] generateStaticParams] backend unavailable", {
      message: error?.message,
    });
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const locale = await getLocale();

  try {
    const category = await getCategory(slug, { locale });

    if (!category) {
      return buildMetadata({
        title: "Category",
        path: `/categories/${slug}`,
        locale,
      });
    }

    return buildMetadata({
      title: category.name,
      description: category.productType?.label || category.name,
      path: `/categories/${category.slug || category.id}`,
      locale,
    });
  } catch (error) {
    console.error(`[categories/[slug] generateMetadata] slug=${slug}`, error);
    return buildMetadata({
      title: "Category",
      path: `/categories/${slug}`,
      locale,
    });
  }
}

export default async function Page({ params, searchParams }) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const locale = await getLocale();

  let category;
  try {
    category = await getCategory(slug, { locale });
  } catch (error) {
    console.error(`[categories/[slug] page] getCategory failed slug=${slug}`, {
      status: error?.status,
      code: error?.code,
      message: error?.message,
    });
    throw error;
  }

  if (!category) notFound();

  const rawPage = Array.isArray(resolvedSearchParams?.page)
    ? resolvedSearchParams.page[0]
    : resolvedSearchParams?.page;
  const page = Number(rawPage) > 0 ? Number(rawPage) : 1;

  return <CategoryDetailsPage category={category} page={page} />;
}
