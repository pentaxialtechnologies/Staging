'use client';
import Image from "next/image";
import logo from "../../../public/logos.jpeg";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  ArrowDown,
  Search,

  MessageCircle,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

interface Profile {
  _id: string;
  companylogo: string;
  firstname: string;
  email: string;
}
interface Userprofile{
  userprofile:string
  firstname:string
}
export const EmployerHeader = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [, setUserdata] = useState<Profile | null>(null);
  const [user,setUser] = useState<Userprofile | null>(null)

  const {data:session} = useSession()
const userId = session?.user.id;

useEffect(() => {
  const fetchdata = async () => {
    const res = await fetch('/api/auth/session');
    const data = await res.json();
    setUserdata(data.user);
  };

  const fetchUser = async () => {
    const res = await fetch(`/api/auth/employer/userprofile/update/${userId}`);
    const data = await res.json();
    setUser(data.user);
    console.log(data.user, 'user id for this user'); // ✅ use the correct user here
  };

  fetchdata();
  if (userId) {
    fetchUser();
  }
}, [userId]); 


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);


  const handleLogout =async()=>{
    try{
await signOut({callbackUrl: '/users/login'})
    }
    catch(error){
      console.error(error);
      
    }
  }
  return (
    <header className="bg-blue-600 text-white px-4 py-2 shadow flex items-center justify-between">
    
      <div className="flex items-center gap-3">
        <button className="lg:hidden">
          <Menu className="w-6 h-6" />
        </button>
         <Image src={logo} alt="logo" width={220} height={100} />
      </div>



      <div className="flex flex-row gap-6">
         <div className="flex items-center gap-4">
  
<div className="relative">
  <button onClick={()=> router.push('/company-search')} className="hidden sm:flex items-center gap-2 border border-white px-4 py-2 rounded-full text-white relative">
    <Search size={20} />
    <span className="font-bold">Find Firms</span>
  </button>
</div>

</div>


  {user && (
        <div className="relative" ref={dropdownRef}>
        <button
  onClick={() => setDropdownOpen(!dropdownOpen)}
  className="flex items-center gap-2 text-blue-600 rounded-full border border-white px-4 py-2 transition h-[48px] max-w-[220px] overflow-hidden"
>
  <Image
    src={user.userprofile}
    alt="Profile"
    height={40}
    width={40}
    className="rounded-full object-cover"
  />
  <span className="text-white text-sm font-medium truncate max-w-[120px]">
    {user.firstname}
  </span>
  <ArrowDown className="text-white" />
</button>


          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute mt-2 right-0 w-52 bg-white text-gray-800 rounded-lg shadow-lg z-50">
              <ul className="py-2">
                <li
                  onClick={() => {
                    router.push('/provider/dashboard');
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </li>
                <li
                  onClick={() => {
                    router.push(`/provider/editProfile/`);
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <User size={16} /> Edit Profile
                </li>
                <li
                  onClick={() => {
                    router.push('/provider/setting');
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <Settings size={16} /> Settings
                </li>
                <li
                  onClick={() => {
                    router.push('/provider/help');
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <HelpCircle size={16} /> Terms & Conditions
                </li>
                <li
                  onClick={() => {
                    handleLogout()
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <LogOut size={16} /> Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
      </div>
    
    </header>
  );
};
