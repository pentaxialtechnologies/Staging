'use client'
import React,{useEffect, useState} from 'react'
import toast,{Toaster} from 'react-hot-toast'
import dynamic from 'next/dynamic'
const CSVLink = dynamic(()=> import('react-csv').then(mod=> mod.CSVLink),{
  ssr:false
})
 
interface IProvider {
  companyname:string
  phone:string
  adminphone:string
  adminemail:string
  website:string
  size:string
  StaffCount:string
  status:string
}

const ProviderListing = () => {
const [Datas,setDatas] = useState<any[]>([])
console.log(Datas,'Datas');

const [search,setSearch]= useState('')
const [SizeFilter,setSizeFilter] = useState('')
const [JobCountFilter,setJobCountFilter] = useState('')
const [StatusFilter,setStatusFilter] = useState('')


const [Provider,setProvider] = useState<IProvider[]>([])

useEffect(()=>{
  const FetchDatas = async()=>{
    const res = await fetch('/api/auth/provider/get')
    const response = await res.json()
    setDatas(response.ProviderDetails)
    console.log(response.ProviderDetails,'response ');
  }
  FetchDatas()
},[])


const handleStatusChange = (id:string,Newstatus:string)=>{
try{
const UpdatedStatus = async()=> {

const response = await fetch(`/api/auth/admin/providerstatus/${id}`,{
  method:'PUT',
  headers:{
    'Content-Type':'application/json'
  },
  body:JSON.stringify({status: Newstatus})
})
if(!response.ok){
  throw new Error('Failed updated status')
}
const res = await response.json()
setDatas((prev)=> prev.map((provider)=>
provider._id ?{...provider,status:Newstatus} : prev
))
toast.success('Status Updated Successfully!')
console.log('Updated')
}
UpdatedStatus()
}
catch(error){
  console.error(error);
}
}







const FilteredProvider = Datas.filter((prov)=>{
  const length = prov.StaffCount ? prov.StaffCount.length : 0

  const MatchSearch = prov.companyname?.toLowerCase().includes(search?.toLowerCase())

  const MatchSize = SizeFilter ? prov?.employee_count === SizeFilter :true;

  let MatchJobCount = true

  const Countjobs = prov.StaffCount || 0

if(JobCountFilter){
  if(JobCountFilter.includes('-')){
    const [min,max] = JobCountFilter.split('-').map(Number)
    MatchJobCount = Countjobs  >= min && Countjobs <= max
  }
  else if(JobCountFilter.includes('+')){
    const min = Number(JobCountFilter.replace("+",""))
    MatchJobCount = Countjobs >=min
  }
  else{
const exact = Number(JobCountFilter)
MatchJobCount = Countjobs === exact
  }
  return MatchJobCount
}

const MatchStatus = StatusFilter ? prov.status === StatusFilter : true


return MatchSearch && MatchSize && MatchJobCount && MatchStatus

},[])

const [CurrentPage,setCurrentPage] = useState(1)
const itemPerPage = 10

// Pagination Logic here
const totalpages = Math.ceil(FilteredProvider.length/itemPerPage)
const startIndex = (CurrentPage -1) * itemPerPage



const csvData = FilteredProvider.map(prov=>({
  firstname:prov.firstname,
  lastname:prov.lastname,
  Companyname:prov.companyname,
  Phone:prov.phone,
  Adminphone: prov.adminphone,
  Adminemail:prov.adminemail,
  website:prov.website,
  size:prov.employee_count,
  No_of_Benchers:prov.StaffCount,
  status:prov.status
}))


  return (
    <div>
      <Toaster/>
      <h1 className='text-3xl text-center font-bold mb-8'>Provider Listing</h1>

      <div className='flex flex-wrap gap-6 items-center justify-between mb-8'>
    <div>
      <label className='block mb-2 text-xl font-bold'>Search</label>
      <input type='text' placeholder='Enter Provider name' value={search} onChange={(e:any)=> setSearch(e.target.value)} className='border px-4 py-2 rounded ' />
    </div>
    <div>
  <label className='block font-bold text-xl mb-2'>Company Size</label>
  <select className='border px-4 py-2 rounded'  onChange={(e)=> setSizeFilter(e.target.value)} >
  <option value="">Select a value</option>
  <option value="1 Employee">1 Employee</option>
  <option value="2-5 Employees">2-5 Employees</option>
  <option value="6-9 Employees">6-9 Employees</option>
  <option value="10-15 Employees">10-15 Employees </option>
  <option value="25-40 Employees">25-40 Employees</option>
  <option value="45-60 Employees">45-60 Employees</option>
  <option value="65-80 Employees">65-80 Employees</option>
  <option value="100+ Employees">100+ Employees</option>
      </select>
    </div>
    <div>
  <label className='text-xl block mb-2 font-bold'>Count of Benchers</label>
  <select className='border px-4 py-2 rounded' onChange={(e)=> setJobCountFilter(e.target.value)}>
  <option value="" >All</option>
  <option value="0">0</option>
  <option value="1-9">1 - 9</option>
  <option value="10-15">10 - 15</option>
  <option value="15+">15+</option>
      </select>
    </div>

    <div>
      <label className='block mb-2 text-xl font-bold'>Status</label>
      <select className='border px-4 py-2 rounded' onChange={(e)=> setStatusFilter(e.target.value)}>
        <option value=''>Status</option>
        <option value='Active'>Active</option>
        <option value='InActive'>InActive</option>
        <option value='Suspended'>Suspended</option>
      </select>
    </div>

<div>
  <label className='block mb-2 text-xl font-bold' >Search </label>

  <button className='bg-gray-500 px-4 py-2 rounded text-white'>Search</button>
</div>

<div>
  <label className='block mb-4 text-xl font-bold' >Export </label>
<CSVLink data={csvData} className="bg-blue-500 text-white px-3 py-1 rounded mb-2">
  Export CSV
</CSVLink>
</div>
      </div>


<table className='w-full border-collapse border'>
  <thead>
    <tr className='bg-gray-200'>
      <th className='border p-2'>Name</th>
      <th className='border p-2'>Bench Count</th>
      <th className='border p-2'>Size</th>
      <th className='border p-2'>Status</th>
      <th className='border p-2'>Manage</th>
    </tr>
  </thead>
  <tbody>
    {FilteredProvider.map((prov)=>(
      <tr key={prov._id} className='text-center'>
      <td className='border p-2'>{prov.companyname || ''}</td>
      <td className='border p-2'>{prov.StaffCount || 0}</td>
      <td className='border p-2'>{prov.employee_count}</td>
      <td className='border p-2'>{prov.status}</td>
      <td className='border p-2'>
        <select value={prov.status} className=' border px-2 py-1' onChange={(e)=> handleStatusChange(prov._id,e.target.value)}>
          <option value='Active'>Active</option>
          <option value='InActive'>InActive</option>
          <option value='Suspended'>Suspended</option>
        </select>
      </td>
    </tr>
    ))}
    
  </tbody>
</table>

<div className='flex justify-center items-center gap-4 my-4'> 
  <button onClick={()=> setCurrentPage(prev =>Math.max(prev,1))} disabled={CurrentPage === 1} className='px-3 py-1 border rounded disabled:opacity-50'>
    Prev
  </button>
<span>{CurrentPage}/{totalpages}</span>
  <button disabled={CurrentPage === totalpages} onClick={()=> setCurrentPage(prev=> Math.min(prev+1,totalpages))} className='px-3 py-1 border rounded disabled:opacity-50'>Next</button>

</div>
      </div>
  ) 
}

export default ProviderListing