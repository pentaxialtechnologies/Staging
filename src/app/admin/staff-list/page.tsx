'use client';
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import toast,{Toaster} from 'react-hot-toast';
const CSVLink = dynamic(() => import("react-csv").then(mod => mod.CSVLink), {
  ssr: false,
});

interface Employer {
  _id: string;
  fullname: string;
  jobsCount: number;
  size: string;
  status: string;
  profile:{
    strength:string
  }
}

const EmployerListing = () => {

      const [Datas,setDatas] = useState<any[]>([])
   
    console.log(Datas,'data');
    
  const [employers, setEmployers] = useState<Employer[]>([]);

//pagination
const [CurrentPage,setCurrentPage] = useState(1)
const ItemsPerpage = 10


//fetching employers data
   useEffect(()=>{
        fetch('/api/auth/employer/get')
        .then(res => res.json())
        .then(data => setDatas(data.employers))
    },[])
  const [search, setSearch] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [jobsCountFilter, setJobsCountFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

const filteredEmployers = Datas.filter((emp) => {
  const jobsLength = emp.jobs ? emp.jobs.length : 0;

  // 🔎 Search filter
  const matchesSearch = emp.fullname?.toLowerCase().includes(search.toLowerCase());

  // 🏢 Size filter
  const matchesSize = sizeFilter ? emp.profile?.strength === sizeFilter : true;

  // 📊 Jobs count filter (ranges)
  let matchesJobsCount = true;

  const Countjobs = emp.jobsCount || 0;
  console.log(Countjobs,'countjobs');

  if (jobsCountFilter) {
    if (jobsCountFilter.includes("-")) {
      const [min, max] = jobsCountFilter.split("-").map(Number);
      matchesJobsCount = Countjobs >= min && Countjobs <= max;
    } else if (jobsCountFilter.endsWith("+")) {
      const min = Number(jobsCountFilter.replace("+", ""));
      matchesJobsCount = Countjobs >= min;
    }
    else {
      const exact = Number(jobsCountFilter);
      matchesJobsCount = Countjobs === exact;
    }
    
  return matchesJobsCount;
  }

  // ✅ Status filter
  const matchesStatus = statusFilter ? emp.status === statusFilter : true;

  // 🎯 Final combined condition
  return matchesSearch && matchesSize && matchesJobsCount && matchesStatus;
});



//pagination Logic
const totalpages = Math.ceil(filteredEmployers.length/ItemsPerpage)
const StartIndex = (CurrentPage -1)*ItemsPerpage
const paginatedEmployers  = employers.slice(StartIndex, StartIndex + ItemsPerpage)
const csvData = filteredEmployers.map(emp => ({
  Name: emp.fullname,
  JobsCount: emp.jobsCount,
  Size: emp.profile?.strength || "",
  Status: emp.status
}));


  const handleStatusChange = (id: string, newStatus: string) => {
    try{
    const updateStatus = async () => {
      const response = await fetch(`/api/auth/admin/status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      const data = await response.json();

      setDatas((prevDatas) =>
        prevDatas.map((emp) =>
          emp._id === id ? { ...emp, status: newStatus } : emp  
        )
      );
      toast.success('Status updated successfully');
      console.log('Status updated:', data);
      return data;
    }
    updateStatus()
  }
    catch(error){
      console.error(error);
    }

  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Employers - Listing</h1>

      <div className="flex gap-2 mb-4 flex-wrap justify-between items-center">
        <div>
        <label className='block mb-2 font-bold text-xl'>Search</label>
        <input
          type="text"
          placeholder="Type Employers Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded"
        />
        </div>

        <div>
 <label className='block mb-2 font-bold text-xl'>Job Count</label>
        <select onChange={(e) => setSizeFilter(e.target.value)} className="border px-2 py-1 rounded">
    <option value="">Select company-size</option>
    <option value="It's just me">It&apos;s just me</option>
    <option value="2-9 employees">2-9 employees</option>
    <option value="10-99 employees">10-99 employees</option>
    <option value="100-1000 employees">100-1000 employees</option>
    <option value="More than 1000 employees">More than 1000 employees</option>
        </select>
         </div>

<div>
  <label className='block mb-2 font-bold text-xl'>Job Count</label>
<select onChange={(e) => setJobsCountFilter(e.target.value)}  className="border px-2 py-1 rounded">
  <option value="">All</option>
  <option value="1-3">1 - 3</option>
  <option value="3-5">3 - 5</option>
  <option value="5-10">5 - 10</option>
  <option value="10-20">10 - 20</option>
  <option value="20-50">20 - 50</option>
  <option value="50+">50+</option>
</select>
</div>


<div>
  <label className='block mb-2 font-bold text-xl'>Status</label>
        <select onChange={(e) => setStatusFilter(e.target.value)} className="border px-2 py-1 rounded">
          <option value="">Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Suspend">Suspend</option>
        </select>
</div>
        <div>
          <label className='block mb-2 font-bold text-xl'>Search</label>
        <button className="bg-gray-600 px-3 text-white py-1 rounded-full">Search</button>

        </div>
        <div>
          <div>
            <label className='block mb-2 font-bold text-xl'>Export Data</label>
             <CSVLink 
  data={csvData} 
  filename="employers.csv" 
  className="bg-blue-500 text-white px-3 py-1 rounded"
>
  Export CSV
</CSVLink>
          </div>

        </div>
     

      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Jobs Count</th>
            <th className="border p-2">Size</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Manage</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployers.map((emp) => (
            <tr key={emp._id} className="text-center">
              <td className="border p-2">{emp.fullname}</td>
              <td className="border p-2">{emp.jobsCount}</td>
              <td className="border p-2">{emp.profile?.strength}</td>
              <td className="border p-2">{emp.status}</td>
              <td className="border p-2">
                <select
                  value={emp.status}
                  onChange={(e) => handleStatusChange(emp._id, e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="Active">Active</option>
                  <option value="InActive">InActive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='flex justify-center items-center gap-4 mt-4'>
<button onClick={()=>setCurrentPage(prev=> Math.max(prev,1))} disabled={CurrentPage ===1} className='px-3 py-1 border rounded disabled:opacity-50'>
Prev
</button>
<span>{CurrentPage} /{totalpages || 1}</span>
<button onClick={()=>setCurrentPage(prev=> Math.min(prev +1,totalpages))} disabled={CurrentPage === totalpages} className='px-3 py-1 border rounded disabled:opacity-50'>
  Next
</button>
      </div>
       <Toaster />
    </div>
  );
};

export default EmployerListing;

