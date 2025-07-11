"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";

const AdminPendingJobsList = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("/api/auth/jobs/pending");
        setJobs(res.data);
      } catch (err) {
        toast.error("Failed to fetch job requests");
        console.log(err);
        
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  if (jobs.length === 0) return <div className="p-4">No pending jobs found.</div>;

  return (
    <div className="max-w-5xl mx-auto mt-6 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Pending Job Requests</h2>
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job._id} className="border p-4 rounded hover:bg-gray-50 transition">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Title : {job.title}</h3>
                <p>UserName : {job.postedBy?.firstname}</p>
                <p className="text-sm text-gray-600">Posted by: {job.postedBy?.email || "Unknown"}</p>
              </div>
              <Link
                href={`/admin/requests/${job._id}`}
                className="text-blue-600 font-medium hover:underline"
              >
                Review & Approve →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPendingJobsList;
