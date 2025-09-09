'use client'
import React, { useEffect, useState } from 'react'

interface Candidate {
  firstname: string
  lastname: string
  skills: string[]
  resume: string
}


interface Provider{
    company_name:string
    email:string
}
interface Proposal {
  currency_type: string
  description: string
  frequency_type: string
  increase_percentage: string
  amount: string
  increase_rate: string
  Candidate_data: Candidate[]
  ProviderId:Provider
}

const Page = () => {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/auth/proposal/list`)
        const response = await res.json()
        console.log(response.data, 'getting from Proposal data')
        setProposals(response.data || [])
      } catch (error) {
        console.error('Error fetching proposals:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <p className="text-center py-4">Loading....</p>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Proposals</h1>

      {proposals.length > 0 ? (
        <div className="space-y-4">
          {proposals.map((p, i) => (
            <div
              key={i}
              className="border rounded-lg p-4 shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold mb-2">
                {p.description || 'No description'}
              </h2>

              <ul className="space-y-1 text-gray-700">
                <li>
                  <strong>Currency:</strong> {p.currency_type}
                </li>
                <li>
                  <strong>Frequency:</strong> {p.frequency_type}
                </li>
                 <li>
                  <strong>Amount:</strong> {p.amount}
                </li>
                <li>
                  <strong>How Often do you want a rate increase :</strong> {p.increase_percentage}
                </li>   
               
                <li>
                  <strong>How much of an increase do you want :</strong> {p.increase_rate}
                </li>
              </ul>

              {p.Candidate_data && p.Candidate_data.length > 0 && (
                <div className="mt-3  border-t">
                  <h3 className="font-bold text-center">Candidate Info</h3>
                  <p>
                    <strong>Name:</strong>{' '}
                    {p.Candidate_data[0].firstname} {p.Candidate_data[0].lastname}
                  </p>
                  <p>
                    <strong>Skills:</strong>{' '}
                    {p.Candidate_data[0].skills.join(', ')}
                  </p>
                  <p>
                    <strong>Resume:</strong>{' '}
                    <a
                      href={p.Candidate_data[0].resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Resume
                    </a>
                  </p>
                </div>
              )}

            {p.ProviderId && typeof p.ProviderId === 'object' && (
              <div>
                <ul>
                  <li>Email : {p.ProviderId.email}</li>
                  <li>Company Name : {p.ProviderId.company_name}</li>

                </ul>
              </div>
            )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No Proposals Found</p>
      )}
    </div>
  )
}

export default Page
