import {
  LayoutDashboard,
  Briefcase,
  Building2,
  Users,
  FileText,
  FileBarChart,
  ShieldCheck,
  Settings,
  LucideIcon,
  LogOut,
} from "lucide-react";
import Link from "next/link";
export const JobSeekerSideBar = () => {
  type SideBar = {
    name: string;
    href: string;
    icon: LucideIcon;
  };

  const sideBarItems: SideBar[] = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Jobs",
      href: "/admin/jobs",
      icon: Briefcase,
    },
    {
      name: "Providers",
      href: "/Providers",
      icon: Building2,
    },
    {
      name: "JobSeekers",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Applications",
      href: "/admin/applications",
      icon: FileText,
    },
    {
      name: "Reports",
      href: "/reports",
      icon: FileBarChart,
    },
    {
      name: "Companys",
      href: "/company",
      icon: ShieldCheck,
    },
    {
      name: "Settings",
      href: "/company",
      icon: Settings,
    },
    {
      name: "Logout",
      href: "/logout",
      icon: LogOut,
    },
  ];

  return (
    <aside className="w-64 h-full border-none shadow-2xl bg-white  p-4">
      <ul className="space-y-5">
        {sideBarItems.map((items) => (
          <li
            key={items.name}
            className="flex items-center gap-3 p-3 rounded hover:text-white hover:bg-blue-400"
          >
            <Link href={items.href} className="flex items-center gap-4">
              <items.icon className="w-7 h-7 text-gray-700 transition hover:rotate-360" />
              <span className="font-bold">{items.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};
