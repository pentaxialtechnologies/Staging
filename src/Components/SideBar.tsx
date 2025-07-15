
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  LucideIcon,
} from "lucide-react";
import Link from 'next/link'
export const Sidebar =()=>{

type SideBar = {
    name:string,
    href:string,
    icon:LucideIcon
}

const sideBarItems:SideBar[] = 
[
{
name:'Dashboard',
href:'/admin/dashboard',
icon:LayoutDashboard
},
{
name:'Jobs',
href:'/admin/jobs',
icon:Briefcase
},

{
name:'Requests',
href:'/admin/requests',
icon:Users
},
{
name:'Staff-Requests',
href:'/admin/staff-requests',
icon:FileText
},
{
name:'Staffs',
href:'/admin/staffs',
icon:FileText
},

]

return (
   <aside className='w-64 h-full border-none shadow-2xl bg-white  p-4'>
<ul className='space-y-5'>
{sideBarItems.map((items)=> (
    <li key={items.name} className='flex items-center gap-3 p-3 rounded hover:text-white hover:bg-blue-400'>
<Link href={items.href} className='flex items-center gap-4'>
<items.icon className='w-7 h-7 text-gray-700 transition hover:rotate-360'/>
<span className="font-bold">{items.name}</span>
</Link>
    </li>
))}
</ul>
   </aside>
)


}