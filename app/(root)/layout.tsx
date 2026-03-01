import Footer from "@/components/ui/Footer";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/ui/NavBar";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  
    <>
        <Navbar/>
        <AuthGuard>{children}</AuthGuard>
      <Footer/>
    </>
     
  );
}
