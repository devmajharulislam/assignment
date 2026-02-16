import NavBar from "@/components/ui/NavBar";
import "./globals.css";
// import NavBar from "@/components/ui/NavBar";
import AuthProvider from "@/components/ui/AuthInitializer";
import AuthInitializer from "@/components/ui/AuthInitializer";
import Footer from "@/components/Footer";
// import AppLayout from "@/components/ui/AppLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-black">
        <AuthInitializer/>
          {/* <Navbar /> */}
          <main className=" ">
            {/* <Navbar /> */}
    
              <NavBar/>
              {children}
    <Footer/>
          </main>
        
      </body>
    </html>
  );
}
