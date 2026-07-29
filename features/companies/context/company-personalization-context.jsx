"use client";

import { createContext, useContext, useEffect } from "react";

const CompanyPersonalizationContext = createContext(null);

/**
 * Lets Suspense personalization islands push `myRating` / `isLiked` into the store page.
 */
export function CompanyPersonalizationProvider({ children, onUpdate }) {
  return (
    <CompanyPersonalizationContext.Provider value={onUpdate}>
      {children}
    </CompanyPersonalizationContext.Provider>
  );
}

/**
 * Client hydrator rendered from the personalization Suspense island.
 */
export function CompanyPersonalizationHydrator({
  myRating = null,
  isLiked = false,
}) {
  const onUpdate = useContext(CompanyPersonalizationContext);

  useEffect(() => {
    onUpdate?.({ myRating, isLiked });
  }, [myRating, isLiked, onUpdate]);

  return null;
}
