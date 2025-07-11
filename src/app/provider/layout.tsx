import { CompanyHeader } from "@/Components/company/CompanyHeader";
import { CompanySideBar } from "@/Components/company/CompanySideBar";

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <CompanyHeader />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-white border-r overflow-y-auto hidden lg:block">
          <CompanySideBar />
        </aside>
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">{children}</div>
      </div>
    </div>
  );
}
