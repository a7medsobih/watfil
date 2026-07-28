import { Navbar } from "@/components/layout/navbar";
import StoreShareFooter from "@/features/companies/components/share/StoreShareFooter";

/**
 * Isolated shell for /store/{tax} — no site nav or full footer.
 * Keeps Watfil identity (logo, language, theme) without distraction.
 */
export default function StoreShareLayout({ children }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar variant="minimal" />
      <main className="flex-1">{children}</main>
      <StoreShareFooter />
    </div>
  );
}
