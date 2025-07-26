'use client';

import { Search } from 'lucide-react';
import React, {
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Job {
  _id: string;
  title: string;
  skills: string[];
  currency_type: string;
  duration: string;
  engagement_type: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  description?: string;
  postedAt?: string;
}

interface JobFilters {
  keyword?: string;
  workmode?: string;
  country?: string;
  timezone?: string;
  experience?: { min?: string; max?: string };
}

const JobPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [datas, setDatas] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const router = useRouter();

  const fetchJobs = useCallback(async (filters: JobFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/auth/jobs/search', filters);
      setDatas(res.data.jobs || []);
    } // eslint-disable-next-line @typescript-eslint/no-explicit-any
     catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to load jobs. Please try again later.'
      );
      setDatas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetchSuggestions = useCallback(
    (keyword: string) => {
      const handler = setTimeout(async () => {
        setSearchTerm(keyword);
        setShowSuggestions(true);

        try {
          const res = await axios.post<{ jobs: Job[] }>(
            '/api/auth/jobs/search',
            { keyword }
          );

          const titles = [...new Set(res.data.jobs.map((job) => job.title))];
          setSuggestions(titles.slice(0, 5)); // Limit to 5
        } catch (err) {
          console.error('Error fetching suggestions:', err);
          setSuggestions([]);
        }
      }, 300);

      return () => clearTimeout(handler);
    },
    []
  );

  useEffect(() => {
    fetchJobs(filters);
  }, [fetchJobs,filters]);

 const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
  const newSearchTerm = e.target.value;
  setSearchTerm(newSearchTerm);
  setActiveSuggestionIndex(-1); // reset index
  if (newSearchTerm.length > 1) {
    debouncedFetchSuggestions(newSearchTerm);
  } else {
    setSuggestions([]);
    setShowSuggestions(false);
  }
};


  const handleSuggestionSelect = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    const updated = { ...filters, keyword: suggestion };
    setFilters(updated);
    fetchJobs(updated);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetchJobs({ ...filters, keyword: searchTerm });
  };

  const handleFilterChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const updated = { ...prev, [name]: value || undefined };
      fetchJobs(updated);
      return updated;
    });
  };

  const handleMinExperienceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const min = e.target.value;
    setFilters((prev) => {
      const updatedExperience = { ...prev.experience, min };
      const updated = { ...prev, experience: updatedExperience };
      fetchJobs(updated);
      return updated;
    });
  };

  const handleMaxExperienceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const max = e.target.value;
    setFilters((prev) => {
      const updatedExperience = { ...prev.experience, max };
      const updated = { ...prev, experience: updatedExperience };
      fetchJobs(updated);
      return updated;
    });
  };
const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(-1);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <h1 className="text-center text-4xl font-bold mt-4 mb-8 text-gray-800">
        Explore Contract Jobs
      </h1>

      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="flex justify-center mb-6 relative">
        <div className="relative w-full max-w-2xl">
         <input
  type="search"
  placeholder="Search for jobs by keyword..."
  className="w-full border border-gray-300 rounded-full py-3 pl-5 pr-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out shadow-sm text-lg"
  value={searchTerm}
  onChange={handleSearchChange}
  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
  onKeyDown={(e) => {
    if (!showSuggestions) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
        handleSuggestionSelect(suggestions[activeSuggestionIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  }}
/>

          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-1"
            aria-label="search"
          >
            <Search size={24} />
          </button>

       {showSuggestions && suggestions.length > 0 && (
  <ul className="absolute z-10 bg-white shadow-lg rounded-md w-full mt-1 border border-gray-200 max-h-60 overflow-auto">
    {suggestions.map((suggestion, idx) => (
      <li
        key={idx}
        className={`px-4 py-2 cursor-pointer ${
          idx === activeSuggestionIndex ? 'bg-blue-100' : 'hover:bg-blue-50'
        }`}
        onMouseEnter={() => setActiveSuggestionIndex(idx)}
        onClick={() => handleSuggestionSelect(suggestion)}
      >
        {suggestion}
      </li>
    ))}
  </ul>
)}

        </div>
      </form>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <select
          name="workmode"
          value={filters.workmode || ''}
          onChange={handleFilterChange}
          className="w-full p-2 rounded border border-gray-300"
        >
          <option value="">All Work Modes</option>
          <option value="Remote">Remote</option>
          <option value="On-site">On-site</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        <select
          name="country"
          value={filters.country || ''}
          onChange={handleFilterChange}
          className="w-full p-2 rounded border border-gray-300"
        >
          <option value="">All Countries</option>
          <option value="India">India</option>
          <option value="USA">USA</option>
        </select>

        <input
          placeholder="Min Experience (years)"
          value={filters.experience?.min || ''}
          onChange={handleMinExperienceChange}
          className="w-full p-2 rounded border border-gray-300"
        />

        <input
          placeholder="Max Experience (years)"
          value={filters.experience?.max || ''}
          onChange={handleMaxExperienceChange}
          className="w-full p-2 rounded border border-gray-300"
        />
      </div>

      {/* Job Results */}
      <div className="job-results mt-10">
        {loading && (
          <div className="text-center text-blue-600">Loading jobs...</div>
        )}
        {error && <div className="text-center text-red-600">{error}</div>}
        {!loading && !error && datas.length === 0 && (
          <div className="text-center text-gray-500">
            No jobs found matching your criteria.
          </div>
        )}

        {!loading && !error && datas.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {datas.map((job) => (
              <div
                key={job._id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {job.title}
                  </h2>

                  {job.skills?.length > 0 && (
                    <div className="flex flex-col mb-2">
                      <h1 className="font-bold text-gray-700 mb-1">Skills:</h1>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, idx) => (
                          <span
                            key={`${job._id}-skill-${idx}`}
                            className="bg-blue-200 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-gray-600 text-sm mb-2">
                    <span className="font-medium mr-1">Engagement:</span>{' '}
                    {job.engagement_type}
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    <span className="font-medium mr-1">Duration:</span>{' '}
                    {job.duration}
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    <span className="font-medium mr-1">Compensation:</span>{' '}
                    {job.currency_type}
                  </p>
                  {/* <p className="text-gray-600 text-sm mb-4">
                    <span className="font-medium mr-1">Location:</span>{' '}
                    {job.location.city}, {job.location.state},{' '}
                    {job.location.country}
                  </p> */}
                  {job.description && (
                    <p className="text-gray-700 text-base line-clamp-3 mb-4">
                      {job.description}
                    </p>
                  )}
                </div>
                <div className="mt-auto text-right">
                  {job.postedAt && (
                    <span className="text-sm text-gray-500 block mb-2">
                      Posted: {new Date(job.postedAt).toLocaleDateString()}
                    </span>
                  )}
                  <button
                    onClick={() => router.push(`/jobs/${job._id}`)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPage;
