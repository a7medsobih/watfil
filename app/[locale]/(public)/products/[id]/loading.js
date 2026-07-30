import ProductDetailSkeleton from "@/components/skeletons/ProductDetailSkeleton";

/**
 * Product detail route loading UI.
 * Scoped to [id] so list /products loading does not flash here.
 */
export default function Loading() {
  return <ProductDetailSkeleton />;
}
