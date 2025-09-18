"use client";

import React, { useMemo, useState } from "react";
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
  subItems?: SubMenu[];
};

// Role-based menus
const menus: Record<string, MenuItem[]> = {
  public: [
    {
      title: "For Provider",
      href: "/",
      subItems: [
        { title: "View All Contract Jobs", href: "/jobs" },
        { title: "Pricing & Plans", href: "/all-plans" },
        { title: "Help & Support", href: "/contact_us" },
        { title: "Sign Up", href: "/providers/register" },
        { title: "Log In", href: "/users/login" },
      ],
    },
    {
      title: "For Employer",
      href: "/provider/dashboard",
      subItems: [
        { title: "View All Contract Jobs", href: "/jobs" },
        { title: "Pricing & Plans", href: "/applications" },
        { title: "Help & Support", href: "/applications" },
        { title: "SignUp", href: "/employers/register" },
        { title: "Login", href: "/users/login" },
      ],
    },
    { title: "Browse 946+Jobs", href: "/jobs" },
  ],
  employer: [
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
        { title: "Settings", href: "/employer/setting" },
        { title: "Logout", onClick: () => signOut({ callbackUrl: "/" }) },
      ],
    },
    { title: "Dashboard", href: "/employer/dashboard" },
  ],
  provider: [
    {
      title: "For Provider",
      href: "/jobs",
      subItems: [
        { title: "View All Contract Jobs", href: "/jobs" },
        { title: "Pricing & Plans", href: "/all-plans" },
        { title: "Help & Support", href: "/contact_us" },
        { title: "Dashboard", href: "/provider/dashboard" },
        { title: "Logout", onClick: () => signOut({ callbackUrl: "/" }) },
      ],
    },
    { title: "Dashboard", href: "/provider/dashboard" },
  ],
  admin: [
    { title: "Staff-List", href: "/admin/staffs" },
    { title: "Staff-Requests", href: "/admin/staff-requests" },
    { title: "Jobs", href: "/admin/jobs" },
    { title: "Requests", href: "/admin/requests" },
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      subItems: [
        { title: "Profile", href: "" },
        { title: "Logout", onClick: () => signOut({ callbackUrl: "/" }) },
      ],
    },
  ],
};

const Header = () => {
const { data: session, status } = useSession();

 const role = (session?.user?.role ?? "public") as string;
const menuToRender: MenuItem[] = menus[role] || menus["public"];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState<number | null>(null);

  const toggleSubmenu = (index: number) =>
    setOpenSubmenuIndex(openSubmenuIndex === index ? null : index);

  // Render submenu items for desktop & mobile
  const renderSubItems = (subItems?: SubMenu[]) =>
    subItems?.map((item, i) =>
      item.onClick ? (
        <li key={i}>
          <button
            onClick={item.onClick}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            {item.title}
          </button>
        </li>
      ) : (
        <li key={i} className="px-4 py-2 hover:bg-gray-100">
          <Link href={item.href!}>{item.title}</Link>
        </li>
      )
    );

  return (
    <header className="bg-white sticky top-0 z-50 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image src={logo} alt="logo" width={220} height={100} />
            </Link>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6 font-medium text-gray-700 items-center">
            {menuToRender.map((menu, idx) => (
              <li key={idx} className="relative group">
                <Link href={menu.href}>{menu.title}</Link>
                {menu.subItems?.length && (
                  <ul className="absolute left-0 top-full mt-2 w-56 bg-white border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50">
                    {renderSubItems(menu.subItems)}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 bg-white rounded-lg shadow-lg p-4 space-y-4">
            {menuToRender.map((menu, idx) => (
              <div key={idx}>
                <button
                  className="w-full flex justify-between items-center font-semibold text-gray-800 hover:text-blue-600"
                  onClick={() => toggleSubmenu(idx)}
                >
                  {menu.title}
                  {menu.subItems?.length && (
                    <ChevronDown
                      size={18}
                      className={`transform transition-transform ${
                        openSubmenuIndex === idx ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
                {openSubmenuIndex === idx && menu.subItems?.length && (
                  <ul className="pl-4 mt-2 space-y-2">{renderSubItems(menu.subItems)}</ul>
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



// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useSession, signOut } from "next-auth/react";
// import { Menu, X, ChevronDown } from "lucide-react";
// import logo from "../../public/logos.jpeg";

// type SubMenu = {
//   title: string;
//   href?: string;
//   onClick?: () => void;
// };

// type MenuItem = {
//   title: string;
//   href: string;
//   subItems: SubMenu[];
// };

// type ApiSubcategory ={
//   _id:string
//   title:string
//   href: string
//   onClick: ()=> void
// }

// type ApiCategory={
//   _id:string
//   title:string
//   subcategory:ApiSubcategory[]
// }


// // type ServiceCategory ={
// // category:string
// // subcategory:string
// // }



// const publicMenuItems: MenuItem[] = [
//   {
//     title: "For Provider",
//     href: "/",
//      subItems: [
//  {
//     title: "View All Contract Jobs",
//     href: "/jobs",
//   },
//   {
//     title: "Pricing & Plans",
//     href: "/all-plans",
//   },
//   {
//     title: "Help & Support",
//     href: "/contact_us",
//   },
//    {
//     title: "Sign Up",
//     href: "/providers/register",
//   },
//    {
//     title: "Log In",
//     href: "/users/login",
//   },

//     ],
//   },
//     {
//     title: "For Employer",
//     href: "/provider/dashboard",
//      subItems: [
//  {
//     title: "View All Contract Jobs",
//     href: "/jobs",
//   },
//   {
//     title: "Pricing & Plans",
//     href: "/applications",
//   },
//   {
//     title: "Help & Support",
//     href: "/applications",
//   },
//    {
//     title: "SignUp",
//     href: "/employers/register",
//   },
//   {
//     title: "Login",
//     href: "/users/login",
//   },
 

//     ],
//   },
//    {
//     title: "Browse 946+Jobs",
//     href: "/jobs",
//     subItems: []
//     }
  
// ];

// const EmployerMenuItems: MenuItem[] = [

//   {
//     title: "Employer Jobs",
//     href: "/employer/job-list",
//     subItems: [
//       { title: "Post Job", href: "/employer/jobs" },
//       { title: "Manage Jobs", href: "/employer/job-list" },
//     ],
//   },
//   {
//     title: "Account",
//     href: "/provider/account",
//     subItems: [
      
//       { title: "Settings", href: "/employer/setting" },
//       { title: "Logout", onClick: () => signOut({ callbackUrl: "/" }) },
//     ],
//   },
//    {
//     title: "Dashboard", 
//     href: "/employer/dashboard",
//     subItems: [
     
//     ],
//   },
// ];


// const ProviderMenuItems :MenuItem[]= [
//   {
//     title: "For Provider",
//     href: "/jobs",
//     subItems: [
//  {
//     title: "View All Contract Jobs",
//     href: "/jobs",
//   },
//   {
//     title: "Pricing & Plans",
//     href: "/all-plans",
//   },
//   {
//     title: "Help & Support",
//     href: "/contact_us",
//   },
//    {
//     title: "Dashboard",
//     href: "/provider/dashboard",
//   },
//    {
//     title: "Logout",
//     onClick: () => signOut({ callbackUrl: "/" })
//   },

//     ],
//   },
//   { 
//     title: "Dashboard",
//     href: "/provider/dashboard",
//     subItems: []
//   }

// ]


// const adminMenuItems: MenuItem[] = [
//    {
//     title: "Staff-List",
//     href: "/admin/staffs",
//     subItems: [
    
//     ],
//   },
//    {
//     title: "Staff-Requests",
//     href: "/admin/staff-requests",
//     subItems: [
     
//     ],
//   },
//   {
//     title: "Jobs",
//     href: "/admin/jobs",
//     subItems: [
     
//     ],
//   },
//   {
//     title: "Requests",
//     href: "/admin/requests",
//     subItems: [
     
//     ],
//   },
//   {
//     title: "Dashboard",
//     href: "/admin/dashboard",
//     subItems: [
//     { title: 'Profile', href: '' },
//     { title: "Logout", onClick: () => signOut({ callbackUrl: "/" }) },
      
//     ],
//   },
// ];

// const Header = () => {
//   const { data: session } = useSession();
//   const role = (session?.user?.role ?? "public") as string;

//   let menuToRender: MenuItem[] = [];
//   switch (role) {
//     case "employer":
//       menuToRender = EmployerMenuItems;
//       break;
//     case "admin":
//       menuToRender = adminMenuItems;
//       break;
//       case "provider":
//       menuToRender = ProviderMenuItems;
//       break;
//     default:
//       menuToRender = publicMenuItems;
//       break;
//   }



//   const [, setMenuItems] = useState<MenuItem[]>([]);

//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [openSubmenuIndex, setOpenSubmenuIndex] = useState<number | null>(null);

//   const toggleSubmenu = (index: number) => {
//     setOpenSubmenuIndex(openSubmenuIndex === index ? null : index);
//   };

//   return (
//     <header className="bg-white sticky top-0 z-50 shadow-md">
//       <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-20">
//           <div className="flex-shrink-0">
//             <Link href="/">
//               <Image src={logo} alt="logo" width={220} height={100} />
//               {/* <p className="hidden sm:block text-xs">
//                 World&apos;s #1 B2B Staff Augmentation Marketplace
//               </p> */}
//             </Link>
//           </div>

//           <ul className="hidden md:flex space-x-6 font-medium text-gray-700 items-center">
//             {menuToRender.map((menu, index) => (
//               <li key={index} className="relative group">
//                 <Link href={menu.href}>{menu.title}</Link>

//                 {menu.subItems.length > 0 && (
//                   <ul className="absolute left-0 top-full mt-2 w-56 bg-white border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50">
//                     {menu.subItems.map((item, subIndex) => (
//                       item.onClick ? (
//                         <li key={subIndex}>
//                           <button
//                             onClick={item.onClick}
//                             className="w-full text-left px-4 py-2 hover:bg-gray-100"
//                           >
//                             {item.title}
//                           </button>
//                         </li>
//                       ) : (
//                         <li
//                           key={subIndex}
//                           className="px-4 py-2 hover:bg-gray-100"
//                         >
//                           <Link href={item.href!}>{item.title}</Link>
//                         </li>
//                       )
//                     ))}
//                   </ul>
//                 )}
//               </li>
//             ))}
//           </ul>

//           <button
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
//           >
//             {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>

//         {mobileMenuOpen && (
//           <div className="md:hidden mt-2 bg-white rounded-lg shadow-lg p-4 space-y-4">
//             {menuToRender.map((menu, index) => (
//               <div key={index}>
//                 <button
//                   className="w-full flex justify-between items-center font-semibold text-gray-800 hover:text-blue-600"
//                   onClick={() => toggleSubmenu(index)}
//                 >
//                   {menu.title}
//                   <ChevronDown
//                     size={18}
//                     className={`transform transition-transform ${
//                       openSubmenuIndex === index ? "rotate-180" : ""
//                     }`}
//                   />
//                 </button>
//                 {openSubmenuIndex === index && (
//                   <ul className="pl-4 mt-2 space-y-2">
//                     {menu.subItems.map((item, subIndex) => (
//                       item.onClick ? (
//                         <li key={subIndex}>
//                           <button
//                             onClick={item.onClick}
//                             className="text-left w-full hover:underline"
//                           >
//                             {item.title}
//                           </button>
//                         </li>
//                       ) : (
//                         <li key={subIndex}>
//                           <Link href={item.href!}>{item.title}</Link>
//                         </li>
//                       )
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </nav>
//     </header>
//   );
// };

// export default Header;