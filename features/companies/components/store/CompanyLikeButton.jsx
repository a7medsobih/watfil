"use client";

import LikeButton from "@/features/wishlist/components/LikeButton";
import { LIKE_TYPE } from "@/features/wishlist/types";

/**
 * Company heart control — unified LikeButton with company type.
 */
export default function CompanyLikeButton({
  companyId,
  initialLiked = false,
  initialLikesCount = 0,
  onChange,
  className,
  showCount = true,
}) {
  return (
    <LikeButton
      type={LIKE_TYPE.COMPANY}
      id={companyId}
      initialLiked={initialLiked}
      initialLikesCount={initialLikesCount}
      onChange={onChange}
      className={className}
      showCount={showCount}
    />
  );
}
