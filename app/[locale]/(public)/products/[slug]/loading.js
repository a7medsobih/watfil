import ProductDetailSkeleton from "@/components/skeletons/ProductDetailSkeleton";

/**
 * Product detail route loading UI.
 * Scoped to [slug] so list /products loading does not flash here.
 */
export default function Loading() {
  return <ProductDetailSkeleton />;
}
