import { HomePageSkeleton } from "@/components/skeletons";

/**
 * Instant loading for `/` (home). Sibling routes each have their own loading.js.
 */
export default function Loading() {
  return <HomePageSkeleton />;
}
