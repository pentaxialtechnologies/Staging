'use client'
import { Search } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast,{Toaster} from 'react-hot-toast'


const defaultFilters ={
  skills: [] as String[],
  joblocation:'',
  timezone:'',
  workmode:'',
  engagement_type:'',
  payment_schedule:'',
  duration:''
}


const page = () => {
const [jobs,setjobs] = useState<any[]>([])
const [loading,setloading] = useState(false)
const [filters,setfilter] = useState(defaultFilters)
const [skillInput,setskillInput] = useState('')
const [pages,setpages] = useState(1)
const [TotalPages,setTotalpages] = useState(1)
const router = useRouter()
const [User,setUser] = useState(false)
const {data:session} = useSession()


const UserCheck = (id : string) =>{
if(session?.user){
  router.push(`/apply-now/${id}`)
}
else{
  toast.error("You must be logged in to apply the job.")
  router.push('/users/login')
}
}

const addskill = ()=>{
  if(skillInput && !filters.skills.includes(skillInput)){
  setfilter((prev)=> ({...prev,skills:[...prev.skills, skillInput]}))
  setskillInput("")
  }
}

const removeskill = (skill:string) =>{
setfilter((prev)=> ({...prev,skills:prev.skills.filter((id)=> id !== skill) }))
}

const updateFilter = (key:string,value:string)=>{
  setfilter((prev)=> ({...prev, [key] : value}))
}


const OnfilterChange = async()=>{
setloading(true)

const params = new URLSearchParams(
  {...Object.fromEntries(Object.entries(filters)
  .filter(([, value] ) => (Array.isArray(value) ? value.length : value))),
...(filters.skills.length && {skills: filters.skills.join(",")}),
page:pages.toString(),
limit:"4"
})


// const params = new URLSearchParams();

// Object.entries(filters).forEach(([key,value])=>{
//   if(Array.isArray(value) && value.length){
//     params.set(key,value.join(","))
//   }
//   else if(value){
//     params.set(key,value.toString())
//   }
// })

const res = await fetch (`api/auth/jobs/filter?${params.toString()}`)
const data = await res.json()
setjobs(data.jobs || [])
setTotalpages(data.totalPages || 1)
console.log(data.jobs,'data jobs');
console.log(data.totalPages,'data totalPages');

setloading(false)
}



useEffect(()=>{
OnfilterChange()
},[filters, pages])


const HandleNext =()=>{
  window.scrollTo({top:0, behavior:'smooth'})
  setpages((prev) => prev + 1)
}

const HandlePrev =()=>{
  window.scrollTo({top:0, behavior:'smooth'})
  setpages((prev) => prev - 1)
}



   
const changePage = (direction : 'next' | 'prev') =>{
window.scrollTo({top:0,behavior:'smooth'})
setpages((prev) => prev + (direction === 'next'? 1 : -1))
}


  return (
    <div>
      <Toaster/>
   <div className="relative">
  <label className="block mb-2 mt-4 font-medium">Skills</label>

  <div className="flex gap-2">
    <input
      type="search"
      value={skillInput}
      onChange={(e) => setskillInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addskill();
        }
      }}
      className="flex-1 border border-gray-500 rounded px-3 py-2 text-sm"
      placeholder="Add skill"
    />
    <button
      type="button"
      onClick={addskill}
      className="bg-green-500 px-3 rounded text-white hover:bg-green-600 flex items-center justify-center"
    >
      <Search size={20} />
    </button>
  </div>

  {/* Skill tags */}
  <div className="flex flex-wrap gap-2 mt-3">
    {filters.skills.map((skill: any) => (
      <div
        key={skill}
        className="bg-blue-200 flex items-center gap-1 px-3 py-1 rounded-full"
      >
        <span>{skill}</span>
        <button
          type="button"
          className="text-xs font-bold text-red-600 hover:text-red-800"
          onClick={() => removeskill(skill)}
        >
          ×
        </button>
      </div>
    ))}
  </div>
</div>

    
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 mt-5">
        <div>
        <label className='block mb-2'>Work From</label>
        <select
          name="workmode"
          value={filters.workmode}
          onChange={(e)=> updateFilter('workmode', e.target.value)}
          className="w-full p-2 rounded border border-gray-300"
        >
          <option value="">All Work Modes</option>
          <option value="Remote">Remote</option>
          <option value="On-site">On-site</option>
          <option value="Hybrid">Hybrid</option>
        </select>
</div>       
<div>
  <label className='block mb-2'>Project Length</label>
  <select name='duration' value={filters.duration} onChange={(e) => updateFilter('duration',e.target.value)}  className='px-4 py-2 border border-gray-500 w-full shadow-md'>
  <option value="">Project Length</option>
    <option value="1 to 3 months">1 to 3 months</option>
    <option value="3 to 6 months">3 to 6 months</option>
    <option value="more than 6 months">More than 6 months</option>
    <option value="not sure at this time">Not sure at this time</option>
  </select>
</div>
<div>
  <label className='block mb-2'>Payment Type</label>
  <select value={filters.payment_schedule} onChange={(e) => updateFilter('payment_schedule',e.target.value)}  className='px-4 py-2 border border-gray-500 w-full shadow-md'>
    <option value="">Payment Type</option>
    <option value="Hourly">Hourly</option>
    <option value="Weekly">Weekly</option>
    <option value="Monthly">Monthly</option>
  </select>
</div>


<div>
  <label className='block mb-2'>Select Timezone</label>
  <select name='timezone'  value={filters.timezone}
        onChange={(e) => updateFilter('timezone',e.target.value)} className='px-4 py-2 border border-gray-500 w-full shadow-md'>
        <option value="">Select Timezone</option>
        <option value="(UTC+00:00) Africa/Abidjan">
        (UTC+00:00) Africa/Abidjan</option>  
        <option value="(UTC+00:00) Africa/Accra">
        (UTC+00:00) Africa/Accra</option>
         <option value="(UTC+03:00) Africa/Addis_Ababa">
        (UTC+03:00) Africa/Addis_Ababa</option>
        <option value="(UTC+01:00) Africa/Algiers">
        (UTC+01:00) Africa/Algiers</option>
        <option value="(UTC+03:00) Africa/Asmara">
        (UTC+03:00) Africa/Asmara</option>
        <option value="(UTC+00:00) Africa/Bamako">
        (UTC+00:00) Africa/Bamako</option>
        <option value="(UTC+5:30)IST Indian Standard Time">
        (UTC+5:30)IST Indian Standard Time</option>

  </select>
</div>

  <div>

    <label className='block mb-2'>Location</label>
        <input
        type='text' 
        value={filters.joblocation}
        onChange={(e)=> updateFilter('joblocation', e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        placeholder="Enter location"
        />
      </div>
      </div>

      {/* Job Results */}
      <div className="job-results mt-10">
        {loading && (
          <div className="text-center text-blue-600">Loading jobs...</div>
        )}
        {!loading && jobs.length === 0 && (
          <div className="text-center text-gray-500">
           No jobs found.
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <div className="flex flex-col gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between"
              >
                <div>
                <div className='flex justify-between'>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    {job.title}
                  </h2>
                  <button onClick={()=> UserCheck(job._id.toString())} className='bg-[#F27264] text-white px-4 py-2 rounded'>Apply Now</button>
                  </div>
              <div className='border border-gray-100 mt-5 mb-5'></div>

                  {job.skills?.length > 0 && (
                    <div className="flex flex-col mb-2">
                      <h1 className="font-bold text-gray-700 text-xl ">Skills:</h1>

                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill: any, idx: any) => (
                          <span
                            key={`${job._id}-skill-${idx}`}
                            className="bg-blue-400 text-white text-sm sm:text-lg font-medium md:px-2.5 px-4.5 mt-2 mb-3 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}  

                <div className='flex md:flex-row flex-col justify-between'>
                 <div>
                  <p>₹ {job.currency_type} {job.budget} / {job.payment_schedule}</p>
                  </div>
                  <div className=''>
                  {/* <Clock size={25} className='flex items-center justify-center' /> */}
                  <p>{job.duration}</p>
                  </div>
                  <div>
                    <span className='card-contract card-items'>B2B Contractual</span>
                    </div>
                     <div>
                    <p>{job.workmode}</p>
                    </div>
                          </div>
                    <p className="text-gray-700 text-base line-clamp-3 mb-4 mt-5">
                      {job.job_description}
                    </p>
                </div>
                <div className="flex flex-col md:flex-row  justify-between">
                    <span className="text-sm text-gray-500 block ">
                      Posted: {new Date(job.updatedAt).toLocaleDateString()}
                    </span>
                  <button
                    onClick={() => router.push(`/jobs/${job._id}`)}
                    className="px-4 py-2 text-blue-500 rounded-md hover:text-blue-800  transition-colors duration-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
         {TotalPages > 1 && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            disabled={pages === 1}
            onClick={()=>changePage('prev')}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {pages} of {TotalPages}
          </span>
          <button
            disabled={pages === TotalPages}
            onClick={()=> changePage('next')}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
      </div>

{/* Pagination  */}
  
    </div>
  )
}

export default page