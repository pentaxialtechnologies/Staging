'use client'
import {
  LayoutDashboard,
  Briefcase,
  UserCircle,
  ChevronDown,
  ChevronRight,
  LucideIcon,
  Settings,
  Puzzle,

  Ticket,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type SideBar = {
  name: string;
  href?: string;
  icon: LucideIcon;
  subItems?: {
    name: string;
    href: string;
  }[];
};

export const ProviderSideBar = () => {
  const [openProfile, setOpenProfile] = useState(false);

  const sideBarItems: SideBar[] = [
    {
      name: "Dashboard",
      href: "/employer/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Jobs",
      href: "/employer/jobs",
      icon: Briefcase,
    },
    {
      name: "Profile",
      icon: UserCircle,
      href: "/employer/profile",
    },
    {
      name: "Manage Jobs",
      href: "/employer/job-list",
      icon: Briefcase,
    },
    {
      name: "Proposals",
      href: "/employer/proposal/list",
      icon: Puzzle,
    },
     {
      name: "Ticket",
      href: "/employer/ticket-list",
      icon: Ticket,
    },
     {
      name: "Setting",
      href: "/employer/setting",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 h-full bg-white shadow-2xl p-4">
      <ul className="space-y-5">
        {sideBarItems.map((item, index) => (
          <li key={`${item.name}-${index}`}>
            {item.subItems ? (
              <>
                <div
                  className="flex items-center justify-between p-3 rounded cursor-pointer hover:text-white hover:bg-blue-400"
                  onClick={() => setOpenProfile(!openProfile)}
                >
                  <div className="flex items-center gap-4">
                    <item.icon className="w-6 h-6 text-gray-700" />
                    <span className="font-bold">{item.name}</span>
                  </div>
                  {openProfile ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </div>
                {openProfile && (
                  <ul className="ml-10 mt-2 space-y-2">
                    {item.subItems.map((subItem, subIndex) => (
                      <li key={`${subItem.name}-${subIndex}`}>
                        <Link
                          href={subItem.href}
                          className="text-sm text-gray-700 hover:text-blue-500"
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <Link
                href={item.href || "#"}
                className="flex items-center gap-4 p-3 rounded hover:text-white hover:bg-blue-400"
              >
                <item.icon className="w-6 h-6 text-gray-700" />
                <span className="font-bold">{item.name}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};
