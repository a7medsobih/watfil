import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  extractSession,
  getCustomerMe,
  logoutCustomer,
} from "@/features/auth/api/customer-auth";
import {
  clearCustomerTokenCookie,
  setCustomerTokenCookie,
} from "@/lib/auth/customer-token";
import { useLikesStore } from "@/stores/likes-store";

/**
 * Customer auth session (token + profile).
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isHydrated: false,

      setHydrated: (isHydrated = true) => set({ isHydrated }),

      setSession: ({ token, user }) => {
        const nextToken = token ?? null;
        if (nextToken) setCustomerTokenCookie(nextToken);
        else clearCustomerTokenCookie();
        set({
          token: nextToken,
          user: user ?? null,
        });
      },

      setUser: (user) => set({ user }),

      clearSession: () => {
        clearCustomerTokenCookie();
        useLikesStore.getState().clear();
        set({ token: null, user: null });
      },

      /**
       * Persist session from login / register-verify response.
       */
      applyAuthResponse: (response) => {
        const { token, user } = extractSession(response);
        if (!token) {
          throw new Error("Missing auth token in response");
        }
        setCustomerTokenCookie(token);
        set({ token, user });
        return { token, user };
      },

      refreshMe: async () => {
        const { token } = get();
        if (!token) return null;

        try {
          const response = await getCustomerMe(token);
          const { user } = extractSession(response);
          if (user) set({ user });
          return user;
        } catch (error) {
          if (error?.status === 401 || error?.status === 403) {
            clearCustomerTokenCookie();
            useLikesStore.getState().clear();
            set({ token: null, user: null });
          }
          throw error;
        }
      },

      logout: async () => {
        const { token } = get();
        try {
          if (token) await logoutCustomer(token);
        } catch {
          // Clear local session even if the API call fails.
        } finally {
          clearCustomerTokenCookie();
          useLikesStore.getState().clear();
          set({ token: null, user: null });
        }
      },
    }),
    {
      name: "watfil-auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) setCustomerTokenCookie(state.token);
        else clearCustomerTokenCookie();
        state?.setHydrated(true);
      },
    },
  ),
);

export function useIsAuthenticated() {
  return useAuthStore((state) => Boolean(state.token && state.user));
}
