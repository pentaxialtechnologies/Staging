

'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React,{useEffect, useState} from 'react'

interface ServiceLine {
  category: string;
  serviceline: string;
  percentage: string;
}

interface industry_focus{
  category:string,  
  percentage:string
}

interface Profile {
    companylogo:string
    company_name:string
    company_website:string
    min_project_size:string
    hourly_rate:string
    size_of_company:string
    company_founded:string
    tagline:string
    summary:string
    gst_status : 'Yes' | 'No'
    company_location:string 
    location:{ 
        city:string 
        state:string 
        country:string
    }   
    phone_number:string 
    employee_count:string
  gstno:string    
  service_lines:ServiceLine[],
  industry_focus: industry_focus[],
  client_size: { 
  category:string,
  percentage:string 
 },
    specilization:string
    skills:string[]
    portfolio:{
    title:string
    thumbnail:string
    project_link:string[]
    project_category:string
    timeline:string
    project_cost:string
    screenshot:string
    description:string
    }[]
    admin:{
    email:string
    admin_phone:string
    linkedin_url:string 
    facebook_url:string   
    twitter_url:string
    google_analytics_id:string

    }
    website:{
        website_link:string
        sales_email:string
    }

}

interface  SubCategory{
  id:string
  name:string
}

interface Category {
  id:string
  name:string
  subcategory:SubCategory[]
}



const ProfilePage =()=>{
const [step,setStep]  = useState(1)
const [categories,setcategories] = useState<Category[]>([])


 const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [, setSelectedCity] = useState("");
  const [,setEmail] = useState('')
  const {data:session} = useSession()
  const userId = session?.user.id
  console.log(userId,"ID");

useEffect(()=>{
  if(session?.user.email){
    setEmail(session?.user.email)
  }
},[session])


  // Fetch all countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries/positions");
      const data = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setCountries(data.data.map((item:any) => item.name));
    };
    fetchCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (!selectedCountry) return;

    const fetchStates = async () => {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: selectedCountry || '' }),
      });
      const data = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setStates(data.data.states.map((s:any) => s.name));
      setSelectedState("");
      setCities([]);
      setSelectedCity("");
    };
    fetchStates();
  }, [selectedCountry]);

  // Fetch cities when state changes
  useEffect(() => {
    if ( !selectedState) return;

    const fetchCities = async () => {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: selectedCountry || '', state: selectedState || ''}),
      });
      const data = await res.json();
      setCities(data.data);
      setSelectedCity("");
    };
    fetchCities();
  }, [selectedState,selectedCountry]);


const handleProjectLinkChange = (projectIndex: number, linkIndex: number, value: string) => {
  setFormData(prev => {
    const updatedPortfolio = [...prev.portfolio];
    const updatedLinks = [...updatedPortfolio[projectIndex].project_link];
    updatedLinks[linkIndex] = value;

    updatedPortfolio[projectIndex] = {
      ...updatedPortfolio[projectIndex],
      project_link: updatedLinks,
    };

    return { ...prev, portfolio: updatedPortfolio };
  });
};

const addProjectLink = (projectIndex: number) => {
  setFormData(prev => {
    const updatedPortfolio = [...prev.portfolio];
    if (updatedPortfolio[projectIndex].project_link.length < 3) {
      updatedPortfolio[projectIndex] = {
        ...updatedPortfolio[projectIndex],
        project_link: [...updatedPortfolio[projectIndex].project_link, ''] // ✅ Immutable update
      };
    }
    return { ...prev, portfolio: updatedPortfolio }; 
  });
};

const removeProjectLink = (projectIndex: number, linkIndex: number) => {
  setFormData(prev => {
    const updatedPortfolio = [...prev.portfolio];
    updatedPortfolio[projectIndex] = {
      ...updatedPortfolio[projectIndex],
      project_link: updatedPortfolio[projectIndex].project_link.filter((_, i) => i !== linkIndex)
    };
    return { ...prev, portfolio: updatedPortfolio }; 
  });
};




const SwitchToListing =()=>{
  router.push('/provider/profile/')
}




const [formdata,setFormData]= useState<Profile>({
    companylogo: '',
    company_name: '',
    min_project_size: '',
    company_website:'',
    hourly_rate: '',
    size_of_company: '',
    company_founded: '',
    tagline: '',
    summary: '',
    company_location: '',
    location: { city: '', state: '', country: '' },
    phone_number: '',
    employee_count: '',
    gst_status: 'No',
    gstno: '',
    service_lines: [{
        category:'', serviceline:'', percentage:''
}],
    industry_focus: [{
        category:'',percentage:''
    }],
    client_size: {
        category:'', percentage:''
    },
    specilization: '',
    skills: [] as string[],
    portfolio: [{
  title: '',
  thumbnail: '',
  project_link: [''],
  project_category: '',
  timeline: '',
  project_cost: '',
  screenshot: '',
  description: '',
    }],
    admin: {
      email: '', admin_phone: '', linkedin_url: '',
      facebook_url: '', twitter_url: '', google_analytics_id: ''
    },
    website: { website_link: '', sales_email: '' } 
})


useEffect(()=>{

const fetchDatas = async()=>{
  const res = await fetch('/api/auth/categories/get')
  console.log(res);
  const data = await res.json()
  console.log(data.category);
  setcategories(data.category)
}
fetchDatas()

},[])


const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value } = e.target;

  // Matches format like portfolio[0].title
  const arrayMatch = name.match(/^(\w+)\[(\d+)\]\.(\w+)$/);

  if (arrayMatch) {
    const [, section, index, key] = arrayMatch;
    const idx = parseInt(index);

    if (section === 'portfolio') {
      setFormData(prev => {
        const updatedPortfolio = [...prev.portfolio];
        updatedPortfolio[idx] = {
          ...updatedPortfolio[idx],
          [key]: value,
        };
        return { ...prev, portfolio: updatedPortfolio };
      });
    }

  } else if (name.includes('.')) {
    // For nested fields like admin.email or website.website_link
    const keys = name.split('.');

    setFormData(prev => {
      const updatedFormData = JSON.parse(JSON.stringify(prev)); // ✅ Deep copy to avoid mutation
      let nestedObj = updatedFormData;

      // Traverse safely
      for (let i = 0; i < keys.length - 1; i++) {
        if (!nestedObj[keys[i]]) {
          nestedObj[keys[i]] = {}; // ✅ Create path if it doesn't exist
        }
        nestedObj = nestedObj[keys[i]];
      }

      nestedObj[keys[keys.length - 1]] = value;

      return updatedFormData;
    });

  } else {
    // Top-level fields
    setFormData(prev => ({ ...prev, [name]: value }));
  }
};





// const handleSkillChange =(e:React.ChangeEvent<HTMLInputElement>)=>{
//     const skillArray = e.target.value.split(',').map(skill => skill.trim())
//     setFormData(prev => ({...prev,skills: skillArray}))
// }
const [skillInput,setSkillInput] = useState('')

const handleSkillInputChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
  setSkillInput(e.target.value)
}

function SkillTag({
  skill,
  onRemove,
}:{
  skill:string
  onRemove:()=>void
}
){
  return (
    <span
    className="inline-flex items-center bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-100 rounded-full px-3 py-1 text-sm font-medium cursor-default select-none"
    title={skill}>
{skill}
<button
        type="button"
        onClick={onRemove}
        className="ml-2 text-blue-500 hover:text-blue-800 dark:hover:text-blue-300 focus:outline-none"
        aria-label={`Remove ${skill}`}
      >
        &times;
      </button>
    </span>
  )
}

const addSkill=()=>{
  const skill = skillInput.trim()
  if(skill && !formdata.skills.includes(skill)){
    setFormData((prev)=> ({...prev,skills:[...prev.skills,skill]}))
  }
  setSkillInput('')
}

const removeSkill =(skillremove:string)=>{
setFormData((prev)=> ({...prev,skills:prev.skills.filter((skill)=> skill !== skillremove)}))
}

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

useEffect(() => {
  const fetchData = async () => {
    if (!session?.user?.id) return;

    try {
      const res = await fetch(`/api/auth/organization/update/${session.user.id}`);
      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();
      console.log(data, "Fetched Data");
      setFormData(data); // Pre-fill form if you have setFormdata
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  fetchData();
}, [session?.user?.id]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getProfileCompletion = (formdata: any) => {
  // Define required keys to count for progress
  const requiredFields = [
    "company_name",
    "companylogo",
    "min_project_size",
    "hourly_rate",
    "size_of_company",
    "company_founded",
    "tagline",
    "summary",
    "company_location",
    "phone_number",
    "employee_count",
    "gstno",
    "service_lines",
    "industry_focus",
    "client_size",
    "skills",
    "portfolio",
    "admin",
    "website",
  ];

  let filledCount = 0;

  requiredFields.forEach((key) => {
    const value = formdata[key];
    if (
      value !== null &&
      value !== undefined &&
      (typeof value === "string" ? value.trim() !== "" : true)
    ) {
      filledCount += 1;
    }
  });

  const total = requiredFields.length;
  const percent = Math.round((filledCount / total) * 100);
  return percent;
};

useEffect(() => {
  const completion = getProfileCompletion(formdata);
  console.log(`Profile Completion: ${completion}%`);

  // ✅ Check window is defined (only runs in browser)
  if (typeof window !== 'undefined') {
    localStorage.setItem('profile', completion.toString());
  }
}, [formdata]);


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!session?.user?.id) {
    console.error("User ID missing");
    return;
  }

  try {
    const res = await fetch(`/api/auth/organization/update/${session.user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formdata),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Error:", error);
      throw new Error("Update failed");
    }

    alert("Update successful!");
    setStep(1);
  } catch (err) {
    console.error("Submit error:", err);
    alert("Something went wrong");
  }
};



const handleFileUpload = async (
  e: React.ChangeEvent<HTMLInputElement>,
  projectIndex: number,
  field: 'thumbnail' | 'screenshot' | 'companylogo'
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const allowedTypes = ['image/jpeg', 'image/png'];
  const maxSizeMB = 2;

  if (!allowedTypes.includes(file.type)) {
    alert('Only JPG or PNG files are allowed!');
    return;
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    alert(`File is too large. Max size: ${maxSizeMB}MB`);
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'profile');
  formData.append('folder', 'company/profiles');

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUNDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await res.json();

  if (data.secure_url) {
    if (field === 'companylogo') {
      // ✅ Update logo in root of formdata
      setFormData(prev => ({
        ...prev,
        companylogo: data.secure_url,
      }));
    } else {
      // ✅ Update inside portfolio
      setFormData(prev => {
        const updatedPortfolio = [...prev.portfolio];
        updatedPortfolio[projectIndex] = {
          ...updatedPortfolio[projectIndex],
          [field]: data.secure_url,
        };
        return { ...prev, portfolio: updatedPortfolio };
      });
    }
  }
};


const nextstep = ()=> {
  setStep(prev => Math.min(prev +1,6))
  window.scrollTo({top:0, behavior:'smooth'})
}


const prevstep = () => {
  setStep(prev => Math.max(prev -1,1))
  window.scrollTo({top:0, behavior:'smooth'})
}


const router = useRouter()

return(
  <div className=''>
<div className='flex flex-row justify-between'>
      <h1 className='font-bold text-2xl mb-5'>Let&apos;s get some basic information</h1>
      <button onClick={()=> SwitchToListing()} className='mb-5 text-white bg-blue-800 px-4 py-2 rounded-lg'>Bact To Listing </button>
</div>
  <form
  onKeyDown={(e) => {
    if (e.key === 'Enter' && step !== 4) {
      e.preventDefault(); 
    }
  }}
>
<h2>Step {step} of 6</h2>


     {step === 1 && (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-5">
<div className="flex items-center gap-4">
  {/* Preview Thumbnail */}
  {formdata.companylogo ? (
    <Image
      src={formdata.companylogo}
      alt="Company Logo"
      width={200}
      height={100}
      className="max-w-[180px] max-h-[120px] object-contain rounded border"
    />
  ) : (
    <div className="w-[120px] h-[100px] flex items-center justify-center bg-gray-100 rounded border text-gray-400">
      <svg
        className="w-10 h-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16V4m0 0L3 8m4-4l4 4M17 8h4m0 0v12m0-12l-4 4m4-4l-4-4"
        />
      </svg>
    </div>
  )}

  {/* File Input */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Add Company Logo
    </label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => handleFileUpload(e,0, 'companylogo')}
      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    />
  </div>
</div>

<div className='flex flex-col'>
  <label className='block mb-2'>Company Name</label>
   <input type='text'  name="company_name" value={formdata.company_name ?? ''} onChange={handleChange} className='w-full px-4 py-2 border-gray-300 rounded-xl border  focus:outline-none focus:ring-2 focus:ring-blue-500' />
</div>
   
   <div className='flex flex-col'>
<label className="block text-sm font-medium text-gray-700 mb-1">
  Minimum Project Size
</label>
<select
  name="min_project_size"
  value={formdata.min_project_size || ''}
  onChange={handleChange}
  className="w-full px-4 py-2 border-gray-300 rounded-xl border  focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
  <option value="" disabled>Select a value</option>
  <option value="$1000">$1,000</option>
  <option value="$5000">$5,000</option>
  <option value="$10000">$10,000</option>
  <option value="$25000">$25,000</option>
  <option value="$50000">$50,000</option>
  <option value="$75000">$75,000</option>
  <option value="$100000">$100,000</option>
  <option value="$125000">$125,000</option>
</select>
   </div>

     <div className='flex flex-col'>
<label className="block text-sm font-medium text-gray-700 mb-1">
  Hourly Rate
</label>
<select
  name="hourly_rate"
  value={formdata.hourly_rate || ''}
  onChange={handleChange}
  className="w-full px-4 py-2 border-gray-300 rounded-xl border  focus:outline-none focus:ring-2 focus:ring-blue-500">
  <option value="" disabled>Select a value</option>
  <option value="$25">$25</option>
  <option value="$25-$49">$25-$49</option>
  <option value="$50-$99">$50-$99</option>
  <option value="$100-$149">$100-$149</option>
  <option value="$150-$199">$150-$199</option>
  <option value="$200-$300">$200-$300</option>
  <option value="$300+">$300+</option>
</select>
   </div>

        <div className='flex flex-col'>
<label className="block text-sm font-medium text-gray-700 mb-4">
  Size Of Company
</label>
<select
  name="size_of_company"
  value={formdata.size_of_company || ''}
  onChange={handleChange}
className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
>
  <option value="" disabled>Select a value</option>
  <option value="2-9">2-9</option>
  <option value="10-49">10-49</option>
  <option value="50-249">50-249</option>
  <option value="250-999">250-999</option>
  <option value="1000-9999">1000-9999</option>
  <option value="10000+">10000+</option>
</select>
   </div>
   
      
   
    <div className='flex flex-col'>
  <label className='block mb-2'>Company Founded</label> 
    <input  name="company_founded" 
    className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition" value={formdata.company_founded || ''} onChange={handleChange} />
   </div>
         
          <div className='flex flex-col'>
  <label className='block mb-2'>Tagline</label>
    <input  name="tagline" value={formdata.tagline || ''} className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"  onChange={handleChange} />
   </div>
          
          <div className='flex flex-col'>
  <label className='block mb-2'>Summary</label>
   <textarea
    name="summary"
    value={formdata.summary || ''}
    onChange={handleChange}
    rows={4}
className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    placeholder="Enter project description"
  />
   </div>
  
  </div>
)}

{step === 2 && (
  <div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
      {/* Country */}
      <div className="flex flex-col">
        <label className="mb-2 font-medium text-gray-700">Country</label>
        <select
          className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          name='location.country'
          value={formdata.location?.country || ''}
          onChange={(e) => {
            setSelectedCountry(e.target.value)
            setFormData((prev) => ({...prev,
              location:{
                ...prev.location,
                country:e.target.value
              }
            }))
          }
            
          }
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country} value={country || ''}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {/* State */}
      <div className="flex flex-col">
        <label className="mb-2 font-medium text-gray-700">State</label>
        <select
          className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          name='location.state'

          value={formdata.location?.state || ''}

          onChange={(e) => {
            setSelectedState(e.target.value)
            setFormData((prev)=> ({...prev,
              location:{
                ...prev.location,
                state:e.target.value
              }
            }))
          }}
          disabled={!states.length}
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* City */}
      <div className="flex flex-col">
        <label className="mb-2 font-medium text-gray-700">City</label>
        <select
          className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          name='location.city'
          value={formdata.location?.city || ''}
          onChange={(e) => {
            setSelectedCity(e.target.value)
            setFormData((prev)=> ({...prev,
              location:{
                ...prev.location,
                city:e.target.value
              }
            }))
          }}
          disabled={!cities.length}
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
    </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-5">
     <div className='flex flex-col'>
  <label className='block mb-2'>Company Location</label>
    <input type='text'  className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition" name="company_location" value={formdata.company_location || ''} onChange={handleChange} />
   </div>

    
    
   
    <div className='flex flex-col'>
  <label className='block mb-2'>Phone Number</label>
    <input type='text'   className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"  name="phone_number" value={formdata.phone_number || ''} onChange={handleChange} />
    </div>

            <div className='flex flex-col'>
<label className="block text-sm font-medium text-gray-700 mb-1">
 Employee Count
</label>
<select
  name="employee_count"
  value={formdata.employee_count || ''}
  onChange={handleChange}
  className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
>
  <option value="" disabled>Select a value</option>
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

   
   
  </div>
  </div>
)}

{step === 3 && (
  <div className='flex flex-col'>
    <h1 className='text-center py-5 text-3xl font-bold text-gray-700'>Goods and Services Tax (GST)</h1>


    <div className='flex items-center gap-6 mb-5'>
      <label className='flex items-center gap-2'>
        <input
          type='radio'
          name='gst_status'
          value='No'
          onChange={handleChange}
          checked={formdata.gst_status === 'No'}
        />
        I don&apos;t have GSTIN
      </label>

      <label className='flex items-center gap-2'>
        <input
          type='radio'
          name='gst_status'
          value='Yes'
          onChange={handleChange}
          checked={formdata.gst_status === 'Yes'}
        />
        I have GSTIN
      </label>
    </div>

    {/* GSTIN input only if user has GST */}
    {formdata.gst_status === 'Yes' ?(
      <div className='mt-4'>
        <label htmlFor='gstno' className='block mb-5 font-medium'>GSTIN - INDIA</label>
        <input
          type='text'
          id='gstno'
          name='gstno'
          className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={formdata.gstno || ''}
          onChange={handleChange}
        />
        <p className='text-base text-justify tracking-normal px-4 py-2'>Your GSTIN should have 15 characters. It can start and end with a letter or number, and should look like this: 23RSCCC6023W6Z8</p>
      </div>
    ): (
       <div className='mt-4'>
        <label htmlFor='gstno' className='block  mb-5 font-medium'>GSTIN - INDIA</label>
        <input
          type='text'
          id='gstno'
          name='gstno'
          className='w-full px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          value={formdata.gstno || ''}
          onChange={handleChange}
          disabled
        />
        <p className='text-base text-justify tracking-normal px-4 py-2'>Your GSTIN should have 15 characters. It can start and end with a letter or number, and should look like this: 23RSCCC6023W6Z8</p>
      </div>
    )}
  </div>
)}


{step === 4 && (
   <div className="space-y-8">
    {formdata.service_lines.map((line, index) => (
      <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Category */}
        <div className="flex flex-col">
          <label className="mb-2 font-medium text-gray-700">Service Category</label>
          <select
            value={line.category || ''}
            onChange={(e) => {
              const updated = [...formdata.service_lines];
              updated[index].category = e.target.value;
              setFormData((prev) => ({ ...prev, service_lines: updated }));
            }}
            required
          className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        <div className="flex flex-col">
          <label className="mb-2 font-medium text-gray-700">Subcategory</label>
          <select
            value={line.serviceline  || ''}
            onChange={(e) => {
              const updated = [...formdata.service_lines];
              updated[index].serviceline = e.target.value;
              setFormData((prev) => ({ ...prev, service_lines: updated }));
            }}
            disabled={!line.category}
            required
            className={`w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              !line.category ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
            }`}
          >
            <option value="">Select Subcategory</option>
            {categories
              .find((cat) => cat.name === line.category)
              ?.subcategory.map((sub) => (
                <option key={sub.id} value={sub.name}>
                  {sub.name}
                </option>
              ))}
          </select>
        </div>

        {/* Percentage */}
        {/* <div className="flex flex-col">
          <label className="mb-2 font-medium text-gray-700">Percentage</label>
          <input
            type="number"
            value={line.percentage}
            onChange={(e) => {
              const updated = [...formdata.service_lines];
              updated[index].percentage = e.target.value;
              setFormData((prev) => ({ ...prev, service_lines: updated }));
            }}
            placeholder="e.g. 20"
            className="w-full px-3 py-2 border rounded"
          />
        </div> */}
      </div>
    ))}
   

    {/* Add/Remove Buttons */}
    <div className="flex gap-4">
      <button
        type="button"
        onClick={() =>
          setFormData((prev) => ({
            ...prev,
            service_lines: [
              ...prev.service_lines,
              { category: '', serviceline: '', percentage: '' },
            ],
          }))
        }
        className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        + Add More
      </button>


      {formdata.service_lines.length > 1 && (
        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              service_lines: prev.service_lines.slice(0, -1),
            }))
          }
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          - Delete
        </button>
      )}
    </div>
    <div className="space-y-8">
    {formdata.industry_focus.map((focus,index)=>(
      <div key={index}>
        <div className='flex flex-col'>
           <label className="mb-2 font-medium text-gray-700">Industry Focus</label>
          <select value={focus.category  || ''}
          onChange={(e)=>{
            const updated = [...formdata.industry_focus]
            updated[index].category = e.target.value;
            setFormData((prev)=> ({...prev,industry_focus: updated}))
          }}
          required
          className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Select Industry</option>
        {[
          "Advertising & marketing",
          "Arts & entertainment & music",
          "Automotive", 
          "Business services",
          "Consumer products & services",
          "Dental",
          "eCommerce",
          "Education",
          "Energy & natural resources",
          "Financial services",
          "Gambling",
          "Gaming",
          "Government",
          "GPS & Navigation & GIS",
          "Health Care & Medical",
          "Hospitality & leisure",
          "Information technology",
          "Legal",
          "Legal Cannabis",
          "Manufacturing",
          "Media",
          "Non-profit",
          "Politics",
          "Real estate",
          "Retail",
          "Telecommunications",
          "Transportation",
          "Utilities",
          "Other industries",
        ].map((industry) => (
          <option key={industry} value={industry}>
            {industry}
          </option>
    ))}
          </select>
          </div>

                 </div>
                 
    ))}
     <div className='flex gap-4'> 
<button onClick={()=>{
  setFormData((prev)=> ({...prev,industry_focus:[
    ...prev.industry_focus,
    {
      category:'',percentage: '', 
    },
  ]}))
}}
className='bg-blue-600 text-white px-4 py-2'>
  + Add more
</button>
{formdata.industry_focus.length > 1 && (
<button className='bg-red-600 text-white px-4 py-2'
onClick={()=> {
  setFormData((prev)=> ({...prev,industry_focus :prev.industry_focus.slice(0,-1) }))
}}
>
  - Delete
</button>
)}

            </div>

  </div>

    {/* Client Size, Specialization, Skills */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-5">
      {/* Client Size */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700 mb-1">Client Size</label>
        <select
          name="client_size.category"
          value={formdata.client_size?.category }
          onChange={handleChange}
          className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">Select a value</option>
          <option value="Small Business">Small Business</option>
          <option value="MidMarket">MidMarket</option>
          <option value="Enterprise">Enterprise</option>
        </select>
      </div>

      {/* Specialization */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
        <select
          name="specilization"
          value={formdata.specilization}
          onChange={handleChange}
          className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">Select a value</option>
          <option value="Diversity & Inclusion">Diversity & Inclusion</option>
          <option value="MultiCultural">MultiCultural</option>
          <option value="Accessbility">Accessbility</option>
        </select>
      </div>

      {/* Skills */}
      <div className="flex flex-col">
        <label className="mb-2 text-gray-700 font-medium">
          Skills <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formdata.skills.map((skill) => (
            <SkillTag key={skill} skill={skill} onRemove={() => removeSkill(skill)} />
          ))}
        </div>
        <input
          type="text"
          value={skillInput || ''}
          onChange={handleSkillInputChange}
          onKeyDown={handleSkillKeyDown}
          placeholder="Type a skill and press Enter"
          className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>
    </div>
  </div>
)}
{step === 5 && (
  <>
    <h1 className="text-xl font-bold my-4">Portfolio</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-5">

      {/* Title */}
      
      <div className='flex flex-col'>
        <label className='block mb-2'>Title</label>
        <input
          type='text'
          name="portfolio[0].title"
          className='w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
          value={formdata.portfolio[0]?.title || ''}
          onChange={handleChange}
        />
      </div>
      {/* Thumbnail */}
      <div className='flex flex-col'>
        <label className='block mb-2'>Thumbnail</label>
        <input
          type="file"
          name='portfolio[0].thumbnail'
          className='w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
          onChange={(e) => handleFileUpload(e, 0, 'thumbnail' )} 
        />
      </div>

      {/* Project Links */}
<div className='flex flex-col'>
  <label className='block mb-2 font-medium text-gray-700'>Project Links</label>

  {formdata.portfolio.length > 0 && Array.isArray(formdata.portfolio[0].project_link) && (
    <>
      {formdata.portfolio[0].project_link.map((link, index) => (
        <div key={index} className='flex items-center gap-2 mb-2'>
          <input
            type='text'
            placeholder={`Project Link ${index + 1}`}
            className='w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
            value={link || ''}
            onChange={(e) => handleProjectLinkChange(0, index, e.target.value)}
          />
          {formdata.portfolio[0].project_link.length > 1 && (
            <button
              type="button"
              onClick={() => removeProjectLink(0, index)}
              className='text-red-500 hover:text-red-700 text-sm font-medium'
            >
              ✕
            </button>
          )}
        </div>
      ))}

      {formdata.portfolio[0].project_link.length < 3 && (
        <button
          type="button"
          onClick={() => addProjectLink(0)}
          className='w-fit bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm mt-2'
        >
          + Add another
        </button>
      )}
    </>
  )}
</div>



      {/* Project Category */}
      <div className='flex flex-col'>
        <label className='block mb-2'>Project Category</label>
        <select
          name='portfolio[0].project_category'
          className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={formdata?.portfolio[0]?.project_category || ''}
          onChange={handleChange}
        >
          <option value="">Select a value</option>
          <option value="Web design">Web design</option>
          <option value="Web Development">Web Development</option>
          <option value="E-commerce Development">E-commerce Development</option>
          {/* Other options */}
        </select>
      </div>

      {/* Project Timeline */}
      <div className='flex flex-col'>
        <label className='block mb-2'>Project Timeline</label>
        <select
          value={formdata.portfolio[0]?.timeline || ''}
          name='portfolio[0].timeline'
          className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          onChange={handleChange}
        >
          <option>Select Weeks</option>
          <option value='1 Week'>1 Week</option>
          <option value='2-4 Week'>2-4 Week</option>
          <option value='4-6 Week'>4-6 Week</option>
          <option value='6-8 Week'>6-8 Week</option>
        </select>
      </div>

      {/* Project Cost */}
      <div className='flex flex-col'>
        <label className='block mb-2'>Project Cost</label>
        <select
          value={formdata.portfolio[0]?.project_cost || ''}
          name='portfolio[0].project_cost'
          className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          onChange={handleChange}
        >
          <option>Select Cost</option>
          <option value='Not Disclosed'>Not Disclosed</option>
          <option value='$0 to $10000'>$0 to $10000</option>
          <option value='$10001 to $50000'>$10001 to $50000</option>
          <option value='$50001 to $100000'>$50001 to $100000</option>
          <option value='$100001 to $500000'>$100001 to $500000</option>
          <option value='$500000+'>$500000+</option>
        </select>
      </div>

      {/* Screenshot */}
      <div className='flex flex-col'>
        <label className='block mb-2'>Screenshot</label>
        <input
          type="file"
          name='portfolio[0].screenshot'
          className='w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
          onChange={(e) => handleFileUpload(e, 0, 'screenshot')}
        />
      </div>

      {/* Description */}
      <div className='flex flex-col'>
        <label className='block mb-2 font-medium text-gray-700'>Description</label>
        <textarea
          name="portfolio[0].description"
          value={formdata.portfolio[0]?.description || ''}
          onChange={handleChange}
          rows={4}
          className='w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
          placeholder="Enter project description"
        />
      </div>

    </div>

  </>
)}


{step === 6 && (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-5">
    {/* Admin Email */}
    <div className="flex flex-col">
      <label className="block mb-2">Admin Email</label>
      <input
        type="email"
        name="admin.email"
        value={formdata.admin?.email || ''}
        onChange={handleChange}
        className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>

    {/* Admin Phone */}
    <div className="flex flex-col">
      <label className="block mb-2">Admin Phone Number *</label>
      <input
        type="tel"
        name="admin.admin_phone"
        value={formdata.admin?.admin_phone || ''}
        onChange={handleChange}
        className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>

    {/* LinkedIn URL */}
    <div className="flex flex-col">
      <label className="block mb-2">LinkedIn Profile URL</label>
      <input
        type="url"
        name="admin.linkedin_url"
        value={formdata.admin?.linkedin_url || ''}
        onChange={handleChange}
        className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>

    {/* Facebook URL */}
    <div className="flex flex-col">
      <label className="block mb-2">Facebook URL</label>
      <input
        type="url"
        name="admin.facebook_url"
        value={formdata.admin?.facebook_url || ''}
        onChange={handleChange}
        className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>

    {/* Twitter URL */}
    <div className="flex flex-col">
      <label className="block mb-2">Twitter URL</label>
      <input
        type="text"
        name="admin.twitter_url"
        value={formdata.admin?.twitter_url || ''}
        onChange={handleChange}
        className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>

    {/* Google Analytics */}
    <div className="flex flex-col">
      <label className="block mb-2">Google Analytics Tracking ID</label>
      <input
        type="text"
        name="admin.google_analytics_id"
        value={formdata.admin?.google_analytics_id || ''}
        onChange={handleChange}
        className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>

    {/* Lead Contact Section */}
    <div className="sm:col-span-2">
      <h1 className="mb-5 font-bold text-xl text-center">
        How do you want your leads to contact you?
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Website */}
        <div className="flex flex-col">
          <label className="block mb-2">Website</label>
          <input
            type="text"
            name="website.website_link"
            value={formdata.website?.website_link || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Sales Email */}
        <div className="flex flex-col">
          <label className="block mb-2">Primary Sales Email</label>
          <input
            type="email"
            name="website.sales_email"
            value={formdata.website?.sales_email || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border-gray-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>
    </div>
  </div>
)}


    {/* navigation Buttons  */}
<div className="flex justify-between mt-8">
  {step > 1 && (
    <button
      type="button"
      className="bg-red-400 hover:bg-red-500 px-4 w-30 py-2 rounded-full"
      onClick={prevstep}
    >
      Back
    </button>
  )}

  {step < 6 ? (
    <button
      type="button" 
      className="bg-green-400 hover:bg-green-500 w-30 px-4 py-2 rounded-full"
      onClick={nextstep}
    >
      Next
    </button>
  ) : (
    <button
      type="button" onClick={handleSubmit} 
      className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full"
    >
      Submit
    </button>
  )}
</div>


    </form>
     </div> 
)



}

export default ProfilePage  