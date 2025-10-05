import Footer from "@/lib/components/Footer/Footer";
import NavBar from "@/lib/components/Navbar/Navbar";

export default function AuthLayout({
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
