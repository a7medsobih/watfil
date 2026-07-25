"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

const CompanyBrandContext = createContext({
  brand: null,
  setBrand: () => {},
});

/**
 * Provides optional company brand override for the public Navbar.
 */
export function CompanyBrandProvider({ children }) {
  const [brand, setBrandState] = useState(null);

  const setBrand = useCallback((next) => {
    setBrandState(next ?? null);
  }, []);

  const value = useMemo(() => ({ brand, setBrand }), [brand, setBrand]);

  return (
    <CompanyBrandContext.Provider value={value}>
      {children}
    </CompanyBrandContext.Provider>
  );
}

export function useCompanyBrand() {
  return useContext(CompanyBrandContext).brand;
}

/**
 * Syncs company brand into the navbar for the duration of the store page.
 */
export function CompanyBrandSetter({ brand }) {
  const { setBrand } = useContext(CompanyBrandContext);

  useLayoutEffect(() => {
    setBrand(brand);
    return () => setBrand(null);
  }, [brand, setBrand]);

  return null;
}
