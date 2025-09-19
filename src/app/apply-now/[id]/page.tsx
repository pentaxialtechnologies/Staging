  'use client'
  import CompanyHeader from '../../../Components/CompanyHeader'
  import { formatDistanceToNow } from 'date-fns'
import { useSession } from 'next-auth/react'
  import { useParams } from 'next/navigation'
  import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";

  interface Job {
    _id: string
    title: string
    postedBy: {
    lastActiveAt: string 
    }
    experience:{
      minyears:string
      maxyears:string
    }
  updatedAt: Date
  job_description : string
  key_responsibilities: string
  technical_skills: string
  skills:string[]
  duration:string
  workmode:string
  joblocation:string
  engagement_type:string
  budget:string
  currency_type:string
  payment_schedule:string
  }

  interface FormData{
    id:string
    skills:string[]
    firstname:string
  }


interface Proposal{
  employerId: string,
  description:string,
  frequency_type: string,
  currency_type:string
  amount:string
  increase_rate:string
  increase_percentage:string
  company_profile:string
  Candidate_data:[{
      firstname:string
      lastname:string
      skills:string[]
      resume:string
  }]
}


  const Page = () => {
    const { id } = useParams<{ id: string }>()
    const [jobs, setJobs] = useState<Job[]>([])
    const [Form,setForm] = useState<FormData>({
      id:'',
      firstname:'',
      skills:[]
    })

    const [Proposals,setProposals] = useState<Proposal>({
      employerId: "",
      description:"",
      frequency_type: "",
      currency_type:"",
      amount: "",
      increase_rate:"",
      increase_percentage:"",
      company_profile:"",
      Candidate_data:[{
          firstname:"",
          lastname:"",
          skills:[""],
          resume:"",
      }]
    })
    const [skillInput,setskillInput] = useState('')

const [Candidates,setCandidates] = useState<Array<{
  firstname: string;
  lastname: string;
  skills: string[];
  resume: string | null;
}>>([
  {firstname:'',lastname:'',skills:[],resume:null}
])


const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;
  setProposals((prev) => ({ ...prev, [name]: value }));
}


const handleCandidateChange = (  index: number,field: keyof typeof Candidates[0],
value: string
) => {
  const Updated = [...Candidates];
  (Updated[index] as any)[field] = value;
  setCandidates(Updated);
};

const {data:session} = useSession() 
console.log(session?.user.id,'user session id');


    useEffect(() => {
      const fetchJobs = async () => {
        try {
          const baseURL = process.env.NEXT_PUBLIC_BASE_URL
          const res = await fetch(`${baseURL}/api/auth/jobs/${id}`, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          const response = await res.json()

          const JobData = Array.isArray(response.data) ? response.data : response.data ? [response.data] : []
          setJobs(JobData)
          console.log('jobs', response.data)
        } catch (error) {
          console.error('Error fetching jobs:', error)
        }
      }

      if (id) {
        fetchJobs()
      }
    }, [id]) 

  
const handleFileUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        field: 'company_profile' | 'resume', index?:number) => {
        const file = e.target.files?.[0]
        if (!file) return
    
     const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
        const maxSizeMB = 2
    
        if (!allowedTypes.includes(file.type)) {
          alert('Only JPG PNG or PDF files are allowed!')
          return
        }
    
        if (file.size > maxSizeMB * 1024 * 1024) {
          alert(`File is too large. Max size: ${maxSizeMB}MB`)
          return
        }
    
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', 'profile')
        formData.append('folder', 'company/profiles')
    
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUNDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData
        })
    
        const data = await res.json()
        if (data.secure_url) {
          if (field === 'company_profile') {
            setProposals((prev) => ({
              ...prev,
              [field]: data.secure_url
            }))
          }
           else if (field === "resume" && index !== undefined) {
      setCandidates((prev) => {
        const updated = [...prev];
        updated[index].resume = data.secure_url;
        return updated;
      });
    }
          
        
        }
      }

 const router = useRouter(); 


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const payload = {
        ...Proposals,
        ProviderId: session?.user.id,
        JobId:id,
        Candidate_data:
          Candidates.length > 0
            ? Candidates.map(c => ({
                firstname: c.firstname,
                lastname: c.lastname,
                skills: c.skills,
                resume: c.resume ? String(c.resume) : ""
              }))
            : Proposals.Candidate_data
      };

      const res = await fetch(`/api/auth/proposal/apply`, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Failed to submit proposal");
      }

      const response = await res.json();
      console.log(response.data, "Proposal response");

      router.push('/jobs');

    } catch (error) {
      console.error("Error submitting proposal:", error);
    }
  };


    


    const addskills = ()=>{
      if(skillInput && !Form.skills.includes(skillInput)){
        setForm((prev)=> ({...prev, skills:[...prev.skills,skillInput]}))
      }
      setskillInput('')
    }

    const removeskills = (skill:string)=>{
      setForm((prev)=> ({...prev, skills: prev.skills.filter((p) => p !== skill)}))
    }


    return (
      <div className='bg-blue-50 min-h-screen '>
        <CompanyHeader />
        <h1 className='text-center text-3xl sm:text-4xl font-bold mb-10'>
          Submit a proposal
        </h1>

        <div className='bg-white rounded-xl shadow-xl p-8 max-w-5xl mx-auto'>
          {Array.isArray(jobs) && jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job._id} className='border-b last:border-none py-3'>
                <h2 className='text-2xl font-bold'>{job.title}</h2>
                <p className='mt-5'>Posted : {new Date(job.updatedAt).toLocaleDateString()}</p>
                <p className='mt-5'>Job Description : {job.job_description}</p>
                <p className='mt-5'>Reponsibilities : {job.key_responsibilities}</p>
                <p className='mt-5'>Technical Skills : {job.technical_skills}</p>
                
      <div>
        <h3 className='font-semibold mt-5'>Skills: </h3>
        <ul className='flex flex-wrap gap-2'>
                  {job.skills.map((skill,idx)=> (
                    <li key={idx} className='bg-blue-200 text-blue-700 gap-4 px-2.5 py-2 rounded-full mt-3 text-sm'>
                      {skill}
                    </li>
                      ))}
        </ul>
        </div>

      <div className='bg-gray-100 mt-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4 p-4'>
      <p className='font-bold text-xl'>
        Project length  <br />
        <span className='text-sm font-normal'>{job.duration}</span>
      </p>

      <p className='font-bold text-xl'>Work mode  <br/>
      <span className='text-sm font-normal'>{job.workmode}</span>
      </p>
      <p className='font-bold text-xl'>Job location <br/>
        <span className='font-normal text-sm'>{job.joblocation}</span>
      </p>
      <p className='font-bold text-xl'>Employment type <br/>
      <span className='text-sm font-normal'>{job.engagement_type}</span>
      </p>
      <p className='font-bold text-xl'>Experience <br/>
      <span className='text-sm font-normal'>{job.experience.minyears} - {job.experience.maxyears} Years</span>
      </p>
      <p className='font-bold text-xl'>Budget
        <br/>
        <span className='text-sm font-normal'>{job.currency_type} {job.budget}/ {job.payment_schedule} </span>
      </p>
      </div>
      </div>

  <form onSubmit={handleSubmit}>
    <div className='mt-4'>
      <label className='block mb-2'>Description</label>
      <textarea name='description' onChange={handleChange} value={Proposals.description} placeholder='Add a Description' className='border border-gray-200  px-4 py-2 w-full h-30'/>
    </div>

  <div>
    <h1 className='font-semibold text-xl mt-5 mb-4'>Propose Payment terms</h1>
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
      <div>
        <label className='block mb-2'>Frequency</label>
        <select name='frequency_type' onChange={handleChange} value={Proposals.frequency_type} className='border border-gray-200 px-4 py-2 w-full focus:outline-none'>
            <option>Select a Frequency</option>
            <option value='Hourly'>Hourly</option>
            <option value='Weekly'>Weekly</option>
            <option value='BiWeekly'>BiWeekly</option>
            <option value='Monthly'>Monthly</option>
            <option value='Quartrly'>Quartrly</option>
        </select>
      </div>
        <div>
        <label className='block mb-2'>Currency</label>
        <select name='currency_type' onChange={handleChange} value={Proposals.currency_type} className='border border-gray-200 focus:outline-none px-4 py-2 w-full'>
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="NZD">NZD</option>
              <option value="AUD">AUD</option>
              <option value="GBP">GBP</option>
              <option value="HKD">HKD</option>
              <option value="SGD">SGD</option>
              <option value="EUR">EUR</option>
              <option value="CAD">CAD</option>
              <option value="AED">AED</option>
              <option value="QAR">QAR</option>
              <option value="KWD">KWD</option>  
        </select>
      </div>
        <div>
        <label className='block mb-2'>Amount</label>
      <input type='number' name='amount' onChange={handleChange} value={Proposals.amount} className='border focus:outline-none border-gray-200 px-4 py-2 w-full' />
      </div>
    </div>

  </div>
      
  <div className='mt-5'>
    <h1 className='text-xl font-semibold'>Schedule a rate increase</h1>
    <p className='text-md mt-2 mb-4'>Propose an optional rate increase. If approved by the client, the rate will automatically adjust over the duration of the contract.</p>
  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
  <div>
    <label className='block mb-2'>How Often do you want a rate increase?*</label>
    <select name='increase_rate' onChange={handleChange} value={Proposals.increase_rate} className='border border-gray-200 px-4 py-2 w-full '>
      <option value=''>Select a Frequency</option>
      <option value='Never'>Never</option>
      <option value='Every 3 month'>Every 3 month</option>
      <option value='Every 6 month'>Every 6 month</option>
      <option value='Every 12 month'>Every 12 month</option>
    </select>
  </div>
  <div>
    <label className='block mb-2'>How much of an increase do you want?</label>
    <select name='increase_percentage' onChange={handleChange} value={Proposals.increase_percentage} className='border border-gray-200 px-4 py-2 w-full '>
     <option>Select an Option</option>
    <option value='5%'>5%</option>
    <option value='10%'>10%</option>
    <option value='15%'>15%</option>
    <option value='Custom'>Custom</option>
    </select>
  </div>

  </div>
  </div>

<div className="mt-4">
  <label className="block mb-2 font-semibold">Attach company profile:</label>
  <input
    type="file"
    name="company_profile"
    onChange={(e) => handleFileUpload(e, "company_profile")}
    className="border border-gray-300 px-4 py-2 w-full"
  />
  {Proposals.company_profile && (
    <p className="text-green-600 mt-1">✅ Uploaded successfully</p>
  )}
</div>



<div className='mt-5'>
 <h1 className="text-xl font-bold mb-4">Candidate's data</h1>
 {Candidates.map((candidate,index)=>(
  <div key={index} className="border rounded-lg p-4 mb-6 bg-gray-50">
    <h2 className='font-semibold mb-3'>Candidate {index+1}</h2>
    <div className='grid grid-cols-2 gap-6'>
      <div>
        <label>Firstname</label>
        <input type='text'  value={candidate.firstname} 
        className="border border-gray-300 px-4 py-2 w-full rounded-md focus:outline-none" 
        onChange={(e)=> handleCandidateChange(index,"firstname",e.target.value)} />
        </div>
        <div>
          <label>Last Name</label>
          <input type='text' value={candidate.lastname} 
          className='border border-gray-300 px-4 py-2 w-full rounded-md focus:outline-none'
          onChange={(e)=>
          handleCandidateChange(index,"lastname",e.target.value)}/>
          </div>
          </div>


          <div className='flex gap-2 flex-wrap mt-4'>
            {candidate.skills.map((skill,idx)=> (
              <span key={idx} className='px-3 py-1 bg-blue-100 text-blue-600 rounded-full flex items-center gap-2'>
                {skill}
                <button type='button'
                onClick={()=>{
                  const updated =[...Candidates];
                  updated[index].skills = updated[index].skills.filter((s)=>s !==skill);
                  setCandidates(updated) 
                }}
                className="text-red-500 font-bold hover:text-red-700"
                >
                   X
                </button>
              </span>
            ))}
            </div>
    <div className="mt-4 mb-4 flex gap-2">
  <input type='text' value={skillInput}
   onChange={(e)=> setskillInput(e.target.value)}
    onKeyDown={(e)=>{
    if(e.key === 'Enter'){
      e.preventDefault()
      if(skillInput.trim()){
        const updated = [...Candidates];
        updated[index].skills.push(skillInput.trim());
        setCandidates(updated)
        setskillInput("");
      }
    }
  }}
  placeholder='Add Skill'
  className="border rounded px-3 py-2 w-full"
  />
    <button
          type="button"
          onClick={() => {
            if (skillInput.trim()) {
              const updated = [...Candidates];
              updated[index].skills.push(skillInput.trim());
              setCandidates(updated);
              setskillInput("");
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add
        </button>
</div>

<div>
  <label className="block mb-2">Attach resume</label>
  <input
    type="file"
    onChange={(e) => handleFileUpload(e, "resume", index)}
    className="border border-gray-300 px-4 py-2 w-full"
  />
  {Candidates[index]?.resume && (
    <p className="text-green-600 mt-1">✅ Resume uploaded</p>
  )}
</div>

    </div>
 ))}

 <div className='flex justify-between items-center gap-6 mt-6'>
<button type='button'
onClick={()=>{
setCandidates([...Candidates,{firstname:'',lastname:'',skills:[],resume:null}])
}}
className="bg-blue-400 text-lg px-4 py-2 text-white rounded-full"
>
Add More Profile
</button>
<button
  type="submit"
  className="bg-[#f07164] text-lg px-4 py-2 text-white rounded-full"
>
  Send proposal
</button>

 </div>
</div>



  </form>

              </div>
            ))
          ) : (
            <p className='text-center text-gray-500'>Loading Jobs.</p>
          )}
        </div>
      </div>
    )
  }

  export default Page
