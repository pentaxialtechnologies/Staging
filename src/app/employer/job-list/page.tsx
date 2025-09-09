'use client'

import { Dot, MoreHorizontal, Search } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Page = () => {
  const [datas, setDatas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [searchQuery, setsearchQuery] = useState('')
  const [sortOrder, setsortOrder] = useState<'asc' | 'desc'>('desc')

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
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isDeleted: true }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        alert(`Failed to delete job: ${errorData.message || 'Unknown error'}`)
        return
      }

      alert('Job deleted successfully')
      setDatas((prev) => prev.filter((job) => job._id !== id))
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Something went wrong while deleting the job')
    }
  }

  const filteredJobs = datas
    .filter((job) => job.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
    })

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Jobs</h1>
          <span className="block border-b-2 border-blue-600 w-16 mb-4" />
        </div>
        <div>
          <button
            onClick={() => router.push('/employer/jobs')}
            className="bg-[#f27264] px-4 py-2 rounded-lg font-bold text-white"
          >
            Post a Job
          </button>
        </div>
      </div>

      <div className="flex flex-row justify-between items-center gap-4 flex-wrap mb-4">
        <form className="relative w-80">
          <input
            className="px-4 py-2 border border-gray-300 w-full rounded pr-10"
            placeholder="Search by title..."
            type="search"
            name="search"
            value={searchQuery}
            onChange={(e) => setsearchQuery(e.target.value)}
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
        </form>

        <select
          className="px-4 py-2 border border-gray-300 rounded"
          value={sortOrder}
          onChange={(e) => setsortOrder(e.target.value as 'asc' | 'desc')}
        >
          <option disabled>Order by</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {loading ? (
        <p>Loading jobs...</p>
      ) : filteredJobs.length === 0 ? (
        <h2 className="text-lg text-gray-600">No matching jobs found</h2>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job: any) => (
            <div
              key={job._id}
              className="flex flex-row justify-between items-center p-4 border rounded shadow hover:shadow-lg transition relative"
            >
              <div>
                <h1 className="text-2xl mb-2 text-violet-600 hover:text-blue-700 cursor-pointer">
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

              {/* Dropdown button */}
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenMenuId((prev) => (prev === job._id ? null : job._id))
                  }
                >
                  <MoreHorizontal size={20} />
                </button>

                {/* Dropdown menu */}
                {openMenuId === job._id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-xl z-20">
                    <ul className="py-1 text-sm text-gray-700">
                      <li
                        onClick={() => router.push(`/employer/jobs/edit/${job._id}`)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        Edit Job
                      </li>
                      <li
                        onClick={() => router.push(`/employer/dashboard/${job._id}`)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        View Job Details
                      </li>
                      <li
                        onClick={() => handleDelete(job._id)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                      >
                        Delete Job
                      </li>
                      <li
                        onClick={() => router.push('#')}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        Invite Company
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Page
