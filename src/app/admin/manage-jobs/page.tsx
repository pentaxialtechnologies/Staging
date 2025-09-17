'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
interface Jobs {
  id: string
  _id:string
  title: string
  status: string
}

function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

const Page = () => {
  const [jobData, setJobData] = useState<Jobs[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const debouncedSearch = useDebounced(search, 300)
  const router = useRouter()
  const filteredJobs = useMemo(() => {
    return jobData.filter(job => {
      const matchSearch = job.title
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase())
      const matchStatus =
        !statusFilter || job.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [jobData, debouncedSearch, statusFilter])



const ItemPerPage = 10
const TotalPages = Math.ceil(filteredJobs.length/ItemPerPage)
const [Currentpage,setCurrentpage] = useState(0)


  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/auth/jobs')
        if (!res.ok) throw new Error('Jobs not found')
        const response = await res.json()
        setJobData(response.jobs)
      } catch (err) {
        console.error(err)
      }
    })()
  }, [])

  const JobRow = React.memo(({ job }: { job: Jobs }) => (
    <tr>
      <td className="border p-2 text-center "><Link href={`/admin/manage-jobs/${job._id}`} className='hover:text-blue-900 cursor-pointer'>{job.title}</Link></td>
      <td className="border p-2 text-center">{job.status}</td>
      <td className="border p-2 text-center">
        <button className="text-blue-600">History</button>
      </td>
    </tr>
  ))

  return (
    <div className='bg-white'>
      <h1 className="text-3xl font-bold mb-8">Admin Manage Jobs</h1>

      <div className="flex flex-wrap gap-10">
        <div>
          <input
            type="text"
            placeholder="Job Title"
            className="px-4 py-2 border rounded w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <select
            className="px-4 py-2 border rounded w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="under review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <button className="bg-gray-400 rounded px-4 py-2">Search</button>
      </div>

      <table className="w-full border-collapse border mt-6">
        <thead>
          <tr>
            <th className="border p-2">Job Title</th>
            <th className="border p-2">Application Status</th>
            <th className="border p-2">Manage</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobs.map((job,index) => (
            <JobRow key={job.id ?? index} job={job} />
          ))}
        </tbody>
      </table>
      <div className='flex items-center justify-center gap-4 my-4'>
        <button className='px-3 py-1 border rounded disabled:opacity-50' onClick={()=> setCurrentpage(prev => Math.max(prev,1))} disabled={TotalPages === 1}>
          Prev
        </button>
        <span> Pages {Currentpage}/{TotalPages}</span>
        <button className='px-3 py-1 border rounded disabled:opacity-50' onClick={(e)=>setCurrentpage(prev=> Math.min(prev+1,TotalPages))} disabled={Currentpage === TotalPages}>
          Next
        </button>
        </div>
    </div>
  )
}

export default Page
