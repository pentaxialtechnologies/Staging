'use client';
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

type CompanyData = {
  companylogo: string;
  company_name:string
  company_location:string
  location?:{
    state?:string
    city?:string
  }
};

type StaffData = {
  isApproved: boolean;
  _id :string;
  isActive: boolean | undefined;
  designation: string;
  primaryskills: string[] | null; 
  numberBenchStaff: string
  rate:string
  averageExperience:string
  skills:string[]
  workFrom : string
  engagementType:string
  availableAtClientLocation:string
  availability:string
  updatedAt:Date
};

const StaffList = () => {
  const { data: session } = useSession();
  const orgId = session?.user?.id;
const router = useRouter()

  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [staffList, setStaffList] = useState<StaffData[]>([]);

  useEffect(() => {
    if (!orgId) return;

    const fetchStaff = async () => {
      try {
        const res = await fetch(`/api/auth/organization/staff-list?orgId=${orgId}`);
        const data = await res.json();

        if (res.ok) {
          setStaffList(data.staff);
        } 
      } catch (error) {
        console.error("Error fetching staff list:",error);
      }
    };

    fetchStaff();
  }, [orgId]);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const res = await fetch('/api/auth/user/session');
        const data = await res.json();
        setCompanyData(data.user); // Assuming `data.user` is an object, not array
      } catch (error) {
        console.error("Error fetching company data:",error);
      }
    };

    fetchCompanyData();
  }, []);




const handleDeleteStaff = async (id: string) => {
  try {
    const res = await axios.delete(`/api/auth/organization/staff/delete/${id}`);

    if (res.status === 200) {
      alert('Staff Deleted Successfully!');
      setStaffList((prevList) => prevList.filter((staff) => staff._id !== id));
    } else {
      alert('Failed to delete staff');
    }

  } catch (error) {
    console.error("Error deleting staff:", error);
    alert("Failed to delete staff");
  }
};



  const handleUpdateStaff = async (id:string)=>{
  router.push(`/provider/list-staffs/${id}`)
  }


  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Company Bench Staff List</h2>
<div className="w-full flex justify-end mb-4">
  <button onClick={()=>router.push('/provider/staff')} className="bg-[#f27264] text-white font-bold px-6  py-2 rounded-full shadow-md hover:shadow-xl hover:bg-[#f27264] ">
    Add Staff
  </button>
</div>

      {companyData && (
        <div className="flex flex-row gap-6">

        <div className="mb-6">
          <Image
            src={companyData.companylogo || ''}
            alt="Company Logo"
            width={300}
            height={100}
            className="w-65 h-auto object-contain"
          />
        </div>

        <div>
          <h1 className="text-xl font-bold text-gray-800">{companyData.company_name}</h1>
         
         <p className="text-base tracking-normal">{companyData.company_location},{companyData?.location?.city},{companyData?.location?.state}</p>
          </div>
          </div>
      )}
<div>
    <div className="bg-white shadow-md p-6 rounded-lg">


<div className="grid grid-cols-1 gap-6">
  {staffList.map((staff, index) => (
    <div key={index} className="bg-white shadow-lg border rounded-xl p-6 transition hover:shadow-xl">
      {/* Top Controls */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-wrap gap-2">
          
        </div>

        <div className="flex items-center gap-3">
          <button onClick={()=> handleUpdateStaff(staff._id)} className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
            <Pencil size={16} />
          </button>
          <button onClick={()=> handleDeleteStaff(staff._id)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
            <Trash2 size={16} />
          </button>

          {/* Toggle Switch */}
          {/* <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked={staff.isActive} />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 relative transition-all duration-200">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5" />
            </div>
          </label> */}
        </div>
      </div>

      {/* Grid Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
        <div className="space-y-1">
          
          <p><strong>Designation:</strong> <span className="text-red-600 font-semibold">{staff.designation}</span></p>
          <p><strong>Number Bench Staff:</strong> {staff.numberBenchStaff}</p>
          <p><strong>Rate:</strong> ${staff.rate} (Hourly)</p>
          <p><strong>Experience:</strong> {staff.averageExperience}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <strong className="w-full">Skills:</strong>
            {staff.skills.map((skill, idx) => (
              <span key={idx} className="bg-blue-200 text-blue-800 px-2 py-1 text-xs rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>


        <div className="space-y-1">
          <p><strong>Work From:</strong> {staff.workFrom}</p>
          <p><strong>Engagement Type:</strong> {staff.engagementType}</p>
          <p><strong>Available at Client Location:</strong> {staff.availableAtClientLocation}</p>
          <p><strong>Availability:</strong> {staff.availability}</p>
          <p><strong>Active Date:</strong> {new Date(staff.updatedAt).toLocaleDateString()}</p>
          <p className="font-semibold">
        Active Status:{" "}
        <span className={`ml-1 px-2 py-1 rounded-full text-xs ${staff.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
          {staff.isApproved ? "Approved" : "Pending"}
        </span>
        </p>
        </div>
      </div>
    </div>
  ))}
</div>

  </div>
      </div>

</div>
   
  );
};

export default StaffList;




            {/* Toggle Switch */}
            {/* <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                defaultChecked={staff.isActive}
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-green-500 relative transition-all duration-200">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5" />
              </div>
            </label> */}