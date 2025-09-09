'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import React from 'react'

interface Candidate {
  _id: string;
  firstname: string;
  lastname: string;
  skills: string[];
  resume: string;
}

interface Proposal {
  JobId: {
    _id: string;
    title: string;
    job_description: string;
    updatedAt: string;
    experience: {
      maxyears: string;
      minyears: string;
    };
    duration: string;
    skills: string[];
    joblocation: string;
    employment_type: string;
    workmode: string;
    timezone: string;
    engagement_type: string;
    budget: string;
    availability: string;
    payment_schedule: string;
  };

  Candidate_data: Candidate[];   // 👈 updated to array

  id: string;
  description: string;
  provider: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  currency_type: string;
  frequency_type: string;
  increase_percentage: string;
}

const Page = () => {
  const [submittedProposals, setSubmittedProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProposals() {
      try {
        const res = await fetch("/api/auth/proposal/get");
        const datas = await res.json();
        setSubmittedProposals(datas.data || []);
        console.log(datas.data, 'datas');
      } catch (error) {
        console.error("Error fetching proposals:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProposals();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div>
      <h1 className='text-2xl'>My Proposal</h1>
      <div className='border border-orange-400 mt-6 mb-4'></div>
      <div className='max-w-7xl mx-auto p-4 space-y-4'>
        {submittedProposals.map((proposal) => (
          <div key={proposal.id} className='border p-4 rounded-lg shadow-sm mb-4'>
            {/* Job Details */}
            <h2 className='text-xl mb-4 font-bold'>Job Details</h2>
            <h3 className='text-xl font-semibold text-blue-600'>{proposal.JobId.title}</h3>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <p className='mt-2'>Posted By: {new Date(proposal.JobId.updatedAt).toLocaleDateString()}</p>
                <p>{proposal.JobId.job_description}</p>
        
              </div>

              <div>
                <h3>Experience Level Required</h3>
                <p>{proposal.JobId.experience.minyears} - {proposal.JobId.experience.maxyears} years</p>
                <p>Duration: {proposal.currency_type} {proposal.JobId.budget} / {proposal.JobId.payment_schedule}</p>
                <p>Job Duration: {proposal.JobId.duration}</p>
              </div>

              <div>
                <p className='text-sm sm:text-xl mb-5'>Skills:</p>
                <ul className='flex flex-row gap-2 flex-wrap mb-5'>
                  {proposal.JobId.skills.map((skill, index) => (
                    <li key={index} className='bg-blue-300 text-blue-700 border font-bold rounded-full px-2.5 py-1'>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link
              className='text-white bg-[#F27264] rounded-xl mt-2 px-3 py-1.5 inline-block'
              href={`/jobs/${proposal.JobId._id}`}
            >
              View Job Details
            </Link>

            {/* Proposed Terms */}
            <div className='mt-4 border border-black shadow-lg p-4 rounded-lg'>
              <h1 className='text-xl sm:text-2xl'>Your Proposed Terms</h1>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4'>
                <div>
                  <h1>Rate</h1>
                  <p>{proposal.currency_type} {proposal.JobId.budget}</p>
                </div>
                <div>
                  <h1>Rate Type</h1>
                  <p>{proposal.JobId.payment_schedule}</p>
                </div>
              </div>
              <div className='mt-4 mb-2 border border-gray-300'></div>
              <h1>Rate Increase</h1>
              <p>Rate Increase Term: the client can increase the rate after 3 months of work</p>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4'>
                <div>
                  <h1>Frequency</h1>
                  <p>{proposal.frequency_type}</p>
                </div>
                <div>
                  <h1>Increment In (%)</h1>
                  <p>{proposal.increase_percentage}</p>
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div className='mt-4 border border-black shadow-lg p-4 rounded-lg'>
              <h1 className='text-xl font-bold mb-2'>Cover Letter</h1>
              <p>{proposal.description || "No cover letter provided."}</p>
            </div>

            {/* Candidate Data */}
            {proposal.Candidate_data && proposal.Candidate_data.length > 0 ? (
              <div className='mt-4 border border-black shadow-lg p-4 rounded-lg'>
                <h1 className="text-xl font-bold mb-4">Candidate Data</h1>
                <table className='table-auto w-full border-collapse border border-gray-300'>
                  <thead>
                    <tr className='bg-gray-200'>
                      <th className='border border-gray-400 px-4 py-2'>Firstname</th>
                      <th className='border border-gray-400 px-4 py-2'>Lastname</th>
                      <th className='border border-gray-400 px-4 py-2'>Skills</th>
                      <th className='border border-gray-400 px-4 py-2'>Resume</th>
                    </tr>
                  </thead>  
                  <tbody>
                    {proposal.Candidate_data.map((candidate) => (
                      <tr key={candidate._id}>
                        <td className='border border-gray-400 px-4 py-2'>{candidate.firstname}</td>
                        <td className='border border-gray-400 px-4 py-2'>{candidate.lastname}</td>
                        <td className='border border-gray-400 px-4 py-2'>{candidate.skills.join(", ")}</td>
                        <td className='border border-gray-400 px-4 py-2'>
                          <a href={candidate.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                            View Resume
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className='mt-2 text-gray-500'>No candidate data found</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;
