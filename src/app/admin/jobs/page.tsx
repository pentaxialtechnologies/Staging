"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
interface Job {
  _id: string;
  title: string;
  skills: string[];
  budget: string;
  duration: string;
  experience: {
    minyears: string;
    maxyears: string;
  };
  location: {
    city: string;
    state: string;
    country: string;
  };
  availability: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const AdminJobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const route = useRouter();
  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/auth/jobs");
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobs(data.jobs);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  const handleStatusChange = async (
    jobId: string,
    newStatus: Job["status"],
  ) => {
    try {
      const res = await fetch(`/api/auth/jobs/${jobId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id === jobId ? { ...job, status: newStatus } : job,
          ),
        );
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) return <div>Loading jobs...</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
        Job Listings
      </h1>

      {jobs.length === 0 ? (
        <div className="text-center text-gray-500">No jobs found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white shadow-md rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-300"
            >
              <h2 className="text-xl font-semibold text-blue-700 mb-2">
                {job.title}
              </h2>

              <div className="mb-2 text-sm">
                <span className="font-medium text-gray-700">Duration:</span>{" "}
                {job.duration}
              </div>
              <div className="mb-2 text-sm">
                <span className="font-medium text-gray-700">Availability:</span>{" "}
                {job.availability}
              </div>
              <div className="mb-2 text-sm">
                <span className="font-medium text-gray-700">Experience:</span>{" "}
                {job.experience.minyears} - {job.experience.maxyears} yrs
              </div>
              <div className="mb-2 text-sm">
                <span className="font-medium text-gray-700">Location:</span>{" "}
                {job.location.city}, {job.location.state},{" "}
                {job.location.country}
              </div>

              <div className="mb-2 text-sm">
                <span className="font-medium text-gray-700">Status:</span>
                <select
                  className="ml-2 border p-1 rounded"
                  value={job.status}
                  onChange={(e) =>
                    handleStatusChange(job._id, e.target.value as Job["status"])
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="mb-3 text-sm">
                <span className="font-medium text-gray-700">Skills:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xs text-gray-400 mt-2">
                Posted on: {new Date(job.createdAt).toLocaleDateString()}
              </div>
              <button
                onClick={() => route.push(`/admin/requests/${job._id}`)}
                className="bg-green-400 mt-5 p-2 rounded-full"
              >
                View More Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminJobsPage;
