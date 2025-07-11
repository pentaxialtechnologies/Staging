import { JobSeekerHeader } from "@/Components/JobSeeker/JobSeekerHeader";
import { JobSeekerSideBar } from "@/Components/JobSeeker/ProviderSideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <JobSeekerSideBar />
      <div className="flex flex-col flex-1">
        <JobSeekerHeader />
        <main className="p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
