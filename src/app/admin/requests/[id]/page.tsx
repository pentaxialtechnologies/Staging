'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const Page = () => {
  const params = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>({
    postedby:'',
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!params?.id) return;
      try {
        const res = await fetch(`/api/auth/jobs/${params.id}`);
        const json = await res.json();
        setData(json);
        console.log(json);
      } catch (error) {
        console.error('Failed to fetch job:', error);
      }
    };
    fetchData();
  }, [params?.id]);

console.log('Job ID:', data.postedBy?.id || 'No ID found');



  return (
    <div className="max-w-5xl mx-auto  py-2">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">Job Details</h1>
      
      {data ? (
        <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6 border border-gray-200">
          {/* Provider Info */}
          <div className="grid grid-cols-1 md:grid-cols-2  gap-8">
            
            <div>
              <h2 className="text-gray-500">Provider Email</h2>
              <p className="font-medium">{data?.postedBy?.email || ''}</p>
            </div>
            <div>
              <h2 className="text-gray-500">Status</h2>
              {/* <p className="font-medium text-green-600">{data.status}</p> */}
              <select
              className=''
              value={data?.status || '' }
              onChange={async (e)=> {
                const newStatus = e.target.value
                try{
                 const res = await fetch(`/api/auth/jobs/${params?.id}/status`, {
                  method: 'PUT',
                  headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
              });


                  if(res?.ok){
                    /* eslint-disable @typescript-eslint/no-explicit-any */
                    setData((prev:any)=> ({...prev,status:newStatus}))
                  }
                  if (!res.ok) {
              const errorData = await res.json();
              console.error('Status update failed:', errorData);
              }

                }
                catch(error){
                  console.error('Error updating status',error);
                  
                }
              }}
              > 
            <option value="under review">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>

              </select>
            </div>
          </div>

          {/* Job Title */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{data.title}</h2>
          </div>

          {/* Skills */}
          {data.skills && (
            <div>
              <h3 className="font-semibold mb-2 text-gray-700">Skills Required</h3>
              <div className="flex flex-wrap gap-3">
                {data.skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Job Info */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <p><strong>Availability:</strong> {data.availability}</p>
            <p><strong>Duration:</strong> {data.duration}</p>
            <p><strong>Work Mode:</strong> {data.workmode}</p>
            <p><strong>Currency:</strong> {data.currency_type}</p>
            <p><strong>Experience:</strong> {data?.experience?.minyears || ''} - {data?.experience?.maxyears || ''} yrs</p>
            <p><strong>Engagement Type:</strong> {data.engagement_type}</p>
            <p><strong>Payment Schedule:</strong> {data.payment_schedule}</p>
            <p><strong>Rate:</strong> {data.budget}</p>
            {/* <p><strong>Working Days:</strong> {data?.working_days?.start_day || ''} - {data?.working_days?.end_day || ''}</p>
            <p><strong>Working Hours:</strong> {data?.working_hours?.start_time || ''} - {data?.working_hours?.end_time || ''}</p>
            <p><strong>Start Date:</strong> {data?.job_dates?.start_date || ''}</p> */}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-1">Job Description</h3>
            <p className="text-gray-700">{data?.job_description || ''}</p>
          </div>

          {/* Key Responsibilities */}
          <div>
            <h3 className="font-semibold mb-1">Key Responsibilities</h3>
            <p className="text-gray-700">{data?.key_responsibilities || ''}</p>
          </div>

          {/* Technical Skills */}
          {data.technical_skills && (
            <div>
              <h3 className="font-semibold mb-1">Technical Skills</h3>
              <ul className="list-disc list-inside text-gray-700">
                {data.technical_skills.map((skill: string, index: number) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500">Loading job details...</div>
      )}
    </div>
  );
};

export default Page;
