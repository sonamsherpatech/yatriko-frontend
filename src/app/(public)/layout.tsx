import Footer from "@/lib/components/Footer/Footer";
import NavBar from "@/lib/components/Navbar/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
}
