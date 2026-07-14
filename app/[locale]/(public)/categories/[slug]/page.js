import { CategoryDetailsPage } from "@/features/categories";

export default async function Page({ params }) {
  const { slug } = await params;
  return <CategoryDetailsPage slug={slug} />;
}
