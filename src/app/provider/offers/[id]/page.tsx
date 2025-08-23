'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import React from 'react'

interface Proposal {
  JobId:{
    _id:string
  title: string;
  job_description: string;
  updatedAt: string
  }
  id: string;
  description: string;
  provider: string;
  email: string;
  
}

const page = () => {

      const [openSection, setOpenSection] = useState<string | null>(null);
      const [submittedProposals, setSubmittedProposals] = useState<Proposal[]>([]);
      const [loading, setLoading] = useState(true);
      const router = useRouter()
    
      useEffect(() => {
        async function fetchProposals() {
          try {
            const res = await fetch("/api/auth/proposal/get"); 
            const datas = await res.json();
            setSubmittedProposals(datas.data || []);
            console.log(datas.data,'datas');
          } catch (error) {
            console.error("Error fetching proposals:", error);
          } finally {
            setLoading(false);
          }
        }
        fetchProposals();
      }, []);
  
  
return (
    <div>
<h1 className='text-2xl'>My Proposal</h1>
<div className='border border-orange-400 mt-6 mb-4'></div>
<div>
<div className='max-w-7xl mx-auto p-4 space-y-4'>
<h2 className='text-2xl'>Job Details</h2>
{submittedProposals.map((proposal) => (
  <div key={proposal.id} className='border p-4 rounded-lg shadow-sm mb-4'>
    <h3 className='text-xl font-semibold'>{proposal.JobId.title}</h3>
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
    <p className='mt-2'>Posted By: {new Date(proposal.JobId.updatedAt).toLocaleDateString()}</p>
    <p className=''>Job Description: {proposal.JobId.job_description}</p>
    <p className='mt-2'>Provider: {proposal.provider}</p>
    <p className='mt-2'>Email: {proposal.email}</p>
        </div>
<div>

</div>

    <Link className='text-blue-500 mt-2 inline-block' href={`/provider/offers/${proposal.JobId._id}`}>
      View Proposal
      </Link>
</div>  
))}
</div>
</div>
</div>
  )
}


export default page