"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import AuthBootstrap from "@/features/auth/components/AuthBootstrap";
import AuthQueryOpener from "@/features/auth/components/AuthQueryOpener";
import { CartHost } from "@/features/cart";

const AuthDialog = dynamic(
  () => import("@/features/auth/components/AuthDialog"),
  { ssr: false },
);

export function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <AuthBootstrap />
      <AuthDialog />
      <CartHost />
      <Suspense fallback={null}>
        <AuthQueryOpener />
      </Suspense>
      <Toaster richColors position="top-center" closeButton />
    </ThemeProvider>
  );
}
