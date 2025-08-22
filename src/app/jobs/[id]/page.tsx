import React from 'react';
import {
  LucideShare,
  IdCard,
  Mail,
  Phone,
  User,
  CheckCircle,
} from 'lucide-react';
import type {Metadata} from 'next'
import { GetJob } from '@/lib/Job.utils';
import {formatDistanceToNow} from 'date-fns'
import JobApplyButton from '../JobApplyButton';


 type RouteContext = { params: Promise<{ id: string }> }

export async function generateMetadata({params}: RouteContext): Promise<Metadata>{
  
const {id} = await params;

  const job = await GetJob(id)
  if(!job){
    return {
      title:'Job Not Found',
      description:'This Job list could not be found'
    }
  }
  return {
    title:`${job.title}`,
    description:job.description?.slice(0.150),
    keywords:['job', 'recruitment', job.title,],
     alternates: {
  canonical: `https://s3-staffing-website-ivory.vercel.app/jobs/${job.id}`,
    },
    openGraph:{
      title:`${job.title}`,
      description:job.description?.slice(0.150),
      url: `https://s3-staffing-website-ivory.vercel.app/jobs/${job.id}`,
      siteName:'company',
      type:'website'
    },
    twitter:{
       title: `${job.title} | Job Details`,
      description: job.job_description?.slice(0, 150),
    },
   
   
  };
}



export default async function Page({params}: RouteContext){
const {id } = await params

const job = await GetJob(id)

  if (!job) {
    return <div className="p-8">Job not found.</div>;
  }


  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
    {/* <Toaster/> */}

      {job && (
        <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
          {/* Header */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
            <div className="sm:col-span-2">
              <h1 className="font-bold text-2xl">{job.title}</h1>
            </div>
            <div className="flex justify-start sm:justify-end">
              <button className="border-2 font-bold border-[#F27264] px-3 py-2 flex items-center gap-2 rounded-md">
                <LucideShare size={20} />
                <span>Share Job</span>
              </button>
            </div>
            <div className="flex justify-start sm:justify-end">
              {/* <button onClick={CheckUser} className="bg-[#F27264] text-white px-5 py-2 rounded-lg hover:bg-[#e05c50] transition duration-200">
                Apply Now
              </button> */}
              <JobApplyButton jobId={job._id.toString()}/>
            </div>
          </div> 

          {/* Skills */}
          {job.skills && (
            <div>
              <h2 className="font-semibold mb-2">Skills:</h2>
              <ul className="flex flex-wrap gap-2">
                {job.skills.map((skill: string, index: number) => (
                  <li
                    key={index}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Job Details & Client Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-5">
            {/* Job Info */}
            <div className="flex flex-col gap-2 text-gray-800">
              <p><strong>Budget:</strong> {job.budget}</p>
              <p><strong>Contract Duration:</strong> {job.duration}</p>
              <p><strong>Employment Type:</strong> {job.engagement_type}</p>
              <p><strong>Experience:</strong> {job.experience.minyears} - {job.experience.maxyears} years</p>
              <p><strong>Availability:</strong> {job.availability}</p>
              <p><strong>Timezone:</strong> {job.timezone}</p>
              {/* <p><strong>Start Date:</strong> {formatDate(job.job_dates.start_date)}</p> */}
              <p><strong>Work Mode:</strong> {job.workmode}</p>
              <p><strong>Job Location:</strong> {job.joblocation}</p>

              {/* <p><strong>Work Location:</strong> {job.location.city}, {job.location.state}</p> */}
            </div>

            {/* Client Info */}
            <div className="bg-blue-50 border rounded-lg p-4 shadow-sm text-gray-800">
              <h2 className="font-bold text-lg mb-3">About the Client</h2>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <IdCard className="text-[#F27264]" /> Identity verified <CheckCircle size={14} className="text-green-600" />
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="text-[#F27264]" /> Email verified <CheckCircle size={14} className="text-green-600" />
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="text-[#F27264]" /> Phone verified <CheckCircle size={14} className="text-green-600" />
                </li>
                <li className="flex items-center gap-2">
                  <User className="text-[#F27264]" /> Profile completed <CheckCircle size={14} className="text-green-600" />
                </li>
              </ul>
              <p className="mt-2">Interviewing: 0</p>
              <p>Timezone: {job.timezone}</p>
              <p>Total Jobs Posted: {job.employerJobCount}</p>
              <p>Last viewed by client:  {formatDistanceToNow(new Date(job.postedBy.lastActiveAt))}</p>
            </div>
          </div>

          {/* Description Sections */}
          <div className="mt-8 text-gray-800">
            <h1 className="font-bold text-xl mb-2">Job Description:</h1>
            <ul className="list-disc pl-6 space-y-2">
              {(Array.isArray(job.job_description)
                ? job.job_description
                : typeof job.job_description === 'string'
                ? job.job_description.split(/[\n•\-]+/)
                : []
              ).map((desc: string, i: number) =>
                desc.trim() ? <li key={i}>{desc.trim()}</li> : null
              )}
            </ul>

            <h1 className="font-bold text-xl mt-8 mb-2">Key Responsibilities:</h1>
            <ul className="list-disc pl-6 space-y-2">
              {(Array.isArray(job.key_responsibilities)
                ? job.key_responsibilities
                : typeof job.key_responsibilities === 'string'
                ? job.key_responsibilities.split(/[\n•\-]+/)
                : []
              ).map((item: string, i: number) =>
                item.trim() ? <li key={i}>{item.trim()}</li> : null
              )}
            </ul>

            <h1 className="font-bold text-xl mt-8 mb-2">Qualifications:</h1>
            <ul className="list-disc pl-6 space-y-2">
              {(Array.isArray(job.technical_skills)
                ? job.technical_skills
                : typeof job.technical_skills === 'string'
                ? job.technical_skills.split(/[\n•\-]+/)
                : []
              ).map((item: string, i: number) =>
                item.trim() ? <li key={i}>{item.trim()}</li> : null
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

