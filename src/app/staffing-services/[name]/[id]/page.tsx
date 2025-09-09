'use client'

import { Search } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface staffData {
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
  const { id } = useParams()
  // const { data: session } = useSession()
  const [StaffData, setStaffData] = useState<staffData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/auth/organization/staff/by-org?orgId=${id}`)
        if (!res.ok) throw new Error('Error fetching employee')
        const data = await res.json()
        setStaffData(data.staff)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchData()
  }, [id])

  
  return (
    <div className='w-full min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-10'>
      <h1 className='text-4xl font-bold text-center text-gray-700 mt-4 mb-2'>
        AI Powered Staff Augmentation Marketplace
      </h1>
      <p className='text-center text-gray-600 mb-8'>
        Hire Ready-To-Deploy Technology Talents From Thousands Of Pre-Vetted Service Providers Worldwide.
      </p>

      <div className='w-full max-w-2xl mx-auto mb-10'>
        <form>
          <div className='relative'>
            <Search
              size={16}
              className='absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400'
            />
            <input
              type='search'
              placeholder='What are you looking for...'
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </form>
      </div>

      {/* Staff Results */}
      {loading ? (
        <p className='text-center text-gray-700'>Loading...</p>
      ) : StaffData.length === 0 ? (
        <p className='text-center text-gray-500'>No approved staff found for this organization.</p>
      ) : (
        <div className='flex flex-col gap-10'>
          {StaffData.map((Staff) => (
            <div key={Staff._id} className='w-full bg-white p-6 rounded-md shadow border border-gray-200'>
              <div className='flex flex-col sm:flex-row items-center gap-6 mb-6'>
                <Image
                  src={Staff.OrgId.companylogo || '/placeholder.png'}
                  alt='Company Logo'
                  width={200}
                  height={100}
                  className='w-56 h-32 rounded object-cover border border-gray-100 shadow-md'
                /> 
                <div className='text-center sm:text-left'>
                  <h2 className='text-2xl font-semibold text-gray-800'>{Staff.OrgId.company_name}</h2>
                  <p className='text-gray-500'>{Staff.OrgId.location.city}, {Staff.OrgId.location.state}</p>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-base'>
                <div>
                  <p><strong>Primary Skills:</strong> {Staff.primarySkills}</p>
                  <p><strong>Designation:</strong> {Staff.designation}</p>
                  <p><strong>No. of Bench Staff:</strong> {Staff.numberBenchStaff}</p>
                  <p><strong>Rate Type:</strong> {Staff.rateType}</p>
                  <p><strong>Experience:</strong> {Staff.averageExperience} years</p>
                </div>
                <div>
                  <p><strong>Work From:</strong> {Staff.workFrom}</p>
                  <p><strong>Engagement Type:</strong> {Staff.engagementType}</p>
                  <p><strong>Availability:</strong> {Staff.availability}</p>
                  <p><strong>Client Location:</strong> {Staff.availableAtClientLocation}</p>
                  <p><strong>Active Date :</strong> {new Date(Staff.updatedAt).toLocaleString('en-GB',{
                    day: '2-digit',
                    month:'long',
                    year:'numeric'
                  })}</p>
                </div>
                <div>
                  <h1 className='text-gray-500 mb-3'>Skills :</h1>
                  {Staff.skills  && Staff.skills.length > 0  && (
                      <ul className='list-none flex flex-wrap gap-4 '>
                      {Staff.skills.map((skill,index)=> (
                        <li key={index} className='bg-blue-100  text-blue-800 text-sm font-medium rounded-full px-3 py-1'>{skill}</li>
))}
                      </ul>
                  )}
                  </div>
                  <div>
                    <button className=' text-white bg-[#f27264] px-4 py-2 rounded-full'>Invite for Interview</button>
                    </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Page
