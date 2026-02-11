import "./globals.css";
import Navbar from "@/components/ui/NavBar";
import AuthProvider from "@/components/ui/AuthProvider";
import AppLayout from "@/components/ui/AppLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-black">
        <AuthProvider>
          {/* <Navbar /> */}
          <main className=" ">
            <Navbar />
            <AppLayout>
              {children}
            </AppLayout>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
