'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import toast,{Toaster} from 'react-hot-toast'
import { useRouter } from 'next/navigation'
  interface Jobs {
    _id:string
    technical_skills: any
    title: string
    skills: string[]
    budget: string;
    rate:string
    status:string
    duration: string
    staff_count:string
    availability: string
    timezone: string
    workmode: string
    job_description: string
    engagement_type:string
    currency_type: string
    payment_schedule:string
    key_responsibilities: string
    joblocation:string
    plannedStartDate:Date
    workmodes :string
    experience: {
    minyears:string
    maxyears:string
  }
   postedBy:{
    _id:string
   } 
  }
const page = () => {
    const {id} = useParams()
    const [JobsData,setJobsData] = useState<Jobs[]>([])
    useEffect(()=>{
        ;(async()=>{
          const res = await fetch(`/api/auth/jobs/${id}`)
          if(!res.ok){
            throw new Error('Failed to fetch')
          }
          const response = await res.json()
          setJobsData([response.data])
          })()  
    },[])
    const router = useRouter()


const handleStatusChange = useCallback(async(newStatus:string,jobId:string)=>{
try{
const res = await fetch(`/api/auth/jobs/${jobId}/status`,{
  method:'PUT',
  headers:{
    'Content-Type': 'application/json'
  },
  body:JSON.stringify({status:newStatus})
})

if(!res.ok){ 
  throw new Error('Failed to Update Status')
}

setJobsData(prev => prev.map(job=> job._id === jobId ?{...job,status: newStatus}: job))
toast.success('Job Status Updated Successfully!')
}
catch(error){
  console.error(error);
  
}
},[])
const RedirectToTicketPage = (id:string)=>{
router.push(`/admin/tickets/${id}/`)
}
  return (

    <div className='bg-white p-4'>
      <Toaster/>
      <div>
       {JobsData.map((job)=> (
        <div key={job._id}>
          <div className='flex flex-row flex-wrap justify-between items-center gap-4 p-4'>
          <h1 className='text-2xl font-bold'>{job.title} <span className='text-xl text-white bg-red-600 px-2 py-1 rounded'>{job.status}</span></h1>
          <button onClick={()=>RedirectToTicketPage(job.postedBy._id)} className='bg-green-700 text-white px-2 py-1 rounded text-xl font-semibold'>Create Support Ticket</button>
          <div>
            <label >Change To  </label>
             <select className='border px-4 py-2 rounded' value={job.status} onChange={(e)=> handleStatusChange(e.target.value,job._id)}>
            <option value='under review'>Under Review</option>
            <option value='approved'>Approved</option>
            <option value='rejected'>Rejected</option>
          </select>
            </div>
         
            </div>
            <div className='mt-4'>
              <label className='block mb-4 text-xl font-bold'>Skills</label>
          <ul className="flex flex-wrap gap-2">
  {job.skills.map((s, idx) => (
    <li
      key={idx}
      className="bg-blue-100 text-xl text-blue-900 px-3 py-2 rounded-full "
    >
      {s}
    </li>
  ))}
</ul>


              </div>
  <div className='bg-white grid grid-cols-1 mt-8 sm:grid-cols-2 gap-4 p-2'>
    <div className='flex flex-col my-2'>
    <p className='text-xl font-bold'>Rate : <span className='text-lg font-normal'>{job.rate}</span></p>
    <p className='text-xl font-bold'>Employement Type : <span className='text-lg font-normal'>{job.engagement_type}</span></p>
    <p className='text-xl font-bold'>Wxperience : <span className='text-lg font-normal'>{job.experience.minyears} - {job.experience.maxyears}</span></p>
    <p className='text-xl font-bold'>No of Resources : <span className='text-lg font-normal'>{job.staff_count}</span></p>
    <p className='text-xl font-bold'>timezone : <span className='text-lg font-normal'>{job.timezone}</span></p>
    </div>
    <div className='flex flex-col my-2'>
      <h2 className='text-2xl font-bold mb-4'>Joining Details</h2>
      <p className='text-xl font-bold'> Work From : <span className='text-lg font-normal'>{job.workmode}</span></p>
      <p className='text-xl font-bold'>Work Duration : <span className='text-lg font-normal'>{job.duration}</span></p>
      </div>
    </div>

<div className='flex flex-col mt-6 '>
    <div>
  <h1 className='text-2xl font-bold mb-4'> Job Description:</h1>
 <p className="text-base sm:text-lg md:text-xl leading-relaxed tracking-normal mb-4">
  {job.job_description}
</p>


    </div>
        <div>
  <h1 className='text-2xl font-bold mb-4'>Key Responsibilities:</h1>
    <p className='text-base sm:text-lg md:text-xl leading-relaxed tracking-normal mb-4'> {job.key_responsibilities}</p>
    </div>
        <div>
  <h1 className='text-2xl font-bold mb-4'>Qualifications:</h1>
   <p className='text-base sm:text-lg md:text-xl leading-relaxed tracking-normal mb-4'>{job.technical_skills}</p>
    </div>
</div>

        </div>
       ))}
        </div>
    </div>
  )
}

export default page