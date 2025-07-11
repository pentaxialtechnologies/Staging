import { ProviderSideBar } from "@/Components/Provider/ProviderSideBar";
import { ProviderHeader } from "@/Components/Provider/ProviderHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <ProviderSideBar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <ProviderHeader />
        <main className="p-4 overflow-y-auto min-h-0">{children}</main>
      </div>
    </div>
  );
}
