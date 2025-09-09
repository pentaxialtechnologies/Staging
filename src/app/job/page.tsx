'use client'
import { useState, useEffect } from "react";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function fetchJobs() {
    const params = new URLSearchParams({
      ...filters,
      page: page.toString(),
      limit: "4",
    });

    const res = await fetch(`/api/auth/jobs/filter?${params.toString()}`);
    const data = await res.json();

    setJobs(data.jobs);
    setTotalPages(data.totalPages);
  }

  useEffect(() => {
    fetchJobs();
  }, [filters, page]);

  return (
    <div>
      {/* Job List */}
      {jobs.map((job: any) => (
        <div key={job._id} className="p-4 border-b">
          <h2 className="font-bold">{job.title}</h2>
          <p className="text-gray-600">{job.job_description}</p>
        </div>
      ))}

      {/* Pagination */}
      <div className="flex gap-2 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
