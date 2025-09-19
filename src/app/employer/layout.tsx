import { ProviderSideBar } from "@/components/Provider/ProviderSideBar";
import { EmployerHeader } from "@/components/Provider/ProviderHeader";
import type { Metadata } from "next";
import ActiveTracker from "@/components/ActiveTracker";



export const metadata : Metadata ={
  title:'Employer'
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <div className="flex flex-col min-h-screen">
      <ActiveTracker/>
        <EmployerHeader />
  <div className="flex flex-1 overflow-hidden">
      <aside className="w-64 bg-white border-r overflow-y-auto hidden lg:block">
      <ProviderSideBar />
      </aside>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {children}
        </div>
    </div>  
    </div>
  );
}
    