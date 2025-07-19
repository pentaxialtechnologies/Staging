'use client'
import { Dot, MoreHorizontal } from 'lucide-react'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
const Page = () => {
  const [datas, setDatas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()
const router = useRouter()

  useEffect(() => {
    const FetchData = async () => {
      if (!session?.user?.id) return
      try {
        const res = await fetch(`/api/auth/contractjobs/get/${session.user.id}`)
        if (!res.ok) {
          console.error('Failed to fetch jobs:', res.status)
          return
        }
        const data = await res.json()
        setDatas(data)
        console.log('Jobs fetched:', data)
      } catch (err) {
        console.error('Error fetching jobs:', err)
      } finally {
        setLoading(false)
      }
    }

    FetchData()
  }, [session?.user?.id])

const handleDelete = async (id: string) => {
  try {
    const res = await fetch(`/api/auth/jobs/delete/${id}`, {
      method: 'PUT', // ✅ Use PUT if you're soft-deleting
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isDeleted: true }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert(`Failed to delete job: ${errorData.message || 'Unknown error'}`);
      return;
    }

    alert('Job deleted successfully');
    // Optionally refresh job list here
  } catch (error) {
    console.error('Delete failed:', error);
    alert('Something went wrong while deleting the job');
  }
};


const [IsOpen,setOpen] = useState(false)

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Recent Jobs</h1>
      <span className="block border-b-2 border-blue-600 w-43 mb-4" />

      {loading ? (
        <p>Loading jobs...</p>
      ) : !datas || datas.length === 0 ? (
        <h2 className="text-lg text-gray-600">Jobs Are Empty</h2>
      ) : (
        <div className="space-y-4">
          <div className='flex justify-end'>
          <button className='px-4 py-2 bg-[#f27264] text-white flex items-end justify-end'>View All Job</button>
          </div>
          {datas.map((job: any) => (
            <div key={job._id} className="flex flex-row justify-between p-4 border rounded shadow hover:shadow-lg transition">
                <div>
                 <h1 className="text-2xl mb-2 text-violet-600 rounded hover:text-blue-700">
                {job.title}
              </h1>
               <p>Posted At: {new Date(job.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
              <select>
                <option>Paused</option>
                <option>Open</option>
                <option>Closed</option>
              </select>
            </div>
           <div className='relative inline-block text-left'>
          <button onClick={()=> setOpen(!IsOpen)}> <MoreHorizontal size={20} /></button>
            </div>

{IsOpen && (
   <div className='absolute right-0  mt-8 w-48 bg-white border-gray-200 rounded shadow-xl z-10'>
                <ul className='py-1'>
                  <li onClick={()=>router.push('/edit job') } className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>Edit Job </li>
                  <li onClick={()=>router.push(`/employer/dashboard/${job._id}`) } className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>View Job Details </li>
                  <li onClick={()=>handleDelete(job._id) } className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>Delete job </li>
                  <li onClick={()=>router.push('#') } className='px-4 py-2 hover:bg-gray-100 cursor-pointer'> Invite company</li>
                </ul>
                </div>
)}
           
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Page


