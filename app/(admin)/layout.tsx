
import Footer from "@/components/ui/Footer";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/ui/NavBar";
import { AdminCheck } from "@/components-admin/AdminCheck";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   
   <AdminCheck>
    
       {children}
   </AdminCheck>
   
  
  );
}
