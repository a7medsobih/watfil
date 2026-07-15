import Footer from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/navbar";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
