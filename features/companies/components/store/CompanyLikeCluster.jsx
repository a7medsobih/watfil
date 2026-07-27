"use client";

import { useState } from "react";

import CompanyLikeButton from "@/features/companies/components/store/CompanyLikeButton";

/**
 * Client wrapper so the Suspense island can hydrate like state + live count.
 */
export default function CompanyLikeCluster({
  company,
  initialLiked = false,
  initialLikesCount = 0,
  onCountChange,
}) {
  const [liked, setLiked] = useState(Boolean(initialLiked));

  return (
    <CompanyLikeButton
      companyId={company.id}
      company={{ ...company, isLiked: liked }}
      initialLiked={liked}
      initialLikesCount={initialLikesCount}
      showCount={false}
      onChange={(next) => {
        setLiked(next.liked);
        onCountChange?.(next.likesCount);
      }}
    />
  );
}
