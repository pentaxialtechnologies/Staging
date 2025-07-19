'use client'

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

type CompanyType = {
  company_name: string
  companylogo: string
  tagline: string
  summary: string
  hourly_rate: string
  employee_count: string
  location: {
    city: string
    state: string
  };
  service_lines:{
    _id: string
    category:string
    serviceline:string
}[]
industry_focus:{
    _id:string
    category:string
}[]
company_founded:string
company_location:string
skills:string[]
portfolio:{
    description:string
    project_category:string
    project_link:string[]
    screenshot:string
    thumbnail:string
    title:string
}
};

const CompanyDetailPage = () => {
  const params = useParams();
  const [company, setCompany] = useState<CompanyType | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(`/api/auth/organization/find/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          console.log(data.company, 'company data');
          setCompany(data.company);
        } else {
          console.error('Failed to fetch company data');
        }
      } catch (error) {
        console.error('Error fetching company:', error);
      }
    };

    if (params?.id) fetchCompany();
  }, [params?.id]);

  if (!company) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
      <div className="flex flex-col gap-4 bg-white p-6 shadow-lg rounded-lg">
        <div className="flex items-center space-x-6">
          <Image
            src={company.companylogo}
            alt={company.company_name}
            width={200}
            height={100}
            className="w-58 h-25 object-cover rounded-full border"
          />
          <div>
            <h1 className="text-3xl font-bold">{company.company_name}</h1>
            <p className="text-gray-600 mt-1">{company.tagline}</p>
          </div>
        </div>
         
 <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-800">
          <div>
            <strong>Hourly Rate:</strong> {company.hourly_rate}
          </div>
          <div>
            <strong>Employees:</strong> {company.employee_count}
          </div>
          <div>
            <strong>Location:</strong> {company.location.city}, {company.location.state}
          </div>
        </div>
        <div className="mt-4 text-gray-700">
            <h1 className='text-xl mb-2 font-bold'>Summary: </h1>
          <p>{company.summary}</p>
      
      </div>
<div>
    <h1 className='text-xl mb-2 font-bold'>Focus Area</h1>
    <h3 className="text-xl font-semibold mb-4 text-gray-800">Service Focus</h3>

    {company.service_lines && (
        <div>
          
            {company.service_lines.map((cat)=> (
                <div key={cat._id} className='flex gap-3'>
                    <CheckCircle className="text-green-500 w-5 h-5" />
                    {cat.serviceline}
                    </div>
            ))}
            </div>
    )}
</div>


<div>
  <h1 className="text-xl font-semibold mb-4 text-gray-800">Focus Areas</h1>
  {company.service_lines?.length ? (
    <ul className="space-y-2">
      {company.industry_focus.map((line) => (
        <li key={line._id} className="flex items-center space-x-2">
          <CheckCircle className="text-green-500 w-5 h-5" />
          <span className="text-gray-700 font-medium">
             <span className="">{line.category}</span>
          </span>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500 italic">No focus areas provided.</p>
  )}
</div>


<div>
  <h1 className="text-xl font-semibold mb-4 text-gray-800">Portfolios</h1>

  {company.portfolio?.project_link?.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {company.portfolio.project_link.map((link: string, index: number) => (
        <a
          key={index}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:shadow-lg transition duration-200 border rounded-lg overflow-hidden"
        >
          <Image
            src={company.portfolio.thumbnail || '/fallback-image.jpg'}
            alt={`Project ${index + 1}`}
            className="w-full h-48 object-cover"
          />
          <p className='text-sm sm:text-lg '>{company.portfolio.title}</p>
          <div className="p-2 flex items-center justify-between text-sm text-blue-600">
            View Project <ExternalLink className="w-4 h-4" />
          </div>
        </a>
      ))}
    </div>
  ) : (
    <p className="text-gray-500 italic">No portfolio projects available.</p>
  )}
</div>

    <div>
      


    </div>
</div>

      </div>
  );
};

export default CompanyDetailPage;
