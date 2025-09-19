"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react"

import { convertFromRaw, convertToRaw,ContentState, EditorState,convertFromHTML, } from 'draft-js';

const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), {
  ssr: false,
});
import {  useSession } from "next-auth/react";
import {useForm,Controller, Form} from 'react-hook-form'
import { useParams } from "next/navigation";


  interface JobForm {
    technical_skills: string
    title: string
    skills: string[]
    budget: string;
    rate:string
    duration: string
    staff_count:string
    availability: string
    timezone: string
    workmode: string
    job_description: string
    engagement_type:string
    currency_type: string
    payment_schedule:string
    key_responsibilities: string
    joblocation:string
    plannedStartDate:Date
    workmodes :string
    experience: {
    minyears:string
    maxyears:string
  }
   postedBy: string; 
  }

  const initialFormState: JobForm = {
    title: "",
    skills: [],
    budget: "",
    duration: "",
    availability: "",
    timezone: "",
    workmode: "",
    rate: "",
    staff_count:'',
    job_description: "",
    currency_type: "",
    key_responsibilities: "",
    payment_schedule: "",
    engagement_type: "",
    joblocation:'',
    workmodes: '',
    plannedStartDate: new Date(),
    technical_skills: '',
    experience: {
      minyears: "",
      maxyears: "",
    },
    postedBy: "",
  };


export default function CreateJobForm() {
    const [form, setForm] = useState<JobForm>(initialFormState);
    const [SkillError,setSkillError] = useState('');
    // const {register,control,handleSubmit,setValue,getValues,reset,trigger,formState:{errors}} = useForm({defaultValues:initialFormState});
    const [KeyState, setKeyState] = useState(() => EditorState.createEmpty());
 
    const [SkillState, setSkillState] = useState(() => EditorState.createEmpty());

    const [Step,setStep] = useState(1)
    const isMountedRef = useRef(true);

const {id} = useParams()
  console.log(id,'get from job');
  
const [JobData,setJobData] = useState<JobForm>(initialFormState)
const [existingData, setExistingData] = useState({
  job_description:'',
  key_responsibilities:'',
  technical_skills:''
});
useEffect(() => {
  const FetchData = async () => {
    try {
      const res = await fetch(`/api/auth/contractjobs/getjob/${id}`);
      if (!res.ok) throw new Error("Failed to fetch job data");
      const data = await res.json();
      if (!data || !data.job._id) throw new Error("Job not found");
      setJobData(data.job); 
      console.log(data.job.key_responsibilities,'responsibility');
      console.log(data.job.technical_skills,'technical_skills');

      
      setExistingData({
        job_description: data.job.job_description,
        key_responsibilities: data.job.key_responsibilities,
        technical_skills: data.job.technical_skills
      })
      console.log(JobData,'JOB Data from API');
      
    } catch (error) {
      console.error("Error fetching job data:", error);
    }
  };

  FetchData();
}, [id]);



// useEffect(() => {
//   const isValidJSON = (str: string) => {
//     try {
//       const parsed = JSON.parse(str);
//       return parsed && typeof parsed === 'object';
//     } catch {
//       return false;
//     }
//   };

//   if (isValidJSON(existingData.job_description)) {
//     const raw = JSON.parse(existingData.job_description);
//     setEditorState(EditorState.createWithContent(convertFromRaw(raw)));
//   }

//   if (isValidJSON(existingData.key_responsibilities)) {
//     const raw = JSON.parse(existingData.key_responsibilities);
//     setKeyState(EditorState.createWithContent(convertFromRaw(raw)));
//   }

//   if (isValidJSON(existingData.technical_skills)) {
//     const raw = JSON.parse(existingData.technical_skills);
//     setSkillState(EditorState.createWithContent(convertFromRaw(raw)));
//   }
// }, [existingData]);

const createEditorState = (input: unknown) => {
  if (!input || typeof input !== "string") {
    return EditorState.createEmpty();
  }

  // Try raw Draft.js JSON
  try {
    const parsed = JSON.parse(input);
    if (parsed && typeof parsed === "object" && parsed.blocks) {
      return EditorState.createWithContent(convertFromRaw(parsed));
    }
  } catch {
    // Not JSON, try HTML
    if (typeof input === "string") {
      const blocksFromHTML = convertFromHTML(input);
      const content = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      return EditorState.createWithContent(content);
    }
  }

  return EditorState.createEmpty();
};


useEffect(() => {
  setEditorState(createEditorState(existingData.job_description));
  setKeyState(createEditorState(existingData.key_responsibilities));
  setSkillState(createEditorState(existingData.technical_skills));
}, [existingData]);

    const handleNext = async()=>{
      window.scrollTo({top:0, behavior:'smooth'})
        setStep((prevStep) => prevStep+1)
    }
const handlePrev = () => {
  setStep((prevStep) => {
    if (prevStep > 0) {
      // scroll AFTER updating the step
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 0);
      return prevStep - 1;
    }
    return prevStep;
  });
};


    



const updateEditor = (state: EditorState, key: keyof JobForm) => {
  const raw = convertToRaw(state.getCurrentContent());
  const stringified = JSON.stringify(raw);
  setJobData(prev => ({ ...prev, [key]: stringified }));
};







const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

const onEditorStateChange = (state: EditorState) => {
  setEditorState(state);
  updateEditor(state, 'job_description');
};

const onEditorKeyChange = (state: EditorState) => {
  setKeyState(state);
  updateEditor(state, 'key_responsibilities');
};

const onEditorSkillChange = (state: EditorState) => {
  setSkillState(state);
  updateEditor(state, 'technical_skills');
};


useEffect(() => {
  return () => {
    isMountedRef.current = false; 
  };
}, []);

// const hydratedRef = useRef(false);

// useEffect(() => {
//   if (hydratedRef.current) return;

//   try {
//     if (JobData.job_description) {
//       setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(form.job_description))));
//     }
//     if (JobData.key_responsibilities) {
//       setKeyState(EditorState.createWithContent(convertFromRaw(JSON.parse(form.key_responsibilities))));
//     }
//     if (JobData.technical_skills) {
//       setSkillState(EditorState.createWithContent(convertFromRaw(JSON.parse(form.technical_skills))));
//     }
//     hydratedRef.current = true;
//   } catch (error) {
//     console.error("Error parsing editor content:", error);
//   }
// }, []);



const [input, setInput] = useState("");

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
    e.preventDefault();
    const newSkill = input.trim().toLowerCase();
    if (!JobData.skills.some(skill => skill.toLowerCase() === newSkill)) {
      setForm(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
      setSkillError('');
    }
    setInput('');
  }
};


const removeSkill = (index: number) => {
  const updated = [...JobData.skills];
  updated.splice(index, 1);
  setForm(prev => ({ ...prev, skills: updated }));
  if (updated.length === 0) {
    setSkillError('Please enter at least one skill');
  }
};

  const [, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;

  // Handle nested experience
  if (name.startsWith("experience.")) {
    const key = name.split(".")[1];
    setJobData((prev) => ({



      ...prev,
      experience: {
        ...prev.experience,
        [key]: value,
      },
    }));
    return;
  }

  // General fields
  setJobData((prev) => ({ ...prev, [name]: value }));
  setForm((prev) => ({ ...prev, [name]: value }));
};





const {data: session} = useSession();
const userId = session?.user.id
console.log(userId,"userId");

function extractTextsFromRawString(rawString: string): string[] {
  try {
    if (!rawString) return [];
    const raw = JSON.parse(rawString);
    return raw.blocks?.map((block: any) => block.text.trim()).filter(Boolean) || [];
  } catch (err) {
    console.error("Invalid raw JSON in DraftJS content:", rawString);
    return [];
  }
}


const handleSubmit = async (e:React.FormEvent) => {
  e.preventDefault(); 
  setLoading(true);
  setError(null);
  setSuccess(false);

  // Optional: Validation (uncomment if using react-hook-form)
  // const isValid = await trigger([
  //   "job_description",
  //   "key_responsibilities",
  //   "technical_skills",
  // ]);
  // if (!isValid) {
  //   setLoading(false);
  //   return;
  // }

 const payload = {
  ...JobData,
  currency_type: JobData.currency_type ?? "USD",
  timezone: JobData.timezone ?? "Asia/Kolkata",
  workmodes: JobData?.workmode || "", 
  joblocation: JobData?.joblocation || "", 

  rate:JobData?.rate || '',
  experience: {
    minyears: parseInt(JobData.experience?.minyears || "0"),
    maxyears: parseInt(JobData.experience?.maxyears || "0"),
  },
  plannedStartDate: JobData?.plannedStartDate || "", 
  skills: (JobData.skills || []).map((skill: string) =>
    skill.trim().toLowerCase()
  ),
job_description: editorState.getCurrentContent().getPlainText().trim(),
key_responsibilities: KeyState.getCurrentContent().getPlainText().trim(),
technical_skills: SkillState.getCurrentContent().getPlainText().trim(),

};


  try {
    const res = await fetch(`/api/auth/contractjobs/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to update job");
    }

    setSuccess(true);
    setStep(1); // Or navigate to another step/view
    // reset(); // if using react-hook-form
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


    return (
      <div>
      <form
        onSubmit={handleSubmit}
        className="max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-md space-y-6"
      > 
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Edit Job
        </h2>

      <p className="flex items-end">{Step} of {Step}</p>
      {error && (
        <p className="text-red-600 bg-red-100 border border-red-400 p-3 rounded">
          {error}
        </p>
      )}
      {success && (
        <p className="text-green-700 bg-green-100 border border-green-400 p-3 rounded">
          Updated successfully!
        </p>
      )}
   
        {Step ===1 && (
      <div>
            <div className="grid grid-cols-1  gap-6">
              <div>
          <label htmlFor="title" className="block font-medium mb-1 text-gray-700">
            Contract job title <span className="text-red-500">*</span>
          </label>

          <input 
            type="text"  
            name='title'
            value={JobData.title || ''}
            onChange={handleChange}
            className={`w-full rounded-md border px-4 py-2`}
            />
       </div>     
        <div> 
      <label className="block font-medium mb-1 text-gray-700">
        Skills <span className="text-red-500">*</span>
      </label>

      <div className="w-full border border-gray-300 rounded-md px-2 py-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-indigo-500 transition">
        {JobData.skills.map((skill, idx) => (
          <span
            key={idx}
            // value={JobData.skills}
            className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full flex items-center text-sm"
          >
            {skill}
            <button
              onClick={() => removeSkill(idx)}
              className="ml-2 text-indigo-500 hover:text-red-500"
              type="button"
            >
              ×
            </button>
          </span>
        ))}

        <input
          type="text"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type and press enter"
          className="flex-1 border-none focus:outline-none"
        />
      </div>

      <p className="text-sm text-gray-500 mt-1">Press Enter or comma to add skill</p>
      {SkillError && (
        <p className="text-red-500 text-sm mt-1">{SkillError}</p>
      )}
    </div>

      <div className="flex  flex-row gap-6">
      <div className="w-full">
        <label htmlFor="availability" className="block font-medium mb-1 text-gray-700 w-95">
       Availability <span className="text-red-500">*</span>
      </label>
        <select 
        value={JobData.availability}
        name="avalibility"
        onChange={handleChange}
        className={`w-full rounded-md border px-4 py-2`}
      >
          <option value=''>Select Avalibility</option>
          <option value='Immediately'>Immediately</option>
          <option value="In 1 or 2 weeks from now">In 1 or 2 weeks from now</option>
          <option value="In 1 or 2 months from now">In 1 or 2 months from now</option>
          <option value="I am not sure at this point">I am not sure at this point</option>
        </select>


        </div>
  <div className="w-full">
  <label htmlFor="workmode" className="block font-medium mb-1 text-gray-700 w-95">
    Work Mode <span className="text-red-500">*</span>

        <select 
      value={JobData.workmode}
      name="workmode"
      onChange={handleChange}
        className={`w-full rounded-md border px-4 py-2 `}>
        <option value=''>Select WorkMode</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="On-site">On-site</option>
          <option value="Service Provider Agency Location">Service Provider Agency Location</option>
        </select>

        </label>

      </div>


            </div>

                  <div className="flex flex-row">
      {(JobData.workmode === 'Hybrid' || JobData.workmode === 'On-site') && (
        <div className="mt-4 w-full">
          <label htmlFor="joblocation" className="block font-medium mb-1 text-gray-700">
            Job Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="joblocation"
            value={JobData.joblocation}
            onChange={handleChange}
            placeholder="Enter Job Location"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
      </div>
    )}
      </div>

    <div className="flex flex-row gap-6">
      {/* Min Years */}
      <div className="w-full">
        <label className="font-medium mb-1 text-gray-700">
          Experience (From)
        </label>
        <input
          type="number"
          name="experience.minyears"
          onChange={handleChange}
          value={JobData.experience.minyears || ''} 
          className={`w-full rounded-md border px-4 py-2 `}
          placeholder="e.g. 2"
        />      
      </div>

  {/* Max Years */}
      <div className="w-full">
        <label className="font-medium mb-1 text-gray-700">
          Experience (To)
        </label>
        <input
          type="number"
          name="experience.maxyears"
          value={JobData.experience.maxyears}
          onChange={handleChange}
          className={`w-full rounded-md border px-4 py-2`}
          placeholder="e.g. 5"
        />

        </div>
      </div>
      <div>
          <div>
      <label htmlFor="title" className="block font-medium mb-1 text-gray-700">
        Number of people you wish to hire for this job <span className="text-red-500">*</span>
          </label>

        <input
        type="number"
        value={JobData.staff_count}
        onChange={handleChange}
        placeholder="Enter number of resources"
        className={`w-full rounded-md border px-4 py-2 `}
        />
        </div>
        </div>
        <div>
          <label htmlFor="budget" className="block font-medium mb-1 text-gray-700">
            Budget <span className="text-red-500">*</span>
          </label>

          <input 
          type="text"
          name ='budget'
          value={JobData.budget || ''}
          onChange={handleChange}
          className={`w-full rounded-md border px-4 py-2 `}
          />

        </div>


  <label htmlFor="budget" className="block font-medium text-gray-700">
      Is there a planned start date for this job? 
            </label>
      <div className="flex gap-6">
    {/* Yes Radio */}
    
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="workmode"
            value="Yes"
            checked={JobData.workmodes === 'Yes'}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                workmodes: e.target.value,
              }))
        }
        className="h-5 w-5 text-green-500 focus:ring-green-500 border-gray-300"
      />
      <span className="text-gray-700">Yes</span>
    </label>

    {/* No Radio */}
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="workmode"
        value="No"
        checked={JobData.workmodes === 'No'}
        onChange={(e) =>
          setJobData((prev) => ({
            ...prev,
            workmodes: e.target.value,
          }))
        }
        className="h-5 w-5 text-red-500 focus:ring-red-500 border-gray-300"
      />
          <span className="text-gray-700">No</span>
        </label>
      </div>


      {JobData.workmodes === 'Yes' && (
        <div className="mt-4 space-y-4">

      <div>
        <label htmlFor="plannedStartDate" className="block font-medium mb-1 text-gray-700">
          Planned Start Date
        </label>
        <input
          type="date"
          id="plannedStartDate"
          name="plannedStartDate"
            value={
          JobData.plannedStartDate && !isNaN(new Date(JobData.plannedStartDate).getTime())
            ? new Date(JobData.plannedStartDate).toISOString().split('T')[0]
            : ""
        }
          onChange={handleChange}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>
        )}
        </div>
      <div className="flex flex-row  mt-4">
  
        <div className="w-full">
      <label htmlFor="duration"  className="block font-medium mb-1 text-gray-700 w-full">
        Contract Duration <span className="text-red-500">*</span>
      </label>

      <select
      value={JobData.duration} 
      name="duration"
      onChange={handleChange}
      className={`w-full rounded-md border px-4 py-2 `}
      >
      <option value="">-- Select Duration --</option>
        <option value="1 to 3 months">1 to 3 months</option>
        <option value="3 to 6 months">3 to 6 months</option>
        <option value="more than 6 months">More than 6 months</option>
        <option value="not sure at this time">Not sure at this time</option>
      </select>


    </div>
    <div className="w-full">
          <label htmlFor="engagement_type" className="block font-medium mb-1 text-gray-700 w-full">
          Engagement type  <span className="text-red-500">*</span>
          </label>


      <select
      value={JobData.engagement_type}
      name="engagement_type"
      onChange={handleChange}
      className={`w-full rounded-md border px-4 py-2 `}
        >
        <option>Select engagement type</option>
            <option>Full time</option>
            <option>Part time</option>
      </select>
        </div>
      </div>
            
              </div>
            )}

    {Step ===2 && (
    <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
    <label htmlFor="payment_schedule" className="block font-medium mb-1 text-gray-700">
      Payment schedule <span className="text-red-500">*</span>
      </label>
          <select
           value={JobData.payment_schedule}
           onChange={handleChange}
           name="payment_schedule"
            className={`w-full rounded-md border px-4 py-2 `}
          >
            <option value="Daily">Daily</option>
            <option value="Hourly">Hourly</option>
            <option value="Weekly">Weekly</option>
            <option value="Bi-Weekly">Bi-Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
          </select>


        </div>
      
          <div>
          <label htmlFor="currency_type" className="block font-medium mb-1 text-gray-700">
           Currency <span className="text-red-500">*</span>
          </label>

      <select 
        value={JobData.currency_type}  name="currency_type" onChange={handleChange} className={`w-full rounded-md border px-4 py-2 `}>
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
        <label className="block font-medium text-gray-700">Rate <span className="text-red-500">*</span></label>
        <input
        type="number"
        name="rate"
        value={JobData.rate}
        onChange={handleChange}
        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          placeholder="Enter rate"
        />
          </div>   
            </div>
                <div>
              <label htmlFor="timezone" className="block font-medium  text-gray-700">
                Timezone <span className="text-red-500">*</span>
              </label>


        <select value={JobData.timezone} name="timezone" className={`w-full rounded-md border px-4 py-2`} onChange={handleChange}>
        <option >Select time zone</option>
             <option value="(UTC+00:00) Africa/Abidjan">
         (UTC+00:00) Africa/Abidjan</option>  
      <option value="(UTC+00:00) Africa/Accra">
      (UTC+00:00) Africa/Accra</option>
                            <option value="(UTC+03:00) Africa/Addis_Ababa">
      (UTC+03:00) Africa/Addis_Ababa</option>
                            <option value="(UTC+01:00) Africa/Algiers">
      (UTC+01:00) Africa/Algiers</option>
                            <option value="(UTC+03:00) Africa/Asmara">
      (UTC+03:00) Africa/Asmara</option>
                            <option value="(UTC+00:00) Africa/Bamako">
      (UTC+00:00) Africa/Bamako</option>
    <option value="(UTC+5:30)IST Indian Standard Time">
    (UTC+5:30)IST Indian Standard Time</option>

      </select>
      </div>
 
       


  <div className="max-w-8xl mx-auto mt-8">
      <label className="block mb-2 font-semibold">Job Description <span className="text-red-500">*</span></label>
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        toolbar={{
          options: ['inline', 'blockType', 'list', 'link', 'image', 'history'],
          inline: { options: ['bold', 'italic', 'underline', 'strikethrough'] },
          list: { options: ['unordered', 'ordered'] },
          image: {
            urlEnabled: true,
            uploadEnabled: false,
            previewImage: true,
          },
        }}
        wrapperClassName="border rounded"
        editorClassName="min-h-[200px] p-4"
        toolbarClassName="p-2"
        placeholder="Write the job description here..."
      />
    </div>


    <div className="max-w-8xl mx-auto mt-8">
      <label className="block mb-2 font-semibold">Key Responsibilities <span className="text-red-500">*</span></label>
      <Editor
        editorState={KeyState}
        onEditorStateChange={onEditorKeyChange}
        toolbar={{
          options: ['inline', 'blockType', 'list', 'link', 'image', 'history'],
          inline: { options: ['bold', 'italic', 'underline', 'strikethrough'] },
          list: { options: ['unordered', 'ordered'] },
          image: {
            urlEnabled: true,
            uploadEnabled: false,
            previewImage: true,
          },
        }}
        wrapperClassName="border rounded"
        editorClassName="min-h-[200px] p-4"
        toolbarClassName="p-2"
        placeholder="Write the Key Responsibilities here..."
      />
    </div>
      <div className="max-w-8xl mx-auto mt-8">
      <label className="block mb-2 font-semibold">Required Skills:<span className="text-red-500">*</span></label>
      <Editor
        editorState={SkillState}
        onEditorStateChange={onEditorSkillChange}
        toolbar={{
          options: ['inline', 'blockType', 'list', 'link', 'image', 'history'],
          inline: { options: ['bold', 'italic', 'underline', 'strikethrough'] },
          list: { options: ['unordered', 'ordered'] },
          image: {
            urlEnabled: true,
            uploadEnabled: false,
            previewImage: true,
          },
        }}
        wrapperClassName="border rounded"
        editorClassName="min-h-[200px] p-4"
        toolbarClassName="p-2"
        placeholder="Write the Required Skills here..."
      />
        </div>
    </div>
    )}

    <div className="flex justify-between mt-6">
    {Step > 1 && (
      <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Previous
            </button>
      )}

    {Step <= 2  ?(
      <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 ml-auto"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 ml-auto"
            >
              Update Job
            </button>
      )}
      </div>

      </form>
        </div>
        );
      }
