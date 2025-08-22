"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "../../public/logos.jpeg";

type SubMenu = {
  title: string;
  href?: string;
  onClick?: () => void;
};

type MenuItem = {
  title: string;
  href: string;
  subItems: SubMenu[];
};

type ApiSubcategory ={
  _id:string
  title:string
  href: string
  onClick: ()=> void
}

type ApiCategory={
  _id:string
  title:string
  subcategory:ApiSubcategory[]
}


// type ServiceCategory ={
// category:string
// subcategory:string
// }



const publicMenuItems: MenuItem[] = [
  {
    title: "For Provider",
    href: "/",
     subItems: [
 {
    title: "View All Contract Jobs",
    href: "/jobs",
  },
  {
    title: "Pricing & Plans",
    href: "/all-plans",
  },
  {
    title: "Help & Support",
    href: "/contact_us",
  },
   {
    title: "Sign Up",
    href: "/providers/register",
  },
   {
    title: "Log In",
    href: "/users/login",
  },

    ],
  },
    {
    title: "For Employer",
    href: "/provider/dashboard",
     subItems: [
 {
    title: "View All Contract Jobs",
    href: "/jobs",
  },
  {
    title: "Pricing & Plans",
    href: "/applications",
  },
  {
    title: "Help & Support",
    href: "/applications",
  },
   {
    title: "SignUp",
    href: "/employers/register",
  },
  {
    title: "Login",
    href: "/users/login",
  },
  //  {
  //   title: "Dashboard",
  //   href: "/applications",
  // },
  //  {
  //   title: "Logout",
  //   onClick: () => signOut({ callbackUrl: "/" })
  // },

    ],
  },
   {
    title: "Browse 946+Jobs",
    href: "/jobs",
    subItems: []
    }
  
];

const EmployerMenuItems: MenuItem[] = [
  // {
  //   title: "For Provider",
  //   href: "/provider/dashboard",
  //   subItems: [],
  // },
  {
    title: "Employer Jobs",
    href: "/employer/job-list",
    subItems: [
      { title: "Post Job", href: "/employer/jobs" },
      { title: "Manage Jobs", href: "/employer/job-list" },
    ],
  },
  {
    title: "Account",
    href: "/provider/account",
    subItems: [
      // { title: "Profile", href: "/provider/account/profile" },
      { title: "Settings", href: "/employer/setting" },
      { title: "Logout", onClick: () => signOut({ callbackUrl: "/" }) },
    ],
  },
   {
    title: "Dashboard", 
    href: "/employer/dashboard",
    subItems: [
      // { title: "Profile", href: "/provider/account/profile" },
      // { title: "Settings", href: "/provider/account/settings" },
      // { title: "Logout", onClick: () => signOut({ callbackUrl: "/" }) },
    ],
  },
];


const ProviderMenuItems :MenuItem[]= [
  {
    title: "For Provider",
    href: "/jobs",
    subItems: [
 {
    title: "View All Contract Jobs",
    href: "/jobs",
  },
  {
    title: "Pricing & Plans",
    href: "/all-plans",
  },
  {
    title: "Help & Support",
    href: "/contact_us",
  },
   {
    title: "Dashboard",
    href: "/provider/dashboard",
  },
   {
    title: "Logout",
    onClick: () => signOut({ callbackUrl: "/" })
  },

    ],
  },
  { 
    title: "Dashboard",
    href: "/provider/dashboard",
    subItems: []
  }

]

// const CompanyMenuItem :MenuItem[]= [
//   {
//     title: "Job Listings",
//     href: "/jobs",
//     subItems: [],
//   },
//   {
//     title: "My Applications",
//     href: "/applications",
//     subItems: [],
//   },
//   {
//     title: "Account",
//     href: "/account",
//     subItems: [
//       { title: "Profile", href: "/account/profile" },
//       { title: "Settings", href: "/account/settings" },
//       { title: "Logout", onClick: () => signOut({ callbackUrl: "/" }) },
//     ],
//   },
//   {
//     title: "Dashboard",
//     href: "/dashboard",
//     subItems: [
//       // { title: "Profile", href: "/provider/account/profile" },
//       { title: "Company", href: "/provider/account/settings" },
//       { title: "Logout", onClick: () => signOut({ callbackUrl: "/" }) },
//     ],
//   },
// ]
const adminMenuItems: MenuItem[] = [
   {
    title: "Staff-List",
    href: "/admin/staffs",
    subItems: [
      // { title: 'Profile', href: '/provider/account/profile' },
      // { title: 'Settings', href: '/provider/account/settings'},
    ],
  },
   {
    title: "Staff-Requests",
    href: "/admin/staff-requests",
    subItems: [
      // { title: 'Profile', href: '/provider/account/profile' },
      // { title: 'Settings', href: '/provider/account/settings'},
    ],
  },
  {
    title: "Jobs",
    href: "/admin/jobs",
    subItems: [
      // { title: 'Profile', href: '/provider/account/profile' },
      // { title: 'Settings', href: '/provider/account/settings'},
    ],
  },
  {
    title: "Requests",
    href: "/admin/requests",
    subItems: [
      // { title: 'Profile', href: '/provider/account/profile' },
      // { title: 'Settings', href: '/provider/account/settings'},
    ],
  },
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    subItems: [
    { title: 'Profile', href: '' },
    { title: "Logout", onClick: () => signOut({ callbackUrl: "/" }) },
      // { title: 'Settings', href: '/provider/account/settings'},
    ],
  },
];

const Header = () => {
  const { data: session } = useSession();
  const role = (session?.user?.role ?? "public") as string;

  let menuToRender: MenuItem[] = [];
  switch (role) {
    case "employer":
      menuToRender = EmployerMenuItems;
      break;
    case "admin":
      menuToRender = adminMenuItems;
      break;
      case "provider":
      menuToRender = ProviderMenuItems;
      break;
    default:
      menuToRender = publicMenuItems;
      break;
  }



  const [, setMenuItems] = useState<MenuItem[]>([]);

useEffect(()=>{
const fetchDatas = async()=>{
  try{
  const res = await fetch('/api/auth/categories/get')
  const data = await res.json()
  const dynamicMenuItems :MenuItem[] = data.category.map((cat:ApiCategory)=> ({
  title: cat.title,
  href:'',
  subCategories: cat.subcategory.map((sub:ApiSubcategory)=> ({
    title:sub.title,
    href:`/category/${cat._id}/subcategory/${sub._id}`,

  }))
 }))
    const staticMenu: MenuItem[] = [
          {
            title: 'Provider Dashboard',
            href: '/provider/dashboard',
            subItems: [],
          },
          {
            title: 'Provider Jobs',
            href: '/provider/jobs',
            subItems: [
              { title: 'Post Job', href: '/provider/jobs' },
              { title: 'Manage Jobs', href: '/provider/job-list' },
            ],
          },
          {
            title: 'Account',
            href: '/provider/account',
            subItems: [
              { title: 'Profile', href: '/provider/account/profile' },
              { title: 'Settings', href: '/provider/account/settings' },
            ],
          },
        ];

        setMenuItems([...staticMenu, ...dynamicMenuItems]);

      }
      catch (err) {
        console.error('Failed to fetch menu:', err);
      }
    };
    fetchDatas();
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState<number | null>(null);

  const toggleSubmenu = (index: number) => {
    setOpenSubmenuIndex(openSubmenuIndex === index ? null : index);
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image src={logo} alt="logo" width={220} height={100} />
              {/* <p className="hidden sm:block text-xs">
                World&apos;s #1 B2B Staff Augmentation Marketplace
              </p> */}
            </Link>
          </div>

          <ul className="hidden md:flex space-x-6 font-medium text-gray-700 items-center">
            {menuToRender.map((menu, index) => (
              <li key={index} className="relative group">
                <Link href={menu.href}>{menu.title}</Link>

                {menu.subItems.length > 0 && (
                  <ul className="absolute left-0 top-full mt-2 w-56 bg-white border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50">
                    {menu.subItems.map((item, subIndex) => (
                      item.onClick ? (
                        <li key={subIndex}>
                          <button
                            onClick={item.onClick}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            {item.title}
                          </button>
                        </li>
                      ) : (
                        <li
                          key={subIndex}
                          className="px-4 py-2 hover:bg-gray-100"
                        >
                          <Link href={item.href!}>{item.title}</Link>
                        </li>
                      )
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-2 bg-white rounded-lg shadow-lg p-4 space-y-4">
            {menuToRender.map((menu, index) => (
              <div key={index}>
                <button
                  className="w-full flex justify-between items-center font-semibold text-gray-800 hover:text-blue-600"
                  onClick={() => toggleSubmenu(index)}
                >
                  {menu.title}
                  <ChevronDown
                    size={18}
                    className={`transform transition-transform ${
                      openSubmenuIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSubmenuIndex === index && (
                  <ul className="pl-4 mt-2 space-y-2">
                    {menu.subItems.map((item, subIndex) => (
                      item.onClick ? (
                        <li key={subIndex}>
                          <button
                            onClick={item.onClick}
                            className="text-left w-full hover:underline"
                          >
                            {item.title}
                          </button>
                        </li>
                      ) : (
                        <li key={subIndex}>
                          <Link href={item.href!}>{item.title}</Link>
                        </li>
                      )
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;