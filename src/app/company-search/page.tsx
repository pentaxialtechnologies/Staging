'use client';
import CompanyHeader from '@/Components/CompanyHeader';
import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type CompanyType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _id: any;
  company_name: string;
  companylogo: string;
  tagline: string;
  summary: string;
  hourly_rate: string;
  employee_count: string;
  location: {
    city: string;
    state: string;
  };
};

const CompanyListingPage = () => {
  const [companies, setCompanies] = useState<CompanyType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const router = useRouter()

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch('/api/auth/organization/list');
        const data = await res.json();
        setCompanies(data.company);
      } catch (error) {
        console.error('Failed to fetch companies', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((c) =>
    c.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
const fetchAllApprovedStaffGrouped = async()=>{
  try{
const res = await fetch(`/api/auth/organization/staff/list`)
if(res.ok){
  const data = await res.json();
 return data.organizations;
  // router.push(`/staffing-services/${name}/${id}`)
}
if(!res.ok){
  throw new Error('fetching failed')
}
  }
  catch(error){
console.error(error);
    return [];
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const [orgWiseStaff,setorgWiseStaff] = useState<any[]>([])
useEffect(()=>{
  fetchAllApprovedStaffGrouped().then(setorgWiseStaff)
},[])

const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

  if (loading) {
    return (
      <>
        <CompanyHeader />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-center text-xl font-semibold">Loading companies...</h1>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 h-48 rounded-md" />
            ))}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <CompanyHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl text-center font-bold text-gray-800 dark:text-white mb-4">
          Top Companies 2025
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center">
          Explore the leading firms and partners across various service categories.
        </p>

        {/* Search Box */}
        <div className="flex items-center justify-center mt-6">
          <div className="relative w-full max-w-sm">
            <input
              type="search"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset to first page on search
              }}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none dark:bg-gray-800 dark:text-white"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>
        </div>

        {/* Company Cards */}
        <div className="mt-10 flex flex-row gap-8 bg-white border border-gray-200 shadow-xl">
          {paginatedCompanies.map((company) => (
            <div key={company._id} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <Image
                  src={company.companylogo}
                  alt={`${company.company_name} logo`}
                  className="w-35 h-16 object-cover object-fit rounded border"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {company.company_name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{company.tagline}</p>
                </div>
              </div>
              <p className="mt-6 text-sm text-gray-700 dark:text-gray-200">{company.summary}<Link href={`/companies/${company.company_name.replace(/\s+/g, '-').replace(/[^\w\-]/g, '')}/${company._id}`} className='text-blue-600 hover:text-blue-900'>Read more</Link></p>
              <div className="mt-6  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-sm text-gray-700 ">
                <p><strong>Hourly Rate: </strong> {company.hourly_rate}</p>
                <p><strong>Employees: </strong> {company.employee_count}</p>
                <p className="col-span-2"><strong>Location: </strong> {company.location.city}, {company.location.state}</p>
    {orgWiseStaff.length === 0 ? (
  <p></p>
) : (
  orgWiseStaff.map((staff, index) => (
    <button
      key={index}
      onClick={() => router.push(`/staffing-services/${staff.company_name.replace(/\s+/g, '-')}/${staff.orgId}`)}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      Hire Resources
    </button>
  ))
)}

              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-4 mt-10">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  prev * itemsPerPage < filteredCompanies.length ? prev + 1 : prev
                )
              }
              disabled={currentPage * itemsPerPage >= filteredCompanies.length}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </>
  );
};

export default CompanyListingPage;


        {/* Approved Staff Section */}
{/* <div className="mt-20">
  <h1 className="text-3xl font-bold text-center mb-10">Available Bench Staff</h1>

  {orgWiseStaff.length === 0 ? (
    <p className="text-center text-gray-500">No approved staff found.</p>
  ) : (
    orgWiseStaff.map((org) => (
      <div
        key={org.orgId}
        className="mb-12 border border-gray-200 rounded-lg p-6 bg-white shadow-md"
      >
        <h2 className="text-2xl font-semibold text-blue-700 mb-6">
          {org.company_name}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {org.staff.map((member: any) => (
            <div
              key={member._id}
              className="bg-gray-50 p-4 shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-bold text-gray-800">{member.name}</h3>
              <p className="text-sm text-gray-600">
                {member.designation || 'Bench Resource'}
              </p>
              {/* Optional: Add skills, availability, etc. */}
//               <button
//                 className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                 onClick={() => router.push(`/request/${member._id}`)}
//               >
//                 Send Requirement
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     ))
//   )}
// </div> */}