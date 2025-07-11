'use client'
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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Jobs</h1>
      <span className="block border-b-2 border-blue-600 w-20 mb-4" />

      {loading ? (
        <p>Loading jobs...</p>
      ) : !datas || datas.length === 0 ? (
        <h2 className="text-lg text-gray-600">Jobs Are Empty</h2>
      ) : (
        <div className="space-y-4">
          {datas.map((job: any) => (
            <div key={job._id} className="p-4 border rounded shadow hover:shadow-lg transition">
                 <button onClick={()=> router.push(`/employer/job-list/${job._id}`)} className="text-2xl mb-2 text-violet-600 rounded hover:text-blue-700">
                {job.title}
              </button>
              <p>Job Duration: {job.duration}</p>
              <p>Location: {job.location.city}, {job.location.country}</p>
              <p>Posted At: {new Date(job.createdAt).toLocaleDateString()}</p>
              <p>Experience: {job.experience.minyears} - {job.experience.maxyears} years</p>
           
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Page
