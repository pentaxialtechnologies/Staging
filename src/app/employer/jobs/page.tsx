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
      start_date: new Date("2025-06-06")
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
    const isDateField = name === "job_dates.start_date";
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
  { path: "job_dates.start_date", value: form.job_dates?.start_date },
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
  job_dates: {
    start_date: form.job_dates.start_date ? new Date(form.job_dates.start_date) : null,
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
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
       Post a Job to Hire Talent on Contract
      </h2>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

           <div>
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
        </div>

       <div>
  <label htmlFor="duration" className="block font-medium mb-1 text-gray-700">
    Contract Duration <span className="text-red-500">*</span>
  </label>
  <select
    id="duration"
    name="duration"
    value={form.duration}
    onChange={handleChange}
    className="w-full rounded-md border border-gray-300 px-4 py-2"
  >
    <option value="">-- Select Duration --</option>
    <option value="1 to 3 months">1 to 3 months</option>
    <option value="3 to 6 months">3 to 6 months</option>
    <option value="more than 6 months">More than 6 months</option>
    <option value="not sure at this time">Not sure at this time</option>
  </select>
</div>

      
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>
    <label className="block font-medium mb-1 text-gray-700">
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

  <div>
    <label className="block font-medium mb-1 text-gray-700">
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

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>
    <label className="block font-medium mb-1 text-gray-700">
      Job Start Date
    </label>
    <input
      type="date"
      name="job_dates.start_date"
      value={form.job_dates.start_date ? form.job_dates.start_date.toISOString().split('T')[0] : ""}
      onChange={handleChange}
      className="w-full rounded-md border border-gray-300 px-4 py-2"
    />
  </div>

  {/* <div>
    <label className="block font-medium mb-1 text-gray-700">
      Job End Date
    </label>
    <input
      type="date"
      name="end_date"
      value={form.job_dates.end_date}
      onChange={handleChange}
      className="w-full rounded-md border border-gray-300 px-4 py-2"
    />
  </div> */}
</div>

<div className="grid grid-cols-2 gap-4">
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
</div>


<div className="grid grid-cols-2 gap-4">
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
</div>


        <div>
        <label htmlFor="availability" className="block font-medium mb-1 text-gray-700">
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

          <div>
        <label htmlFor="engagement_type" className="block font-medium mb-1 text-gray-700">
       Employment Type  <span className="text-red-500">*</span>
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



        <div className="max-w-md mx-auto">
          <label htmlFor="timezone" className="font-medium  text-gray-700">
            Timezone <span className="text-red-500">*</span>
          </label>
          <select name="timezone" onChange={handleChange} value={form.timezone} className="max-w-md mx-auto px-0 mt-1 py-2 rounded border border-gray-400">
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
                            <option value="(UTC+01:00) Africa/Bangui">
      (UTC+01:00) Africa/Bangui</option>
                            <option value="(UTC+00:00) Africa/Banjul">
      (UTC+00:00) Africa/Banjul</option>
                            <option value="(UTC+00:00) Africa/Bissau">
      (UTC+00:00) Africa/Bissau</option>
                            <option value="(UTC+02:00) Africa/Blantyre">
      (UTC+02:00) Africa/Blantyre</option>
                            <option value="(UTC+01:00) Africa/Brazzaville">
      (UTC+01:00) Africa/Brazzaville</option>
                            <option value="(UTC+02:00) Africa/Bujumbura">
      (UTC+02:00) Africa/Bujumbura</option>
                            <option value="(UTC+02:00) Africa/Cairo">
      (UTC+02:00) Africa/Cairo</option>
                            <option value="(UTC+00:00) Africa/Casablanca">
      (UTC+00:00) Africa/Casablanca</option>
                            <option value="(UTC+01:00) Africa/Ceuta">
      (UTC+01:00) Africa/Ceuta</option>
                            <option value="(UTC+00:00) Africa/Conakry">
      (UTC+00:00) Africa/Conakry</option>
                            <option value="(UTC+00:00) Africa/Dakar">
      (UTC+00:00) Africa/Dakar</option>
                            <option value="(UTC+03:00) Africa/Dar_es_Salaam">
      (UTC+03:00) Africa/Dar_es_Salaam</option>
                            <option value="(UTC+03:00) Africa/Djibouti">
      (UTC+03:00) Africa/Djibouti</option>
                            <option value="(UTC+01:00) Africa/Douala">
      (UTC+01:00) Africa/Douala</option>
                            <option value="(UTC+00:00) Africa/El_Aaiun">
      (UTC+00:00) Africa/El_Aaiun</option>
                            <option value="(UTC+00:00) Africa/Freetown">
      (UTC+00:00) Africa/Freetown</option>
                            <option value="(UTC+02:00) Africa/Gaborone">
      (UTC+02:00) Africa/Gaborone</option>
                            <option value="(UTC+02:00) Africa/Harare">
      (UTC+02:00) Africa/Harare</option>
                            <option value="(UTC+02:00) Africa/Johannesburg">
      (UTC+02:00) Africa/Johannesburg</option>
                            <option value="(UTC+03:00) Africa/Juba">
      (UTC+03:00) Africa/Juba</option>
                            <option value="(UTC+03:00) Africa/Kampala">
      (UTC+03:00) Africa/Kampala</option>
                            <option value="(UTC+02:00) Africa/Khartoum">
      (UTC+02:00) Africa/Khartoum</option>
                            <option value="(UTC+02:00) Africa/Kigali">
      (UTC+02:00) Africa/Kigali</option>
                            <option value="(UTC+01:00) Africa/Kinshasa">
      (UTC+01:00) Africa/Kinshasa</option>
                            <option value="(UTC+01:00) Africa/Lagos">
      (UTC+01:00) Africa/Lagos</option>
                            <option value="(UTC+01:00) Africa/Libreville">
      (UTC+01:00) Africa/Libreville</option>
                            <option value="(UTC+00:00) Africa/Lome">
      (UTC+00:00) Africa/Lome</option>
                            <option value="(UTC+01:00) Africa/Luanda">
      (UTC+01:00) Africa/Luanda</option>
                            <option value="(UTC+02:00) Africa/Lubumbashi">
      (UTC+02:00) Africa/Lubumbashi</option>
                            <option value="(UTC+02:00) Africa/Lusaka">
      (UTC+02:00) Africa/Lusaka</option>
                            <option value="(UTC+01:00) Africa/Malabo">
      (UTC+01:00) Africa/Malabo</option>
                            <option value="(UTC+02:00) Africa/Maputo">
      (UTC+02:00) Africa/Maputo</option>
                            <option value="(UTC+02:00) Africa/Maseru">
      (UTC+02:00) Africa/Maseru</option>
                            <option value="(UTC+02:00) Africa/Mbabane">
      (UTC+02:00) Africa/Mbabane</option>
                            <option value="(UTC+03:00) Africa/Mogadishu">
      (UTC+03:00) Africa/Mogadishu</option>
                            <option value="(UTC+00:00) Africa/Monrovia">
      (UTC+00:00) Africa/Monrovia</option>
                            <option value="(UTC+03:00) Africa/Nairobi">
      (UTC+03:00) Africa/Nairobi</option>
                            <option value="(UTC+01:00) Africa/Ndjamena">
      (UTC+01:00) Africa/Ndjamena</option>
                            <option value="(UTC+01:00) Africa/Niamey">
      (UTC+01:00) Africa/Niamey</option>
                            <option value="(UTC+00:00) Africa/Nouakchott">
      (UTC+00:00) Africa/Nouakchott</option>
                            <option value="(UTC+00:00) Africa/Ouagadougou">
      (UTC+00:00) Africa/Ouagadougou</option>
                            <option value="(UTC+01:00) Africa/Porto-Novo">
      (UTC+01:00) Africa/Porto-Novo</option>
                            <option value="(UTC+00:00) Africa/Sao_Tome">
      (UTC+00:00) Africa/Sao_Tome</option>
                            <option value="(UTC+02:00) Africa/Tripoli">
      (UTC+02:00) Africa/Tripoli</option>
                            <option value="(UTC+01:00) Africa/Tunis">
      (UTC+01:00) Africa/Tunis</option>
                            <option value="(UTC+02:00) Africa/Windhoek">
      (UTC+02:00) Africa/Windhoek</option>
                            <option value="(UTC-10:00) America/Adak">
      (UTC-10:00) America/Adak</option>
                            <option value="(UTC-09:00) America/Anchorage">
      (UTC-09:00) America/Anchorage</option>
                            <option value="(UTC-04:00) America/Anguilla">
      (UTC-04:00) America/Anguilla</option>
                            <option value="(UTC-04:00) America/Antigua">
      (UTC-04:00) America/Antigua</option>
                            <option value="(UTC-03:00) America/Araguaina">
      (UTC-03:00) America/Araguaina</option>
                            <option value="(UTC-03:00) America/Argentina/Buenos_Aires">
      (UTC-03:00) America/Argentina/Buenos_Aires</option>
                            <option value="(UTC-03:00) America/Argentina/Catamarca">
      (UTC-03:00) America/Argentina/Catamarca</option>
                            <option value="(UTC-03:00) America/Argentina/Cordoba">
      (UTC-03:00) America/Argentina/Cordoba</option>
                            <option value="(UTC-03:00) America/Argentina/Jujuy">
      (UTC-03:00) America/Argentina/Jujuy</option>
                            <option value="(UTC-03:00) America/Argentina/La_Rioja">
      (UTC-03:00) America/Argentina/La_Rioja</option>
                            <option value="(UTC-03:00) America/Argentina/Mendoza">
    (UTC-03:00) America/Argentina/Mendoza</option>
                            <option value="(UTC-03:00) America/Argentina/Rio_Gallegos">
      (UTC-03:00) America/Argentina/Rio_Gallegos</option>
                            <option value="(UTC-03:00) America/Argentina/Salta">
      (UTC-03:00) America/Argentina/Salta</option>
                            <option value="(UTC-03:00) America/Argentina/San_Juan">
      (UTC-03:00) America/Argentina/San_Juan</option>
                            <option value="(UTC-03:00) America/Argentina/San_Luis">
      (UTC-03:00) America/Argentina/San_Luis</option>
                            <option value="(UTC-03:00) America/Argentina/Tucuman">
      (UTC-03:00) America/Argentina/Tucuman</option>
                            <option value="(UTC-03:00) America/Argentina/Ushuaia">
      (UTC-03:00) America/Argentina/Ushuaia</option>
                            <option value="(UTC-04:00) America/Aruba">
      (UTC-04:00) America/Aruba</option>
                            <option value="(UTC-04:00) America/Asuncion">
      (UTC-04:00) America/Asuncion</option>
                            <option value="(UTC-05:00) America/Atikokan">
      (UTC-05:00) America/Atikokan</option>
                                          <option value="(UTC-03:00) America/Bahia">
          (UTC-03:00) America/Bahia</option>
                                          <option value="(UTC-06:00) America/Bahia_Banderas">
          (UTC-06:00) America/Bahia_Banderas</option>
                                          <option value="(UTC-04:00) America/Barbados">
          (UTC-04:00) America/Barbados</option>
                                          <option value="(UTC-03:00) America/Belem">
          (UTC-03:00) America/Belem</option>
                                          <option value="(UTC-06:00) America/Belize">
          (UTC-06:00) America/Belize</option>
                                          <option value="(UTC-04:00) America/Blanc-Sablon">
          (UTC-04:00) America/Blanc-Sablon</option>
                                          <option value="(UTC-04:00) America/Boa_Vista">
          (UTC-04:00) America/Boa_Vista</option>
                                          <option value="(UTC-05:00) America/Bogota">
          (UTC-05:00) America/Bogota</option>
                                          <option value="(UTC-07:00) America/Boise">
          (UTC-07:00) America/Boise</option>
                                          <option value="(UTC-07:00) America/Cambridge_Bay">
          (UTC-07:00) America/Cambridge_Bay</option>
                                          <option value="(UTC-04:00) America/Campo_Grande">
          (UTC-04:00) America/Campo_Grande</option>
                                          <option value="(UTC-05:00) America/Cancun">
          (UTC-05:00) America/Cancun</option>
                                          <option value="(UTC-04:00) America/Caracas">
          (UTC-04:00) America/Caracas</option>
                                          <option value="(UTC-03:00) America/Cayenne">
          (UTC-03:00) America/Cayenne</option>
                                          <option value="(UTC-05:00) America/Cayman">
          (UTC-05:00) America/Cayman</option>
                                          <option value="(UTC-06:00) America/Chicago">
          (UTC-06:00) America/Chicago</option>
                                          <option value="(UTC-07:00) America/Chihuahua">
          (UTC-07:00) America/Chihuahua</option>
                                          <option value="(UTC-06:00) America/Costa_Rica">
          (UTC-06:00) America/Costa_Rica</option>
                                          <option value="(UTC-07:00) America/Creston">
          (UTC-07:00) America/Creston</option>
                                          <option value="(UTC-04:00) America/Cuiaba">
          (UTC-04:00) America/Cuiaba</option>
                                          <option value="(UTC-04:00) America/Curacao">
          (UTC-04:00) America/Curacao</option>
                                          <option value="(UTC+00:00) America/Danmarkshavn">
          (UTC+00:00) America/Danmarkshavn</option>
                                          <option value="(UTC-07:00) America/Dawson">
          (UTC-07:00) America/Dawson</option>
                                          <option value="(UTC-07:00) America/Dawson_Creek">
          (UTC-07:00) America/Dawson_Creek</option>
                                          <option value="(UTC-07:00) America/Denver">
          (UTC-07:00) America/Denver</option>
                                          <option value="(UTC-05:00) America/Detroit">
          (UTC-05:00) America/Detroit</option>
                                          <option value="(UTC-04:00) America/Dominica">
          (UTC-04:00) America/Dominica</option>
                                          <option value="(UTC-07:00) America/Edmonton">
          (UTC-07:00) America/Edmonton</option>
                                          <option value="(UTC-05:00) America/Eirunepe">
          (UTC-05:00) America/Eirunepe</option>
                                          <option value="(UTC-06:00) America/El_Salvador">
          (UTC-06:00) America/El_Salvador</option>
                                          <option value="(UTC-07:00) America/Fort_Nelson">
          (UTC-07:00) America/Fort_Nelson</option>
                                          <option value="(UTC-03:00) America/Fortaleza">
          (UTC-03:00) America/Fortaleza</option>
                                          <option value="(UTC-04:00) America/Glace_Bay">
          (UTC-04:00) America/Glace_Bay</option>
                                          <option value="(UTC-03:00) America/Godthab">
          (UTC-03:00) America/Godthab</option>
                                          <option value="(UTC-04:00) America/Goose_Bay">
          (UTC-04:00) America/Goose_Bay</option>
                                          <option value="(UTC-05:00) America/Grand_Turk">
          (UTC-05:00) America/Grand_Turk</option>
                                          <option value="(UTC-04:00) America/Grenada">
          (UTC-04:00) America/Grenada</option>
                                          <option value="(UTC-04:00) America/Guadeloupe">
          (UTC-04:00) America/Guadeloupe</option>
                                          <option value="(UTC-06:00) America/Guatemala">
          (UTC-06:00) America/Guatemala</option>
                                          <option value="(UTC-05:00) America/Guayaquil">
          (UTC-05:00) America/Guayaquil</option>
                                          <option value="(UTC-04:00) America/Guyana">
          (UTC-04:00) America/Guyana</option>
                                          <option value="(UTC-04:00) America/Halifax">
          (UTC-04:00) America/Halifax</option>
                                          <option value="(UTC-05:00) America/Havana">
          (UTC-05:00) America/Havana</option>
                                          <option value="(UTC-07:00) America/Hermosillo">
          (UTC-07:00) America/Hermosillo</option>
                                          <option value="(UTC-05:00) America/Indiana/Indianapolis">
          (UTC-05:00) America/Indiana/Indianapolis</option>
                                          <option value="(UTC-06:00) America/Indiana/Knox">
          (UTC-06:00) America/Indiana/Knox</option>
                                          <option value="(UTC-05:00) America/Indiana/Marengo">
          (UTC-05:00) America/Indiana/Marengo</option>
                                          <option value="(UTC-05:00) America/Indiana/Petersburg">
          (UTC-05:00) America/Indiana/Petersburg</option>
                                          <option value="(UTC-06:00) America/Indiana/Tell_City">
          (UTC-06:00) America/Indiana/Tell_City</option>
                                          <option value="(UTC-05:00) America/Indiana/Vevay">
          (UTC-05:00) America/Indiana/Vevay</option>
                                          <option value="(UTC-05:00) America/Indiana/Vincennes">
          (UTC-05:00) America/Indiana/Vincennes</option>
                                          <option value="(UTC-05:00) America/Indiana/Winamac">
          (UTC-05:00) America/Indiana/Winamac</option>
                                          <option value="(UTC-07:00) America/Inuvik">
          (UTC-07:00) America/Inuvik</option>
                                          <option value="(UTC-05:00) America/Iqaluit">
          (UTC-05:00) America/Iqaluit</option>
                                          <option value="(UTC-05:00) America/Jamaica">
          (UTC-05:00) America/Jamaica</option>
                                          <option value="(UTC-09:00) America/Juneau">
          (UTC-09:00) America/Juneau</option>
                                          <option value="(UTC-05:00) America/Kentucky/Louisville">
          (UTC-05:00) America/Kentucky/Louisville</option>
                                          <option value="(UTC-05:00) America/Kentucky/Monticello">
          (UTC-05:00) America/Kentucky/Monticello</option>
                                          <option value="(UTC-04:00) America/Kralendijk">
          (UTC-04:00) America/Kralendijk</option>
                                          <option value="(UTC-04:00) America/La_Paz">
          (UTC-04:00) America/La_Paz</option>
                                          <option value="(UTC-05:00) America/Lima">
          (UTC-05:00) America/Lima</option>
                                          <option value="(UTC-08:00) America/Los_Angeles">
          (UTC-08:00) America/Los_Angeles</option>
                                          <option value="(UTC-04:00) America/Lower_Princes">
          (UTC-04:00) America/Lower_Princes</option>
                                          <option value="(UTC-03:00) America/Maceio">
          (UTC-03:00) America/Maceio</option>
                                          <option value="(UTC-06:00) America/Managua">
          (UTC-06:00) America/Managua</option>
                                          <option value="(UTC-04:00) America/Manaus">
          (UTC-04:00) America/Manaus</option>
                                          <option value="(UTC-04:00) America/Marigot">
          (UTC-04:00) America/Marigot</option>
                                          <option value="(UTC-04:00) America/Martinique">
          (UTC-04:00) America/Martinique</option>
                                          <option value="(UTC-06:00) America/Matamoros">
          (UTC-06:00) America/Matamoros</option>
                                          <option value="(UTC-07:00) America/Mazatlan">
          (UTC-07:00) America/Mazatlan</option>
                                          <option value="(UTC-06:00) America/Menominee">
          (UTC-06:00) America/Menominee</option>
                                          <option value="(UTC-06:00) America/Merida">
          (UTC-06:00) America/Merida</option>
                                          <option value="(UTC-09:00) America/Metlakatla">
          (UTC-09:00) America/Metlakatla</option>
                                          <option value="(UTC-06:00) America/Mexico_City">
          (UTC-06:00) America/Mexico_City</option>
                                          <option value="(UTC-03:00) America/Miquelon">
          (UTC-03:00) America/Miquelon</option>
                                          <option value="(UTC-04:00) America/Moncton">
          (UTC-04:00) America/Moncton</option>
                                          <option value="(UTC-06:00) America/Monterrey">
          (UTC-06:00) America/Monterrey</option>
                                          <option value="(UTC-03:00) America/Montevideo">
          (UTC-03:00) America/Montevideo</option>
                                          <option value="(UTC-04:00) America/Montserrat">
          (UTC-04:00) America/Montserrat</option>
                                          <option value="(UTC-05:00) America/Nassau">
          (UTC-05:00) America/Nassau</option>
                                          <option value="(UTC-05:00) America/New_York">
          (UTC-05:00) America/New_York</option>
                                          <option value="(UTC-05:00) America/Nipigon">
          (UTC-05:00) America/Nipigon</option>
                                          <option value="(UTC-09:00) America/Nome">
          (UTC-09:00) America/Nome</option>
                                          <option value="(UTC-02:00) America/Noronha">
          (UTC-02:00) America/Noronha</option>
                                          <option value="(UTC-06:00) America/North_Dakota/Beulah">
          (UTC-06:00) America/North_Dakota/Beulah</option>
                                          <option value="(UTC-06:00) America/North_Dakota/Center">
          (UTC-06:00) America/North_Dakota/Center</option>
                                          <option value="(UTC-06:00) America/North_Dakota/New_Salem">
          (UTC-06:00) America/North_Dakota/New_Salem</option>
                                          <option value="(UTC-07:00) America/Ojinaga">
          (UTC-07:00) America/Ojinaga</option>
                                          <option value="(UTC-05:00) America/Panama">
          (UTC-05:00) America/Panama</option>
                                          <option value="(UTC-05:00) America/Pangnirtung">
          (UTC-05:00) America/Pangnirtung</option>
                                          <option value="(UTC-03:00) America/Paramaribo">
          (UTC-03:00) America/Paramaribo</option>
                                          <option value="(UTC-07:00) America/Phoenix">
          (UTC-07:00) America/Phoenix</option>
                                          <option value="(UTC-05:00) America/Port-au-Prince">
          (UTC-05:00) America/Port-au-Prince</option>
                                          <option value="(UTC-04:00) America/Port_of_Spain">
          (UTC-04:00) America/Port_of_Spain</option>
                                          <option value="(UTC-04:00) America/Porto_Velho">
          (UTC-04:00) America/Porto_Velho</option>
                                          <option value="(UTC-04:00) America/Puerto_Rico">
          (UTC-04:00) America/Puerto_Rico</option>
                                          <option value="(UTC-03:00) America/Punta_Arenas">
          (UTC-03:00) America/Punta_Arenas</option>
                                          <option value="(UTC-06:00) America/Rainy_River">
          (UTC-06:00) America/Rainy_River</option>
                                          <option value="(UTC-06:00) America/Rankin_Inlet">
          (UTC-06:00) America/Rankin_Inlet</option>
                                          <option value="(UTC-03:00) America/Recife">
          (UTC-03:00) America/Recife</option>
                                          <option value="(UTC-06:00) America/Regina">
          (UTC-06:00) America/Regina</option>
                                          <option value="(UTC-06:00) America/Resolute">
          (UTC-06:00) America/Resolute</option>
                                          <option value="(UTC-05:00) America/Rio_Branco">
          (UTC-05:00) America/Rio_Branco</option>
                                          <option value="(UTC-03:00) America/Santarem">
          (UTC-03:00) America/Santarem</option>
                                          <option value="(UTC-03:00) America/Santiago">
          (UTC-03:00) America/Santiago</option>
                                          <option value="(UTC-04:00) America/Santo_Domingo">
          (UTC-04:00) America/Santo_Domingo</option>
                                          <option value="(UTC-03:00) America/Sao_Paulo">
          (UTC-03:00) America/Sao_Paulo</option>
                                          <option value="(UTC-01:00) America/Scoresbysund">
          (UTC-01:00) America/Scoresbysund</option>
                                          <option value="(UTC-09:00) America/Sitka">
          (UTC-09:00) America/Sitka</option>
                                          <option value="(UTC-04:00) America/St_Barthelemy">
          (UTC-04:00) America/St_Barthelemy</option>
                                          <option value="(UTC-03:30) America/St_Johns">
          (UTC-03:30) America/St_Johns</option>
                                          <option value="(UTC-04:00) America/St_Kitts">
          (UTC-04:00) America/St_Kitts</option>
                                          <option value="(UTC-04:00) America/St_Lucia">
          (UTC-04:00) America/St_Lucia</option>
                                          <option value="(UTC-04:00) America/St_Thomas">
          (UTC-04:00) America/St_Thomas</option>
                                          <option value="(UTC-04:00) America/St_Vincent">
          (UTC-04:00) America/St_Vincent</option>
                                          <option value="(UTC-06:00) America/Swift_Current">
          (UTC-06:00) America/Swift_Current</option>
                                          <option value="(UTC-06:00) America/Tegucigalpa">
          (UTC-06:00) America/Tegucigalpa</option>
                                          <option value="(UTC-04:00) America/Thule">
          (UTC-04:00) America/Thule</option>
                                          <option value="(UTC-05:00) America/Thunder_Bay">
          (UTC-05:00) America/Thunder_Bay</option>
                                          <option value="(UTC-08:00) America/Tijuana">
          (UTC-08:00) America/Tijuana</option>
                                          <option value="(UTC-05:00) America/Toronto">
          (UTC-05:00) America/Toronto</option>
                          <option value="(UTC-04:00) America/Tortola">
(UTC-04:00) America/Tortola</option>
                          <option value="(UTC-08:00) America/Vancouver">
(UTC-08:00) America/Vancouver</option>
                          <option value="(UTC-07:00) America/Whitehorse">
(UTC-07:00) America/Whitehorse</option>
                          <option value="(UTC-06:00) America/Winnipeg">
(UTC-06:00) America/Winnipeg</option>
                          <option value="(UTC-09:00) America/Yakutat">
(UTC-09:00) America/Yakutat</option>
                          <option value="(UTC-07:00) America/Yellowknife">
(UTC-07:00) America/Yellowknife</option>
                          <option value="(UTC+08:00) Antarctica/Casey">
(UTC+08:00) Antarctica/Casey</option>
                          <option value="(UTC+07:00) Antarctica/Davis">
(UTC+07:00) Antarctica/Davis</option>
                          <option value="(UTC+10:00) Antarctica/DumontDUrville">
(UTC+10:00) Antarctica/DumontDUrville</option>
                          <option value="(UTC+11:00) Antarctica/Macquarie">
(UTC+11:00) Antarctica/Macquarie</option>
                          <option value="(UTC+05:00) Antarctica/Mawson">
(UTC+05:00) Antarctica/Mawson</option>
                          <option value="(UTC+12:00) Antarctica/McMurdo">
(UTC+12:00) Antarctica/McMurdo</option>
                          <option value="(UTC-03:00) Antarctica/Palmer">
(UTC-03:00) Antarctica/Palmer</option>
                          <option value="(UTC-03:00) Antarctica/Rothera">
(UTC-03:00) Antarctica/Rothera</option>
                          <option value="(UTC+03:00) Antarctica/Syowa">
(UTC+03:00) Antarctica/Syowa</option>
                          <option value="(UTC+02:00) Antarctica/Troll">
(UTC+02:00) Antarctica/Troll</option>
                          <option value="(UTC+06:00) Antarctica/Vostok">
(UTC+06:00) Antarctica/Vostok</option>
                          <option value="(UTC+01:00) Arctic/Longyearbyen">
(UTC+01:00) Arctic/Longyearbyen</option>
                          <option value="(UTC+03:00) Asia/Aden">
(UTC+03:00) Asia/Aden</option>
                          <option value="(UTC+06:00) Asia/Almaty">
(UTC+06:00) Asia/Almaty</option>
                          <option value="(UTC+02:00) Asia/Amman">
(UTC+02:00) Asia/Amman</option>
                          <option value="(UTC+12:00) Asia/Anadyr">
(UTC+12:00) Asia/Anadyr</option>
                          <option value="(UTC+05:00) Asia/Aqtau">
(UTC+05:00) Asia/Aqtau</option>
                          <option value="(UTC+05:00) Asia/Aqtobe">
(UTC+05:00) Asia/Aqtobe</option>
                          <option value="(UTC+05:00) Asia/Ashgabat">
(UTC+05:00) Asia/Ashgabat</option>
                          <option value="(UTC+05:00) Asia/Atyrau">
(UTC+05:00) Asia/Atyrau</option>
                          <option value="(UTC+03:00) Asia/Baghdad">
(UTC+03:00) Asia/Baghdad</option>
                          <option value="(UTC+03:00) Asia/Bahrain">
(UTC+03:00) Asia/Bahrain</option>
                          <option value="(UTC+04:00) Asia/Baku">
(UTC+04:00) Asia/Baku</option>
                          <option value="(UTC+07:00) Asia/Bangkok">
(UTC+07:00) Asia/Bangkok</option>
                          <option value="(UTC+07:00) Asia/Barnaul">
(UTC+07:00) Asia/Barnaul</option>
                          <option value="(UTC+02:00) Asia/Beirut">
(UTC+02:00) Asia/Beirut</option>
                          <option value="(UTC+06:00) Asia/Bishkek">
(UTC+06:00) Asia/Bishkek</option>
                          <option value="(UTC+08:00) Asia/Brunei">
(UTC+08:00) Asia/Brunei</option>
                          <option value="(UTC+09:00) Asia/Chita">
(UTC+09:00) Asia/Chita</option>
                          <option value="(UTC+08:00) Asia/Choibalsan">
(UTC+08:00) Asia/Choibalsan</option>
                          <option value="(UTC+05:30) Asia/Colombo">
(UTC+05:30) Asia/Colombo</option>
                          <option value="(UTC+02:00) Asia/Damascus">
(UTC+02:00) Asia/Damascus</option>
                          <option value="(UTC+06:00) Asia/Dhaka">
(UTC+06:00) Asia/Dhaka</option>
                          <option value="(UTC+09:00) Asia/Dili">
(UTC+09:00) Asia/Dili</option>
                          <option value="(UTC+04:00) Asia/Dubai">
(UTC+04:00) Asia/Dubai</option>
                          <option value="(UTC+05:00) Asia/Dushanbe">
(UTC+05:00) Asia/Dushanbe</option>
                          <option value="(UTC+02:00) Asia/Famagusta">
(UTC+02:00) Asia/Famagusta</option>
                          <option value="(UTC+02:00) Asia/Gaza">
(UTC+02:00) Asia/Gaza</option>
                          <option value="(UTC+02:00) Asia/Hebron">
(UTC+02:00) Asia/Hebron</option>
                          <option value="(UTC+07:00) Asia/Ho_Chi_Minh">
(UTC+07:00) Asia/Ho_Chi_Minh</option>
                          <option value="(UTC+08:00) Asia/Hong_Kong">
(UTC+08:00) Asia/Hong_Kong</option>
                          <option value="(UTC+07:00) Asia/Hovd">
(UTC+07:00) Asia/Hovd</option>
                          <option value="(UTC+08:00) Asia/Irkutsk">
(UTC+08:00) Asia/Irkutsk</option>
                          <option value="(UTC+07:00) Asia/Jakarta">
(UTC+07:00) Asia/Jakarta</option>
                          <option value="(UTC+09:00) Asia/Jayapura">
(UTC+09:00) Asia/Jayapura</option>
                          <option value="(UTC+02:00) Asia/Jerusalem">
(UTC+02:00) Asia/Jerusalem</option>
                          <option value="(UTC+04:30) Asia/Kabul">
(UTC+04:30) Asia/Kabul</option>
                          <option value="(UTC+12:00) Asia/Kamchatka">
(UTC+12:00) Asia/Kamchatka</option>
                          <option value="(UTC+05:00) Asia/Karachi">
(UTC+05:00) Asia/Karachi</option>
                          <option value="(UTC+05:45) Asia/Kathmandu">
(UTC+05:45) Asia/Kathmandu</option>
                          <option value="(UTC+09:00) Asia/Khandyga">
(UTC+09:00) Asia/Khandyga</option>
                          <option value="(UTC+05:30) Asia/Kolkata">
(UTC+05:30) Asia/Kolkata</option>
                          <option value="(UTC+07:00) Asia/Krasnoyarsk">
(UTC+07:00) Asia/Krasnoyarsk</option>
                          <option value="(UTC+08:00) Asia/Kuala_Lumpur">
(UTC+08:00) Asia/Kuala_Lumpur</option>
                          <option value="(UTC+08:00) Asia/Kuching">
(UTC+08:00) Asia/Kuching</option>
                          <option value="(UTC+03:00) Asia/Kuwait">
(UTC+03:00) Asia/Kuwait</option>
                          <option value="(UTC+08:00) Asia/Macau">
(UTC+08:00) Asia/Macau</option>
                          <option value="(UTC+11:00) Asia/Magadan">
(UTC+11:00) Asia/Magadan</option>
                          <option value="(UTC+08:00) Asia/Makassar">
(UTC+08:00) Asia/Makassar</option>
                          <option value="(UTC+08:00) Asia/Manila">
(UTC+08:00) Asia/Manila</option>
                          <option value="(UTC+04:00) Asia/Muscat">
(UTC+04:00) Asia/Muscat</option>
                          <option value="(UTC+02:00) Asia/Nicosia">
(UTC+02:00) Asia/Nicosia</option>
                          <option value="(UTC+07:00) Asia/Novokuznetsk">
(UTC+07:00) Asia/Novokuznetsk</option>
                          <option value="(UTC+07:00) Asia/Novosibirsk">
(UTC+07:00) Asia/Novosibirsk</option>
                          <option value="(UTC+06:00) Asia/Omsk">
(UTC+06:00) Asia/Omsk</option>
                          <option value="(UTC+05:00) Asia/Oral">
(UTC+05:00) Asia/Oral</option>
                          <option value="(UTC+07:00) Asia/Phnom_Penh">
(UTC+07:00) Asia/Phnom_Penh</option>
                          <option value="(UTC+07:00) Asia/Pontianak">
(UTC+07:00) Asia/Pontianak</option>
                          <option value="(UTC+09:00) Asia/Pyongyang">
(UTC+09:00) Asia/Pyongyang</option>
                          <option value="(UTC+03:00) Asia/Qatar">
(UTC+03:00) Asia/Qatar</option>
                          <option value="(UTC+06:00) Asia/Qostanay">
(UTC+06:00) Asia/Qostanay</option>
                          <option value="(UTC+05:00) Asia/Qyzylorda">
(UTC+05:00) Asia/Qyzylorda</option>
                          <option value="(UTC+03:00) Asia/Riyadh">
(UTC+03:00) Asia/Riyadh</option>
                          <option value="(UTC+11:00) Asia/Sakhalin">
(UTC+11:00) Asia/Sakhalin</option>
                          <option value="(UTC+05:00) Asia/Samarkand">
(UTC+05:00) Asia/Samarkand</option>
                          <option value="(UTC+09:00) Asia/Seoul">
(UTC+09:00) Asia/Seoul</option>
                          <option value="(UTC+08:00) Asia/Shanghai">
(UTC+08:00) Asia/Shanghai</option>
                          <option value="(UTC+08:00) Asia/Singapore">
(UTC+08:00) Asia/Singapore</option>
                          <option value="(UTC+11:00) Asia/Srednekolymsk">
(UTC+11:00) Asia/Srednekolymsk</option>
                          <option value="(UTC+08:00) Asia/Taipei">
(UTC+08:00) Asia/Taipei</option>
                          <option value="(UTC+05:00) Asia/Tashkent">
(UTC+05:00) Asia/Tashkent</option>
                          <option value="(UTC+04:00) Asia/Tbilisi">
(UTC+04:00) Asia/Tbilisi</option>
                          <option value="(UTC+03:30) Asia/Tehran">
(UTC+03:30) Asia/Tehran</option>
                          <option value="(UTC+06:00) Asia/Thimphu">
(UTC+06:00) Asia/Thimphu</option>
                          <option value="(UTC+09:00) Asia/Tokyo">
(UTC+09:00) Asia/Tokyo</option>
                          <option value="(UTC+07:00) Asia/Tomsk">
(UTC+07:00) Asia/Tomsk</option>
                          <option value="(UTC+08:00) Asia/Ulaanbaatar">
(UTC+08:00) Asia/Ulaanbaatar</option>
                          <option value="(UTC+06:00) Asia/Urumqi">
(UTC+06:00) Asia/Urumqi</option>
                          <option value="(UTC+10:00) Asia/Ust-Nera">
(UTC+10:00) Asia/Ust-Nera</option>
                          <option value="(UTC+07:00) Asia/Vientiane">
(UTC+07:00) Asia/Vientiane</option>
                          <option value="(UTC+10:00) Asia/Vladivostok">
(UTC+10:00) Asia/Vladivostok</option>
                          <option value="(UTC+09:00) Asia/Yakutsk">
(UTC+09:00) Asia/Yakutsk</option>
                          <option value="(UTC+06:30) Asia/Yangon">
(UTC+06:30) Asia/Yangon</option>
                          <option value="(UTC+05:00) Asia/Yekaterinburg">
(UTC+05:00) Asia/Yekaterinburg</option>
                          <option value="(UTC+04:00) Asia/Yerevan">
(UTC+04:00) Asia/Yerevan</option>
                          <option value="(UTC-01:00) Atlantic/Azores">
(UTC-01:00) Atlantic/Azores</option>
                          <option value="(UTC-04:00) Atlantic/Bermuda">
(UTC-04:00) Atlantic/Bermuda</option>
                          <option value="(UTC+00:00) Atlantic/Canary">
(UTC+00:00) Atlantic/Canary</option>
                          <option value="(UTC-01:00) Atlantic/Cape_Verde">
(UTC-01:00) Atlantic/Cape_Verde</option>
                          <option value="(UTC+00:00) Atlantic/Faroe">
(UTC+00:00) Atlantic/Faroe</option>
                          <option value="(UTC+00:00) Atlantic/Madeira">
(UTC+00:00) Atlantic/Madeira</option>
                          <option value="(UTC+00:00) Atlantic/Reykjavik">
(UTC+00:00) Atlantic/Reykjavik</option>
                          <option value="(UTC-02:00) Atlantic/South_Georgia">
(UTC-02:00) Atlantic/South_Georgia</option>
                          <option value="(UTC-03:00) Atlantic/Stanley">
(UTC-03:00) Atlantic/Stanley</option>
                          <option value="(UTC+09:30) Australia/Adelaide">
(UTC+09:30) Australia/Adelaide</option>
                          <option value="(UTC+10:00) Australia/Brisbane">
(UTC+10:00) Australia/Brisbane</option>
                          <option value="(UTC+09:30) Australia/Broken_Hill">
(UTC+09:30) Australia/Broken_Hill</option>
                          <option value="(UTC+10:00) Australia/Currie">
(UTC+10:00) Australia/Currie</option>
                          <option value="(UTC+09:30) Australia/Darwin">
(UTC+09:30) Australia/Darwin</option>
                          <option value="(UTC+08:45) Australia/Eucla">
(UTC+08:45) Australia/Eucla</option>
                          <option value="(UTC+10:00) Australia/Hobart">
(UTC+10:00) Australia/Hobart</option>
                          <option value="(UTC+10:00) Australia/Lindeman">
(UTC+10:00) Australia/Lindeman</option>
                          <option value="(UTC+10:30) Australia/Lord_Howe">
(UTC+10:30) Australia/Lord_Howe</option>
                          <option value="(UTC+10:00) Australia/Melbourne">
(UTC+10:00) Australia/Melbourne</option>
                          <option value="(UTC+08:00) Australia/Perth">
(UTC+08:00) Australia/Perth</option>
                          <option value="(UTC+10:00) Australia/Sydney">
(UTC+10:00) Australia/Sydney</option>
                          <option value="(UTC+01:00) Europe/Amsterdam">
(UTC+01:00) Europe/Amsterdam</option>
                          <option value="(UTC+01:00) Europe/Andorra">
(UTC+01:00) Europe/Andorra</option>
                          <option value="(UTC+04:00) Europe/Astrakhan">
(UTC+04:00) Europe/Astrakhan</option>
                          <option value="(UTC+02:00) Europe/Athens">
(UTC+02:00) Europe/Athens</option>
                          <option value="(UTC+01:00) Europe/Belgrade">
(UTC+01:00) Europe/Belgrade</option>
                          <option value="(UTC+01:00) Europe/Berlin">
(UTC+01:00) Europe/Berlin</option>
                          <option value="(UTC+01:00) Europe/Bratislava">
(UTC+01:00) Europe/Bratislava</option>
                          <option value="(UTC+01:00) Europe/Brussels">
(UTC+01:00) Europe/Brussels</option>
                          <option value="(UTC+02:00) Europe/Bucharest">
(UTC+02:00) Europe/Bucharest</option>
                          <option value="(UTC+01:00) Europe/Budapest">
(UTC+01:00) Europe/Budapest</option>
                          <option value="(UTC+01:00) Europe/Busingen">
(UTC+01:00) Europe/Busingen</option>
                          <option value="(UTC+02:00) Europe/Chisinau">
(UTC+02:00) Europe/Chisinau</option>
                          <option value="(UTC+01:00) Europe/Copenhagen">
(UTC+01:00) Europe/Copenhagen</option>
                          <option value="(UTC+00:00) Europe/Dublin">
(UTC+00:00) Europe/Dublin</option>
                          <option value="(UTC+01:00) Europe/Gibraltar">
(UTC+01:00) Europe/Gibraltar</option>
                          <option value="(UTC+00:00) Europe/Guernsey">
(UTC+00:00) Europe/Guernsey</option>
            <option value="(UTC+02:00) Europe/Helsinki">
(UTC+02:00) Europe/Helsinki</option>
            <option value="(UTC+00:00) Europe/Isle_of_Man">
(UTC+00:00) Europe/Isle_of_Man</option>
            <option value="(UTC+03:00) Europe/Istanbul">
(UTC+03:00) Europe/Istanbul</option>
            <option value="(UTC+00:00) Europe/Jersey">
(UTC+00:00) Europe/Jersey</option>
            <option value="(UTC+02:00) Europe/Kaliningrad">
(UTC+02:00) Europe/Kaliningrad</option>
            <option value="(UTC+02:00) Europe/Kiev">
(UTC+02:00) Europe/Kiev</option>
            <option value="(UTC+03:00) Europe/Kirov">
(UTC+03:00) Europe/Kirov</option>
            <option value="(UTC+00:00) Europe/Lisbon">
(UTC+00:00) Europe/Lisbon</option>
            <option value="(UTC+01:00) Europe/Ljubljana">
(UTC+01:00) Europe/Ljubljana</option>
            <option value="(UTC+00:00) Europe/London">
(UTC+00:00) Europe/London</option>
            <option value="(UTC+01:00) Europe/Luxembourg">
(UTC+01:00) Europe/Luxembourg</option>
            <option value="(UTC+01:00) Europe/Madrid">
(UTC+01:00) Europe/Madrid</option>
            <option value="(UTC+01:00) Europe/Malta">
(UTC+01:00) Europe/Malta</option>
            <option value="(UTC+02:00) Europe/Mariehamn">
(UTC+02:00) Europe/Mariehamn</option>
            <option value="(UTC+03:00) Europe/Minsk">
(UTC+03:00) Europe/Minsk</option>
            <option value="(UTC+01:00) Europe/Monaco">
(UTC+01:00) Europe/Monaco</option>
            <option value="(UTC+03:00) Europe/Moscow">
(UTC+03:00) Europe/Moscow</option>
            <option value="(UTC+01:00) Europe/Oslo">
(UTC+01:00) Europe/Oslo</option>
            <option value="(UTC+01:00) Europe/Paris">
(UTC+01:00) Europe/Paris</option>
            <option value="(UTC+01:00) Europe/Podgorica">
(UTC+01:00) Europe/Podgorica</option>
            <option value="(UTC+01:00) Europe/Prague">
(UTC+01:00) Europe/Prague</option>
            <option value="(UTC+02:00) Europe/Riga">
(UTC+02:00) Europe/Riga</option>
            <option value="(UTC+01:00) Europe/Rome">
(UTC+01:00) Europe/Rome</option>
            <option value="(UTC+04:00) Europe/Samara">
(UTC+04:00) Europe/Samara</option>
            <option value="(UTC+01:00) Europe/San_Marino">
(UTC+01:00) Europe/San_Marino</option>
            <option value="(UTC+01:00) Europe/Sarajevo">
(UTC+01:00) Europe/Sarajevo</option>
            <option value="(UTC+04:00) Europe/Saratov">
(UTC+04:00) Europe/Saratov</option>
            <option value="(UTC+03:00) Europe/Simferopol">
(UTC+03:00) Europe/Simferopol</option>
            <option value="(UTC+01:00) Europe/Skopje">
(UTC+01:00) Europe/Skopje</option>
            <option value="(UTC+02:00) Europe/Sofia">
(UTC+02:00) Europe/Sofia</option>
            <option value="(UTC+01:00) Europe/Stockholm">
(UTC+01:00) Europe/Stockholm</option>
            <option value="(UTC+02:00) Europe/Tallinn">
(UTC+02:00) Europe/Tallinn</option>
            <option value="(UTC+01:00) Europe/Tirane">
(UTC+01:00) Europe/Tirane</option>
            <option value="(UTC+04:00) Europe/Ulyanovsk">
(UTC+04:00) Europe/Ulyanovsk</option>
            <option value="(UTC+01:00) Europe/Vaduz">
(UTC+01:00) Europe/Vaduz</option>
            <option value="(UTC+01:00) Europe/Vatican">
(UTC+01:00) Europe/Vatican</option>
            <option value="(UTC+01:00) Europe/Vienna">
(UTC+01:00) Europe/Vienna</option>
            <option value="(UTC+02:00) Europe/Vilnius">
(UTC+02:00) Europe/Vilnius</option>
            <option value="(UTC+03:00) Europe/Volgograd">
(UTC+03:00) Europe/Volgograd</option>
            <option value="(UTC+01:00) Europe/Warsaw">
(UTC+01:00) Europe/Warsaw</option>
            <option value="(UTC+01:00) Europe/Zagreb">
(UTC+01:00) Europe/Zagreb</option>
            <option value="(UTC+02:00) Europe/Zaporozhye">
(UTC+02:00) Europe/Zaporozhye</option>
            <option value="(UTC+01:00) Europe/Zurich">
(UTC+01:00) Europe/Zurich</option>
            <option value="(UTC+03:00) Indian/Antananarivo">
(UTC+03:00) Indian/Antananarivo</option>
            <option value="(UTC+06:00) Indian/Chagos">
(UTC+06:00) Indian/Chagos</option>
            <option value="(UTC+07:00) Indian/Christmas">
(UTC+07:00) Indian/Christmas</option>
            <option value="(UTC+06:30) Indian/Cocos">
(UTC+06:30) Indian/Cocos</option>
            <option value="(UTC+03:00) Indian/Comoro">
(UTC+03:00) Indian/Comoro</option>
            <option value="(UTC+05:00) Indian/Kerguelen">
(UTC+05:00) Indian/Kerguelen</option>
            <option value="(UTC+04:00) Indian/Mahe">
(UTC+04:00) Indian/Mahe</option>
            <option value="(UTC+05:00) Indian/Maldives">
(UTC+05:00) Indian/Maldives</option>
            <option value="(UTC+04:00) Indian/Mauritius">
(UTC+04:00) Indian/Mauritius</option>
            <option value="(UTC+03:00) Indian/Mayotte">
(UTC+03:00) Indian/Mayotte</option>
            <option value="(UTC+04:00) Indian/Reunion">
(UTC+04:00) Indian/Reunion</option>
            <option value="(UTC+13:00) Pacific/Apia">
(UTC+13:00) Pacific/Apia</option>
            <option value="(UTC+12:00) Pacific/Auckland">
(UTC+12:00) Pacific/Auckland</option>
            <option value="(UTC+11:00) Pacific/Bougainville">
(UTC+11:00) Pacific/Bougainville</option>
            <option value="(UTC+12:45) Pacific/Chatham">
(UTC+12:45) Pacific/Chatham</option>
            <option value="(UTC+10:00) Pacific/Chuuk">
(UTC+10:00) Pacific/Chuuk</option>
            <option value="(UTC-06:00) Pacific/Easter">
(UTC-06:00) Pacific/Easter</option>
            <option value="(UTC+11:00) Pacific/Efate">
(UTC+11:00) Pacific/Efate</option>
            <option value="(UTC+13:00) Pacific/Enderbury">
(UTC+13:00) Pacific/Enderbury</option>
            <option value="(UTC+13:00) Pacific/Fakaofo">
(UTC+13:00) Pacific/Fakaofo</option>
            <option value="(UTC+12:00) Pacific/Fiji">
(UTC+12:00) Pacific/Fiji</option>
            <option value="(UTC+12:00) Pacific/Funafuti">
(UTC+12:00) Pacific/Funafuti</option>
            <option value="(UTC-06:00) Pacific/Galapagos">
(UTC-06:00) Pacific/Galapagos</option>
            <option value="(UTC-09:00) Pacific/Gambier">
(UTC-09:00) Pacific/Gambier</option>
            <option value="(UTC+11:00) Pacific/Guadalcanal">
(UTC+11:00) Pacific/Guadalcanal</option>
            <option value="(UTC+10:00) Pacific/Guam">
(UTC+10:00) Pacific/Guam</option>
            <option value="(UTC-10:00) Pacific/Honolulu">
(UTC-10:00) Pacific/Honolulu</option>
            <option value="(UTC-10:00) Pacific/Johnston">
(UTC-10:00) Pacific/Johnston</option>
            <option value="(UTC+14:00) Pacific/Kiritimati">
(UTC+14:00) Pacific/Kiritimati</option>
            <option value="(UTC+11:00) Pacific/Kosrae">
(UTC+11:00) Pacific/Kosrae</option>
            <option value="(UTC+12:00) Pacific/Kwajalein">
(UTC+12:00) Pacific/Kwajalein</option>
            <option value="(UTC+12:00) Pacific/Majuro">
(UTC+12:00) Pacific/Majuro</option>
            <option value="(UTC-09:30) Pacific/Marquesas">
(UTC-09:30) Pacific/Marquesas</option>
            <option value="(UTC-11:00) Pacific/Midway">
(UTC-11:00) Pacific/Midway</option>
            <option value="(UTC+12:00) Pacific/Nauru">
(UTC+12:00) Pacific/Nauru</option>
            <option value="(UTC-11:00) Pacific/Niue">
(UTC-11:00) Pacific/Niue</option>
            <option value="(UTC+11:00) Pacific/Norfolk">
(UTC+11:00) Pacific/Norfolk</option>
            <option value="(UTC+11:00) Pacific/Noumea">
(UTC+11:00) Pacific/Noumea</option>
            <option value="(UTC-11:00) Pacific/Pago_Pago">
(UTC-11:00) Pacific/Pago_Pago</option>
            <option value="(UTC+09:00) Pacific/Palau">
(UTC+09:00) Pacific/Palau</option>
            <option value="(UTC-08:00) Pacific/Pitcairn">
(UTC-08:00) Pacific/Pitcairn</option>
            <option value="(UTC+11:00) Pacific/Pohnpei">
(UTC+11:00) Pacific/Pohnpei</option>
            <option value="(UTC+10:00) Pacific/Port_Moresby">
(UTC+10:00) Pacific/Port_Moresby</option>
            <option value="(UTC-10:00) Pacific/Rarotonga">
(UTC-10:00) Pacific/Rarotonga</option>
            <option value="(UTC+10:00) Pacific/Saipan">
(UTC+10:00) Pacific/Saipan</option>
            <option value="(UTC-10:00) Pacific/Tahiti">
(UTC-10:00) Pacific/Tahiti</option>
            <option value="(UTC+12:00) Pacific/Tarawa">
(UTC+12:00) Pacific/Tarawa</option>
            <option value="(UTC+13:00) Pacific/Tongatapu">
(UTC+13:00) Pacific/Tongatapu</option>
            <option value="(UTC+12:00) Pacific/Wake">
(UTC+12:00) Pacific/Wake</option>
            <option value="(UTC+12:00) Pacific/Wallis">
(UTC+12:00) Pacific/Wallis</option>
            <option value="(UTC+5:30)IST Indian Standard Time">
(UTC+5:30)IST Indian Standard Time</option>
    </select>
        </div>

        <div>
          <label htmlFor="workmode" className="block font-medium mb-1 text-gray-700">
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
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Service Provider Agency Location">Service Provider Agency Location</option>
          </select>
        </div>
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

      <button
        type="submit"
        // disabled={loading}
        className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-md transition"
      >
        Post Job
      </button>
    </form>
  );
}






         


// const initialFormState = {
//   title: "",
//   skills: [],
//   budget: "",
//   duration: "",
//   availability: "",
//   timezone: "",
//   workmode: "Remote",
//   job_description: "",
//   currency_type:'',
//   key_responsibilities: "",
//   technical_skills: "",
//   location_city: "",
//   location_state: "",
//   location_country: "",
//    experience_years: "",
//   experience_months: "",
//   start_date: "",
//   end_date: "",
//   work_days: [], 
//   job_start_time: "",
//   job_end_time: "",
// };
