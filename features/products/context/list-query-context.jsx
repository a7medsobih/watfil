"use client";

import { createContext, useContext } from "react";

const ListQueryContext = createContext(null);

/**
 * Shares URL list-query state (params / update / reset / isPending)
 * so Search, Filters, and ActiveFilters stay in sync without prop drilling.
 */
export function ListQueryProvider({ value, children }) {
  return (
    <ListQueryContext.Provider value={value}>
      {children}
    </ListQueryContext.Provider>
  );
}

export function useListQueryContext() {
  return useContext(ListQueryContext);
}
