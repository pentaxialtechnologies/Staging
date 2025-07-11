"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const id = params?.id as string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/auth/contractjobs/getbyId/${id}`);
        if (!res.ok) {
          console.error("Failed to fetch job:", res.status);
          return;
        }
        const result = await res.json();
        console.log("Fetched job data:", result.job);
        setData(result.job);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {loading ? (
        <p>Loading job details...</p>
      ) : !data ? (
        <p>Job not found</p>
      ) : (
        <div className="">
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
            <p className="bg-yellow-500 rounded-full px-4 py-2  font-bold">
              {data.status}
            </p>
            <button className="bg-orange-900 text-white px-4 py-2">
              Edit Job
            </button>
          </div>
          {data.skills && (
            <div className="mb-4">
              <h3 className="mt-2">Skills:</h3>
              <ul className="flex flex-row gap-3 mt-2">
                {data.skills.map((skill: string, index: number) => (
                  <li
                    key={index}
                    className="bg-blue-300  text-blue-700 font-bold px-4 py-2 max-w-md rounded-full"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ">
            <div className="">
              <p>
                {" "}
                <span className="font-bold">Rate:</span> {data.rate}
              </p>
              <p>
                {" "}
                <span className="font-bold">Employment Type : </span>
                {data.engagement_type}
              </p>
              <p>
                <span className="font-bold">Experience : </span>
                {data.experience.minyears} - {data.experience.maxyears} years
              </p>

              <p>
                {" "}
                <span className="font-bold">Avalibility : </span>
                {data.availability}
              </p>
              <p>
                <span className="font-bold">timezone :</span> {data.timezone}
              </p>
            </div>
            <div className="bg-blue-100 rounded-lg px-4 py-2 ">
              <h1 className="text-xl font-bold">Joining Details</h1>
              <p>
                {" "}
                <span className="text-base ">Work from :</span> {data.workmode}
              </p>
              <p>
                <span className="text-base ">Work Duration :</span>{" "}
                {data.duration}
              </p>
            </div>
          </div>
          <p>
            <span className="font-bold">Location: </span> {data.location.city},{" "}
            {data.location.country}
          </p>

          <div className="py-10">
            <p className="font-bold text-xl mb-5">Description:</p>
            <pre className="whitespace-pre-wrap">{data.job_description}</pre>
            <p className="font-bold text-xl mb-5 mt-5">key_responsibilities:</p>
            <pre className="whitespace-pre-wrap">
              {data.key_responsibilities}
            </pre>
            <p className="font-bold text-xl mb-5 mt-5">technical_skills:</p>
            <pre className="whitespace-pre-wrap">{data.technical_skills}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
