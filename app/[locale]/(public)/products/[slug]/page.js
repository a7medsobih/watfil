import { ProductDetailsPage } from "@/features/products";

export default async function Page({ params }) {
  const { slug } = await params;
  return <ProductDetailsPage slug={slug} />;
}
