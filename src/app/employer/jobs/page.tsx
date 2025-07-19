"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react"

import { convertFromRaw, convertToRaw, EditorState, } from 'draft-js';

// Dynamically import Editor to avoid SSR issues
const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), {
  ssr: false,
});
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {  useSession } from "next-auth/react";



  interface JobForm {
    technical_skills: any;
    title: string;
    skills: string[];  // explicitly define as string array
    budget: string;
    rate:string
    
    duration: string;
    availability: string;
    timezone: string;
    workmode: string;
    job_description: string;

    working_days:{
      start_day:string;
      end_day:string;
    }
    working_hours:{
      start_time:string
      end_time:string
    }
    job_dates:{
      start_date:Date
      // end_date:string
    }
    engagement_type:string
    currency_type: string;
    payment_schedule:string;
    payment_mode:string
    key_responsibilities: string;
    jobLocation:string
    plannedStartDate:Date
    workmodes :string
    location: {
      city: string;
      state?: string;
      country: string;
    };
    experience: {
    minyears:string,
    maxyears:string
  },postedBy:any
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
    job_description: "",
    currency_type: "",
    key_responsibilities: "",
    payment_schedule: "",
    engagement_type: "",
    jobLocation:'',
    workmodes: '',
    plannedStartDate: new Date(),
    working_hours: {
      start_time: "",
      end_time: ""
    },
    location: {
      city: '',
      state: '',
      country: ''
    },

    job_dates: {
      start_date: new Date()
    },
    payment_mode: "",
    technical_skills: undefined,
    working_days: {
      start_day: "",
      end_day: ""
    },
    experience: {
      minyears: "",
      maxyears: "",
    },
    postedBy: new Object
  };


export default function CreateJobForm() {
    const [form, setForm] = useState<JobForm>(initialFormState);
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [KeyState, setKeyState] = useState(() => EditorState.createEmpty());
 
    const [SkillState, setSkillState] = useState(() => EditorState.createEmpty());

    const [Step,setStep] = useState(1)

    const handleNext = ()=>{
      setStep((prevStep) => prevStep+1)
    }

    const handlePrev = ()=>{
      setStep((prevStep)=> prevStep-1)
    }

  function extractTextsFromEditorState(state: EditorState): string[] {
  const raw = convertToRaw(state.getCurrentContent());
  return raw.blocks.map(block => block.text.trim()).filter(Boolean);
}


    const onEditorStateChange = (state: EditorState) => {
    setEditorState(state);
    const rawContentState = convertToRaw(state.getCurrentContent());
    setForm(prev => ({
      ...prev,
      job_description: JSON.stringify(rawContentState),
    }));
  };

      const onEditorKeyChange = (state: EditorState) => {
    setKeyState(state);
    const rawContentState = convertToRaw(state.getCurrentContent());
    setForm(prev => ({
      ...prev,
      key_responsibilities: JSON.stringify(rawContentState),
    }));
  };

    const onEditorSkillChange = (state: EditorState) => {
    setSkillState(state);
    const rawContentState = convertToRaw(state.getCurrentContent());
    setForm(prev => ({
      ...prev,
      technical_skills: JSON.stringify(rawContentState),
    }));
  };

useEffect(() => {
  let isMounted = true; 

  try {
    if (form.job_description) {
      const contentState = convertFromRaw(JSON.parse(form.job_description));
      if (isMounted) setEditorState(EditorState.createWithContent(contentState));
    }

    if (form.key_responsibilities) {
      const contentState = convertFromRaw(JSON.parse(form.key_responsibilities));
      if (isMounted) setKeyState(EditorState.createWithContent(contentState));
    }

    if (form.technical_skills) {
      const contentState = convertFromRaw(JSON.parse(form.technical_skills));
      if (isMounted) setSkillState(EditorState.createWithContent(contentState));
    }
  } catch (error) {
    console.error("Error parsing editor content:", error);
    if (isMounted) {
      setEditorState(EditorState.createEmpty());
      setKeyState(EditorState.createEmpty());
      setSkillState(EditorState.createEmpty());
    }
  }

  return () => {
    // Cleanup on unmount
    isMounted = false;
  };
}, [form.job_description, form.key_responsibilities, form.technical_skills]); 


const [input, setInput] = useState("");

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if ((e.key === "Enter" || e.key === ",") && input.trim()) {
    e.preventDefault();
    const newSkill = input.trim();
    if (!form.skills.includes(newSkill)) {
      setForm(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
    }
    setInput("");
  }
};

const removeSkill = (index: number) => {
  const updated = [...form.skills];
  updated.splice(index, 1);
  setForm(prev => ({ ...prev, skills: updated }));
};

  // const [value, setValue] = useState('');
  const [, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  const keys = name.split(".");

  if (keys.length === 2) {
    const isDateField = name === "job_dates.start_date" || 'plannedStartDate';
    setForm(prev => ({
      ...prev,
      [keys[0]]: {
        ...prev[keys[0] as keyof typeof prev],
        [keys[1]]: isDateField ? new Date(value) : value
      }
    }));
  } else {
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  }
};



const {data: session} = useSession();
const userId = session?.user.id
console.log(userId,"userId");



  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

const requiredFields = [
  { path: "title", value: form.title },
  { path: "job_description", value: form.job_description },
  { path: "location.city", value: form.location?.city },
  { path: "location.country", value: form.location?.country },
  { path: "plannedStartDate", value: form.plannedStartDate },
  { path: "working_hours.start_time", value: form.working_hours?.start_time },
  { path: "working_hours.end_time", value: form.working_hours?.end_time },
  { path: "working_days.start_day", value: form.working_days?.start_day },
  { path: "working_days.end_day", value: form.working_days?.end_day },
  { path: "experience.minyears", value: form.experience?.minyears },
  { path: "experience.maxyears", value: form.experience?.maxyears },
  { path: "duration", value: form.duration },
  { path: "rate", value: form.rate },
  { path: "currency_type", value: form.currency_type },
  { path: "payment_mode", value: form.payment_mode },
  { path: "payment_schedule", value: form.payment_schedule },
  { path: "engagement_type", value: form.engagement_type },
  { path: "workmode", value: form.workmode },
  { path: "timezone", value: form.timezone },
  { path: "availability", value: form.availability },
];

const missingFields = requiredFields
  .filter(field => !field.value)
  .map(field => `\${${field.path}}`);

if (missingFields.length > 0) {
  alert(`Please fill the following required fields:\n${missingFields.join("\n")}`);
  return;
}



const payload = {
  title: form.title,
  skills: form.skills,
  budget: form.budget,
  rate:form.rate,
  duration: form.duration,
  availability: form.availability,
  timezone: form.timezone,
  workmode: form.workmode,
  currency_type: form.currency_type,
  engagement_type: form.engagement_type,
  payment_schedule: form.payment_schedule,
  payment_mode: form.payment_mode,
  job_description: extractTextsFromEditorState(editorState).join('\n'), // still raw JSON string
  key_responsibilities: extractTextsFromEditorState(KeyState),
  technical_skills: extractTextsFromEditorState(SkillState),
  experience: {
    minyears: parseInt(form.experience.minyears || "0"),
    maxyears: parseInt(form.experience.maxyears || "0"),
  },
  working_days: {
    start_day: form.working_days.start_day,
    end_day: form.working_days.end_day,
  },
  working_hours: {
    start_time: form.working_hours.start_time,
    end_time: form.working_hours.end_time,
  },
  // job_dates: {
  //   start_date: form.job_dates.start_date ? new Date(form.job_dates.start_date) : null,
  // },
   plannedStartDate: {
    plannedStartDate: form.plannedStartDate ? new Date(form.plannedStartDate) : null,
  },
  location: {
    city: form.location.city,
    state: form.location.state,
    country: form.location.country,
  },
};


    try {
      const res = await fetch("/api/auth/contractjobs/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({payload,postedBy: session?.user?.id}),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create job");
      }

      setSuccess(true);
      setForm(initialFormState);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>

  
    <form
      onSubmit={handleSubmit}
      className="max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-md space-y-6"
    >
      
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
       Post a Job to Hire Talent on Contract
      </h2>

<p className="flex items-end">Steps {Step} of {Step}</p>
      {error && (
        <p className="text-red-600 bg-red-100 border border-red-400 p-3 rounded">
          {error}
        </p>
      )}
      {success && (
        <p className="text-green-700 bg-green-100 border border-green-400 p-3 rounded">
          Job posted successfully!
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
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Senior React Developer"
            required
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
      <label className="block font-medium mb-1 text-gray-700">
        Skills <span className="text-red-500">*</span>
      </label>

      <div className="w-full border border-gray-300 rounded-md px-2 py-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-indigo-500 transition">
        {form.skills.map((skill, idx) => (
          <span
            key={idx}
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
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type and press enter"
          className="flex-1 border-none focus:outline-none"
        />
      </div>

      <p className="text-sm text-gray-500 mt-1">Press Enter or comma to add skill</p>
    </div>

          <div className="flex flex-row gap-4 ">
              <div className="w-full">
        <label htmlFor="availability" className="block font-medium mb-1 text-gray-700 w-95">
       Availability <span className="text-red-500">*</span>
      </label>
      <select
      name="availability"
      value={form.availability}
      onChange={handleChange}
      className="w-full rounded-md border px-4 py-2"
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
  </label>
  <select
    id="workmode"
    name="workmode"
    value={form.workmode}
    onChange={handleChange}
    required
    className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
  >
    <option value=''>Select WorkMode</option>
    <option value="Remote">Remote</option>
     <option value="Hybrid">Hybrid</option>
    <option value="On-site">On-site</option>
    <option value="Service Provider Agency Location">Service Provider Agency Location</option>
  </select>
</div>

{/* Conditionally show Job Location */}
{(form.workmode === 'Hybrid' || form.workmode === 'On-site') && (
  <div className="mt-4 w-full">
    <label htmlFor="jobLocation" className="block font-medium mb-1 text-gray-700">
      Job Location <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      id="jobLocation"
      name="jobLocation"
      value={form.jobLocation || ""}
      onChange={handleChange}
      placeholder="Enter Job Location"
      required
      className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
    />
  </div>
)}
        </div>
        
<div className="flex flex-row gap-6">
    
  <div className="w-full">

       <label className="font-medium mb-1 text-gray-700">
      Experience (From)
    </label>
    <input
      type="number"
      name="experience.minyears"
      value={form.experience.minyears}
      onChange={handleChange}
      className="w-full rounded-md border border-gray-300 px-4 py-2"
      placeholder="e.g. 2"
    />
  </div>

  <div className="w-full"> 
    <label className="font-medium mb-1 text-gray-700">
      Experience (To)
    </label>
    <input
      type="number"
      name="experience.maxyears"
      value={form.experience.maxyears}
      onChange={handleChange}
      className="w-full rounded-md border border-gray-300 px-4 py-2"
      placeholder="e.g. 6"
    />
  </div>
</div>

      <div>
          
         <div>
         <label htmlFor="title" className="block font-medium mb-1 text-gray-700">
           Number of people you wish to hire for this job <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter number of resources"
            required
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        </div>




        <div>
          <label htmlFor="budget" className="block font-medium mb-1 text-gray-700">
            Budget <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="budget"
            name="budget"
            value={form.budget}
            onChange={handleChange}
            placeholder="e.g. $1000 - $2000"
            required
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
 <label htmlFor="budget" className="block font-medium text-gray-700">
    Is there a planned start date for this job? <span className="text-red-500">*</span>
          </label>
<div className="flex gap-6">
  {/* Yes Radio */}
  
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="radio"
      name="workmode"
      value="Yes"
      checked={form.workmodes === 'Yes'}
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
      checked={form.workmodes === 'No'}
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          workmodes: e.target.value,
        }))
      }
      className="h-5 w-5 text-red-500 focus:ring-red-500 border-gray-300"
    />
    <span className="text-gray-700">No</span>
  </label>
</div>


{form.workmodes === 'Yes' && (
  <div className="mt-4 space-y-4">

    <div>
      <label htmlFor="plannedStartDate" className="block font-medium mb-1 text-gray-700">
        Planned Start Date <span className="text-red-500">*</span>
      </label>
      <input
        type="date"
        id="plannedStartDate"
         name="plannedStartDate"
      value={form.plannedStartDate ? form.plannedStartDate.toISOString().split('T')[0] : ""}
        onChange={handleChange}
        required
        className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />
    </div>
  </div>
)}


           {/* <div>
          <label htmlFor="budget" className="block font-medium mb-1 text-gray-700">
            payment_Mode <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="payment_mode"
            name="payment_mode"
            value={form.payment_mode}
            onChange={handleChange}
            placeholder="e.g. Gpay"
            required
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div> */}

{/* <div className="grid grid-cols-2 gap-4">
  <div>
  <label className="block font-medium mb-1">Start Working Day</label>
  <select
    name="working_days.start_day"
    value={form.working_days.start_day}
    onChange={handleChange}
    className="w-full rounded-md border px-4 py-2"
  >
    <option value="" disabled>Select Day</option>
    <option value="Monday">Monday</option>
    <option value="Tuesday">Tuesday</option>
    <option value="Wednesday">Wednesday</option>
    <option value="Thursday">Thursday</option>
    <option value="Friday">Friday</option>
    <option value="Saturday">Saturday</option>
    <option value="Sunday">Sunday</option>
  </select>
</div>

  <div>
    <label className="block font-medium mb-1">End Working Day</label>
    <select
      name="working_days.end_day"
      value={form.working_days.end_day}
      onChange={handleChange}
      className="w-full rounded-md border px-4 py-2"
    >
       <option value='Monday'>Monday</option>
      <option value='Tuesday'>Tuesday</option>
      <option value='Wednesday'> Wednesday</option>
      <option value='Thursday'>Thursday</option>
      <option value='Friday'>Friday</option>
      <option value='Saturday'>Saturday</option>
      <option value='Sunday'>Sunday</option>
    </select>
  </div>
</div> */}


{/* <div className="grid grid-cols-2 gap-4">
  <div>
    <label className="block font-medium mb-1">Work Start Time</label>
    <input
      type="time"
      name="working_hours.start_time"
      value={form.working_hours.start_time}
      onChange={handleChange}
      className="w-full rounded-md border px-4 py-2"
    />
  </div>
  <div>
    <label className="block font-medium mb-1">Work End Time</label>
    <input
    
      type="time"
      name="working_hours.end_time"
      value={form.working_hours.end_time}
      onChange={handleChange}
      className="w-full rounded-md border px-4 py-2"
    />
  </div>
</div> */}

</div>
<div className="flex flex-row mt-4">
  
    <div className="w-full">
  <label htmlFor="duration" className="block font-medium mb-1 text-gray-700 w-full">
    Contract Duration <span className="text-red-500">*</span>
  </label>
  <select
    id="duration"
    name="duration"
    value={form.duration}
    onChange={handleChange}
    className="rounded-md border border-gray-300 px-4 py-2 w-90"
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
      name="engagement_type"
      value={form.engagement_type}
      onChange={handleChange}
      className="w-full rounded-md border px-4 py-2"
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
            id="payment_schedule"
            name="payment_schedule"
            value={form.payment_schedule}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
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
         
            id="currency_type"
            name="currency_type"
            value={form.currency_type}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
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
          <label
            htmlFor="Rate"
            className="block font-medium mb-1 text-gray-700"
          >
            Rate <span className="text-red-500">*</span>
          </label>
          <input
            id="rate"
            name="rate"
            value={form.rate}
            onChange={handleChange}
            placeholder="Rate"
            required
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        </div>
             <div>
          <label htmlFor="timezone" className="block font-medium  text-gray-700">
            Timezone <span className="text-red-500">*</span>
          </label>
          <select name="timezone" onChange={handleChange} value={form.timezone} className="px-0 mt-1 py-2 rounded border border-gray-400 w-full">
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
 
       


  <div className="max-w-4xl mx-auto mt-8">
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


  <div className="max-w-4xl mx-auto mt-8">
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
      <div className="max-w-4xl mx-auto mt-8">
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
    
   

      <h3 className="text-lg font-semibold mt-8 mb-4 text-gray-800">
        Location Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label
            htmlFor="location.city"
            className="block font-medium mb-1 text-gray-700"
          >
            City <span className="text-red-500">*</span>
          </label>
          <input
          type="text"
            id="location.city"
            name="location.city"
            value={form.location.city}
            onChange={handleChange}
            placeholder="City"
            required
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label
            htmlFor="location.state"
            className="block font-medium mb-1 text-gray-700"
          >
            State
          </label>
          <input
          type="text"
            id="location.state"
            name="location.state"
            value={form.location.state}
            onChange={handleChange}
            placeholder="State"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label
            htmlFor="location.country"
            className="block font-medium mb-1 text-gray-700"
          >
            Country <span className="text-red-500">*</span>
          </label>
          <input
          type="text"
            id="location.country"
            name="location.country"
            value={form.location.country}
            onChange={handleChange}
            placeholder="Country"
            required
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
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

{Step < 2  ?(
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
              Post Job
            </button>
)}
</div>

    </form>
      </div>
  );
}
