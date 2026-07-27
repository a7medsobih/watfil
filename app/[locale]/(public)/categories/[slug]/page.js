import { CategoryDetailsPage } from "@/features/categories";
import { getCategories } from "@/features/categories/api";
import { categories as homeCategories } from "@/features/home/data/categories";

/** Categories change infrequently. */
export const revalidate = 3600;

/**
 * Pre-render known category slugs (home teaser + API ids as fallback).
 */
export async function generateStaticParams() {
  const slugs = new Set(
    (homeCategories || []).map((item) => item.slug).filter(Boolean),
  );

  try {
    const apiCategories = await getCategories();
    for (const category of apiCategories || []) {
      if (category?.slug) slugs.add(category.slug);
      else if (category?.id != null) slugs.add(String(category.id));
    }
  } catch {
    // Fall back to home mock slugs only.
  }

  return Array.from(slugs)
    .slice(0, 50)
    .map((slug) => ({ slug }));
}

export default async function Page({ params }) {
  const { slug } = await params;
  return <CategoryDetailsPage slug={slug} />;
}
