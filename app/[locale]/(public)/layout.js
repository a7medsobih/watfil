import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <LanguageSwitcher />
      <main>{children}</main>
      <Footer />
    </>
  );
}
