"use client";

import dynamic from "next/dynamic";

import { ProductCardSkeletonGrid } from "@/components/skeletons";

/**
 * Lazy Embla SectionCarousel for below-the-fold home / list sections.
 * Keeps a dimension-matched skeleton until the carousel chunk loads.
 */
const SectionCarousel = dynamic(
  () => import("@/components/common/SectionCarousel"),
  {
    ssr: true,
    loading: () => (
      <ProductCardSkeletonGrid
        count={4}
        className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      />
    ),
  },
);

export default SectionCarousel;
