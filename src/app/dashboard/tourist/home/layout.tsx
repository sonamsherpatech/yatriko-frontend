import Footer from "@/lib/components/Footer/Footer";
import NavBar from "@/lib/components/Navbar/Navbar";

export default function LandingPageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <NavBar />
      {children}
      <Footer />
    </div>
  );
}
