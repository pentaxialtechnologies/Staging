'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LayoutDashboard,
  User2,
  ChevronRight,
  ChevronDown,
  LucideIcon,
  Building2,
  User,
  Palette,
  Settings,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type SideBarItem = {
  name: string;
  href?: string;
  icon: LucideIcon;
  subItems?: {

    icon: any;
    name: string;
    href: string;
  }[];
};

export const CompanySideBar = () => {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const sideBarItems: SideBarItem[] = [
    {
      name: "Dashboard",
      href: "/provider/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Organization",
      icon: Building2,
      href:'/provider/profile',
      subItems: [
        { name: "About", href: "/provider/profile",icon:User },
        { name: "Portfolio", href: "/provider/profile/portfolio",icon:Palette},
      ],
    },
    {
      name: "Deploy your Bench",
      href: "/provider/list-staffs",
      icon: User2,
    },
    {
      name: "Offers & Proposals",
      href: "/provider/offers",
      icon: FileText,
    },
    {
      name: "Setting",
      href: "/provider/setting",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-60 h-full bg-white p-4 shadow-md">
      <ul className="space-y-5">
        {sideBarItems.map((item, index) => (
          <li key={`${item.name}-${index}`}>
            {item.subItems ? (
              <>
                <div
                  onClick={() => toggleMenu(item.name)}
                  className="flex items-center justify-between p-3 rounded cursor-pointer hover:text-white hover:bg-blue-400"
                >
                    <item.icon className="w-6 h-6 text-gray-700 " />

                  <div className="flex items-center gap-4">
                    <span className="font-bold">{item.name}</span>
                  </div>
                  {openMenus[item.name] ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </div>
                {openMenus[item.name] && (
                  <ul className="ml-10 mt-2 space-y-2">
                    {item.subItems.map((subItem, subIndex) => (
                      <li key={`${subItem.name}-${subIndex}`}>
                     <subItem.icon className="w-6 h-6 text-gray-700" />

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
