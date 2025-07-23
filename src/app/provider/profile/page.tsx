'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  BadgeDollarSign,
  User2,
  MapPin,
  PencilIcon,
} from 'lucide-react';

interface Listing {
  companylogo: string;
  company_name: string;
  min_project_size: string;
  hourly_rate: string;
  size_of_company: string;
  company_founded: string;
  tagline: string;
  summary: string;
  company_location: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  phone_number: string;
  employee_count: string;
  gstno: string;
  service_lines: {
    _id?: string;
    category: string;
    serviceline: string;
    percentage: string;
  }[];
  industry_focus: {
    category: string;
    percentage: string;
  };
  client_size: {
    category: string;
    percentage: string;
  };
  specilization: string;
  skills: string[];
  portfolio: [{
    title: string;
    thumbnail: string;
    project_link: string[];
    project_category: string;
    timeline: string;
    project_cost: string;
    screenshot: string;
    description: string;
  }];
  admin: {
    email: string;
    admin_phone: string;
    linkedin_url: string;
    facebook_url: string;
    twitter_url: string;
    google_analytics_id: string;
  };
  website: {
    website_link: string;
    sales_email: string;
  };
}

const ListingPage = () => {
  const [data, setData] = useState<Listing | null>(null);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/auth/organization/update/${userId}`);
        if (!res.ok) throw new Error('Fetching failed');
        const orgData = await res.json();
        setData(orgData);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchData();
  }, [userId]);

  if (!data) return null;

  const OverviewItem = ({
    icon,
    label,
  }: {
    icon: React.ReactNode;
    label: string;
  }) => (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg shadow-sm">
      {icon}
      <span className="text-gray-800 text-sm">{label}</span>
    </div>
  );

const validLogo =  data.companylogo? data.companylogo
  : '/placeholder-logo.png';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
  {/* Left: Heading + Divider */}
  <div>
    <h1 className="text-2xl font-bold text-gray-800">Your Listing</h1>
    <div className="w-24 h-1 bg-blue-600 rounded mt-2"></div>
  </div>

  {/* Right: Edit Button */}
  <div className="mt-4 sm:mt-0">
    <button
      onClick={() => router.push('/provider/profile/edit')}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      <PencilIcon size={16} />
      <span>Edit Page</span>
    </button>
  </div>
</div>


      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Logo & Info */}
      <div className="flex flex-col md:flex-row gap-6">
  <Image
    src={validLogo}
    alt="Company Logo"
    width={300}
    height={180}
    priority
    className="rounded-md object-contain"
  />
  <div className="flex flex-col justify-center">
    <h2 className="text-2xl font-semibold text-black">
      {data.company_name}
    </h2>
    <p className="text-gray-600 text-xl mt-2 text-center">{data.tagline}</p>
  </div>
</div>

        {/* Overview */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <OverviewItem
              icon={<BadgeDollarSign className="w-5 h-5 text-pink-600" />}
              label={`Hourly Rate: ${data.hourly_rate}`}
            />
            <OverviewItem
              icon={<User2 className="w-5 h-5 text-green-600" />}
              label={`Employees: ${data.employee_count}`}
            />
            <OverviewItem
              icon={<MapPin className="w-5 h-5 text-blue-600" />}
              label={`Location: ${data.location.city}, ${data.location.state}, ${data.location.country}`}
            />
          </div>
        </div>

        {/* Summary */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Summary</h2>
          <p className="px-2 py-2 leading-relaxed tracking-normal text-gray-700">{data.summary}</p>
        </div>

        {/* Focus Areas */}
        <div>
          <h2 className="text-2xl font-bold mt-6 mb-4">Focus Area</h2>

          {data.service_lines && data.service_lines.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Service Focus</h3>
              <div className="">
                {data.service_lines.map((line, index) => (
                  <div
                    key={line._id || index}
                    className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <p className="text-base font-medium text-gray-700">
                      <span className="font-semibold text-black">Category:</span> {line.category}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-semibold text-black">Service:</span> {line.serviceline}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Portfolio Section */}
{data.portfolio && data.portfolio.length > 0 && (
  <div className="mt-8">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">Portfolio</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="border p-4 rounded shadow-sm bg-white">
        {data.portfolio[0]?.thumbnail ? (
          <Image
            src={data.portfolio[0].thumbnail}
            alt="Project Thumbnail"
            width={600}
            height={300}
            className="rounded mb-4 object-cover w-full"
          />
        ) : (
          <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center rounded mb-4">
            <span className="text-gray-400">No Image</span>
          </div>
        )}

        <h3 className="text-xl font-semibold">{data.portfolio[0]?.title || 'Untitled Project'}</h3>
        <p className="text-gray-600 mt-1">{data.portfolio[0]?.description || 'No description'}</p>
        <p className="text-sm mt-2 text-gray-500">
          <strong>Category:</strong> {data.portfolio[0]?.project_category || 'N/A'} <br />
          <strong>Cost:</strong> {data.portfolio[0]?.project_cost || 'N/A'} <br />
          <strong>Timeline:</strong> {data.portfolio[0]?.timeline || 'N/A'}
        </p>
        {data.portfolio[0]?.project_link?.length > 0 && (
          <div className="mt-2">
            <strong>Links:</strong>
            <ul className="list-inside text-blue-600 overflow-hidden">
              {data.portfolio[0].project_link.map((link, i) => (
                <li key={i}>
                  <a href={link} target="_blank" rel="noopener noreferrer" className="underline">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  </div>
)}


{/* Skills Section */}
{data.skills && data.skills.length > 0 && (
  <div className="mt-8">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">Skills</h2>
    <div className="flex flex-wrap gap-3">
      {data.skills.map((skill, i) => (
        <span
          key={i}
          className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
)}

{/* Admin Section */}
{data.admin && (
  <div className="mt-8">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">Admin Contact</h2>
    <div className="text-gray-700 space-y-2">
      <p><strong>Email:</strong> {data.admin.email}</p>
      <p><strong>Phone:</strong> {data.admin.admin_phone}</p>
      <div className="flex gap-4 mt-2">
        {data.admin.linkedin_url && (
          <a href={data.admin.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            LinkedIn
          </a>
        )}
        {data.admin.facebook_url && (
          <a href={data.admin.facebook_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            Facebook
          </a>
        )}
        {data.admin.twitter_url && (
          <a href={data.admin.twitter_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            Twitter
          </a>
        )}
      </div>
    </div>
  </div>
)}

{/* Website Info Section */}
{data.website && (
  <div className="mt-8">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">Website Information</h2>
    <p className="text-gray-700"><strong>Website:</strong> 
      <a href={data.website.website_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1">
        {data.website.website_link}
      </a>
    </p>
    <p className="text-gray-700"><strong>Sales Email:</strong> {data.website.sales_email}</p>
  </div>
)}

      </div>
    </div>
  );
};

export default ListingPage;
