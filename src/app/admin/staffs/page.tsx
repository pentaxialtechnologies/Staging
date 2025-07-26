'use client'
import { Search } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

interface staffData {
  isApproved: boolean;
  updatedAt: Date
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  OrgId: any
  _id: string
  primarySkills: string
  rateType: string
  workFrom: string
  engagementType: string
  availability: string
  availableAtClientLocation: string
  averageExperience: string
  designation: string
  numberBenchStaff: string
  skills: string[]
}

const Page = () => {
const Item_Per_Page = 5

const [filtered,setFiltered] = useState<staffData[]>([])
const [search,setsearch] = useState('')
const [page, setPage] = useState(1)
const [Staff,setStaff] = useState<staffData[]>([])
const [loading,setLoading] = useState(true)

const fetchData = async()=>{
    try{
 const res = await fetch('/api/auth/organization/staff/staff-lists')
            if(!res.ok){
               throw new Error('Error fetching Data')
            }
             const data = await res.json();
            console.log('data',data.staff);
            setStaff(data.staff)
            setFiltered(data.staff)
          }
          catch(error){
            console.error(error);
          }
          finally{
            setLoading(false)
          }
        }
    useEffect(()=>{
        fetchData()
    },[])


const handleSearch = async(e: React.ChangeEvent<HTMLInputElement>)=>{
const value = e.target.value
setsearch(value);
const result = Staff.filter((s)=>
s.designation.toLowerCase().includes(value.toLowerCase()) ||
s.primarySkills.toLowerCase().includes(value.toLowerCase())
)
setFiltered(result)
setPage(1) // Reset pagination on search
} 



const Paginated = filtered.slice((page -1) * Item_Per_Page,page * Item_Per_Page)

const TotalPages = Math.ceil(filtered.length /Item_Per_Page)


const handleStatusApprove = async(id:string, isApproved: boolean)=>{
try{
const res = await fetch(`/api/auth/admin/staff/${id}`,{
  method:'PUT',
  headers:{
    'content-Type':'application/json'
  },
  body:JSON.stringify({isApproved})
})
if(!res.ok){
  throw new Error('Update Failed')
}
setStaff((prevData)=> prevData.map((staff)=> staff._id === id ? {...staff,isApproved}: staff))
alert(`Status Updated to ${isApproved ? 'Approved': 'rejected'}`)
await fetchData()
}
catch(error){
  console.error(error); 
}
}
const handleStatusHold = async(id:string,isApproved:boolean)=>{
  try{
const res = await fetch(`/api/auth/admin/staff/${id}`,{
  method:"PUT",
  headers:{
    'content-Type' : 'application/json'
  },
  body:JSON.stringify({isApproved})
})

if(res.ok){
  setStaff((prevData)=> prevData.map((staff)=> staff._id === id ? {...staff,isApproved}: staff))
  alert(`Status Updated to ${isApproved ? 'Approved': 'rejected'}`)
await fetchData()
}
}
catch(error){
  console.error(error); 
}
}

  return (
    <div className='w-full min-h- bg-gray-50 px-4 py-6 sm:px-6 lg:px-10'>
        <h1 className='text-3xl font-bold text-center '>Staff&apos;s List</h1>
{/* search bar  */}
<div className='w-full max-x-xl mx-auto mb-6 mt-5'>
  <div className='relative'>
  <Search className='absolute top-1/2 left-3 -translate-y-1/2'  />
  <input type='search' value={search} onChange={handleSearch}   placeholder="Search by designation or skill..." className='w-full px-4 py-2 pl-10 pr-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 '  />
  </div>

</div>

{loading ? (
  <p>Loading...</p>
): filtered.length === 0 ?(
  <p>No staff found</p>
):(
<div className='flex flex-col gap-6 p-6'>
  {Paginated.map((staffs)=> (
    <div key={staffs._id} className='bg-white p-6 border border-gray-150 shadow-md transition'>
      <div className='flex flex-row gap-8  mb-5 '>
        <div>
          <Image src={staffs.OrgId.companylogo} width={200} height={100} alt='logo' className='object-cover w-60 h-auto rounded' />
        </div>
        <div>
          <p className='text-xl sm:text-2xl'>{staffs.OrgId.company_name}</p>
        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
        <div className='text-sm text-gray-800 gap-5'>
            <p><strong>Primary Skills:</strong> {staffs.primarySkills}</p>
                  <p><strong>Designation:</strong> {staffs.designation}</p>
                  <p><strong>No. of Bench Staff:</strong> {staffs.numberBenchStaff}</p>
                  <p><strong>Rate Type:</strong> {staffs.rateType}</p>
                  <p><strong>Experience:</strong> {staffs.averageExperience} years</p>
          </div>
          <div className='text-sm text-gray-800'>
             <p><strong>Work From:</strong> {staffs.workFrom}</p>
                  <p><strong>Engagement Type:</strong> {staffs.engagementType}</p>
                  <p><strong>Availability:</strong> {staffs.availability}</p>
                  <p><strong>Client Location:</strong> {staffs.availableAtClientLocation}</p>
                  <p><strong>Active Date :</strong> {new Date(staffs.updatedAt).toLocaleString('en-GB',{
                    day: '2-digit',
                    month:'long',
                    year:'numeric'
                  })}</p>
      <p className="font-semibold">
                  Status:{' '}
                  <span
                    className={`ml-1 px-2 py-1 rounded-full text-xs ${
                      staffs.isApproved
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {staffs.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </p>

                  
            </div>
            <div className='flex flex-row gap-6'>
              <button onClick={()=> handleStatusApprove(staffs._id,true)} className='bg-green-200 rounded-full text-green-900 px-4 py-2'>
                Approve
              </button>
              <button onClick={()=> handleStatusHold(staffs._id,false)}  className='bg-red-600 rounded-full text-white px-4 py-2'>
                Hold
              </button>
            </div>
      </div>
      </div>
  ))}
  <div className='flex justify-center items-center gap-4 mt-6'>
    <button disabled={page ===1} onClick={()=>setPage((prev)=> prev-1)}
      className={`px-4 py-2 rounded ${page ===1 ? `bg-green-300 cursor-not-allowed`: 'bg-blue-500 text-white'}`}
      >
        Prev
    </button>
    <span className="text-gray-600 text-sm">Page {page} of {TotalPages}</span>
    <button disabled={page === TotalPages} onClick={()=> setPage((next)=> next +1)} 
    className={`px-4 py-2 rounded ${page === TotalPages ? `bg-gray-300 curor-not-allowed`: 'bg-blue-500 text-white'}`}>
      Next
    </button>
    
    </div>
  </div>
)}
    </div>
  )
}

export default Page