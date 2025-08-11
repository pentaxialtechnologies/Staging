"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react"

import { convertFromRaw, convertToRaw, EditorState, } from 'draft-js';

const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), {
  ssr: false,
});
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {  useSession } from "next-auth/react";
import {useForm,Controller} from 'react-hook-form'
import toast,{Toaster} from "react-hot-toast";


  interface JobForm {
    technical_skills: any
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
    workmodes: 'No',
    plannedStartDate: new Date(),
    technical_skills: undefined,
    experience: {
      minyears: "",
      maxyears: "",
    },
    postedBy: "",
  };


export default function CreateJobForm() {
    const [form, setForm] = useState<JobForm>(initialFormState);
    const [SkillError,setSkillError] = useState('');
    const {register,control,handleSubmit,watch,setValue,getValues,reset,trigger,formState:{errors}} = useForm({defaultValues:initialFormState});
    const [KeyState, setKeyState] = useState(() => EditorState.createEmpty());
 
    const [SkillState, setSkillState] = useState(() => EditorState.createEmpty());

    const [Step,setStep] = useState(1)
    const isMountedRef = useRef(true);



  const handleNext = async()=>{
     
      const isStep1Valid = await trigger(Step ===1 ? ['title','skills','availability','workmode','staff_count','budget','duration','engagement_type','experience.minyears','experience.maxyears']: ['job_description','key_responsibilities','technical_skills']);

      if (isStep1Valid)
        {
          setStep((prevStep) => prevStep+1)
          window.scrollTo({top:0,behavior:'smooth'})
        }
    }

    const handlePrev = ()=>{
      setStep((prevStep)=> prevStep-1)
      window.scrollTo({top:0,behavior:'smooth'})
    }

    

const updateEditor = (state: EditorState, key: keyof JobForm) => {
  const raw = convertToRaw(state.getCurrentContent());
  const stringified = JSON.stringify(raw);

  setForm(prev => ({ ...prev, [key]: stringified }));
  setValue(key, stringified, { shouldValidate: true }); // sync with react-hook-form
};


useEffect(() => {
  register("job_description", { required: "Job Description is required" });
  register("key_responsibilities", { required: "Key Responsibilities are required" });
  register("technical_skills", { required: "Technical Skills are required" });
}, [register]);


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




const hydratedRef = useRef(false);

useEffect(() => {
  if (hydratedRef.current) return;

  try {
    if (form.job_description) {
      setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(form.job_description))));
    }
    if (form.key_responsibilities) {
      setKeyState(EditorState.createWithContent(convertFromRaw(JSON.parse(form.key_responsibilities))));
    }
    if (form.technical_skills) {
      setSkillState(EditorState.createWithContent(convertFromRaw(JSON.parse(form.technical_skills))));
    }
    hydratedRef.current = true;
  } catch (error) {
    console.error("Error parsing editor content:", error);
  }
}, []);





const [input, setInput] = useState("");

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter" || e.key === ",") {
    e.preventDefault();
    const trimmed = input.trim();
    const currentSkills = getValues("skills") || [];

    if (trimmed && !currentSkills.includes(trimmed)) {
      const updatedSkills = [...currentSkills, trimmed];
      setValue("skills", updatedSkills, { shouldValidate: true });
    }
    setInput("");
  }
};

const removeSkill = (idx: number) => {
  const currentSkills = getValues("skills") || [];
  const updatedSkills = currentSkills.filter((_, i) => i !== idx);
  setValue("skills", updatedSkills, { shouldValidate: true });
};



const [, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState(false);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  const keys = name.split(".");

  if (keys.length === 2) {
    setForm(prev => ({
      ...prev,
      [keys[0]]: {
        ...prev[keys[0] as keyof typeof prev],
        [keys[1]]: keys[1] === "plannedStartDate" ? new Date(value) : value
      }
    }));
  } else {
    setForm(prev => ({
      ...prev,
      [name]: name === "plannedStartDate" ? new Date(value) : value
    }));
  }
};



const {data: session} = useSession();
const userId = session?.user.id

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


const onSubmit = async (FormData: any) => {
  setLoading(true);
  setError(null);
  // setSuccess(false);

  // ✅ Trigger validation for key fields
  const isValid = await trigger([
    "job_description",
    "key_responsibilities",
    "technical_skills",
  ]);

  if (!isValid) {
    setLoading(false);
    return;
  }

  // ✅ Format payload
  const payload = {
    ...FormData,
    currency_type: FormData.currency_type ?? "USD",
    timezone: FormData.timezone ?? "Asia/Kolkata",

    experience: {
      minyears: parseInt(FormData.experience?.minyears || "0"),
      maxyears: parseInt(FormData.experience?.maxyears || "0"),
    },

    plannedStartDate: FormData.plannedStartDate
      ? new Date(FormData.plannedStartDate)
      : null,

   skills: (FormData.skills || []).map((skill: string) =>
  skill.trim().toLowerCase()
),
    job_description: extractTextsFromRawString(FormData.job_description || "").join("\n"),
    key_responsibilities: extractTextsFromRawString(FormData.key_responsibilities || "").join("\n"),
    technical_skills: extractTextsFromRawString(FormData.technical_skills || "").join("\n"),
  };


  console.log("Submitting Skills payload:", FormData.skills);

  console.log("Submitting job payload:", payload);

  try {
    // ✅ Make API call
    const res = await fetch("/api/auth/contractjobs/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payload,
        postedBy: session?.user?.id,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to create job");
    }

    // ✅ Success - reset form
    // setSuccess(true);
    toast.success("Job posted successfully!");
    setForm(initialFormState);
    setEditorState(EditorState.createEmpty());
    setKeyState(EditorState.createEmpty());
    setSkillState(EditorState.createEmpty());
    setInput("");
    setSkillError("");
    setStep(1);
    reset();
    window.scrollTo({top:0,behavior:'smooth'})
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      <Toaster/>
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-md space-y-6"
    > 
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
       Post a Job to Hire Talent on Contract
      </h2>

<p className="flex items-end">{Step} of {Step}</p>
      {error && (
        <p className="text-red-600 bg-red-100 border border-red-400 p-3 rounded">
          {error}
        </p>
      )}
      {/* {success && (
        <p className="text-green-700 bg-green-100 border border-green-400 p-3 rounded">
          Job posted successfully!
        </p>
      )} */}
   
   {Step ===1 && (
 <div>
      <div className="grid grid-cols-1  gap-6">
        <div>
          <label htmlFor="title" className="block font-medium mb-1 text-gray-700">
            Contract job title <span className="text-red-500">*</span>
          </label>
          <Controller 
          name="title"
          control={control}
          rules={ { required: "Job title is required" }}
          render={({field})=> (
         <input
                {...field}
                placeholder="e.g. Senior React Developer"
                className={`w-full rounded-md border px-4 py-2 ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
          )} 
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
       </div>     
      <div className="w-full">
  <label className="block font-medium mb-1 text-gray-700">
    Skills <span className="text-red-500">*</span>
  </label>

  <div className="w-full border border-gray-300 rounded-md px-2 py-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-indigo-500 transition">
    {(watch("skills") || []).map((skill: string, idx: number) => (
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
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Type and press enter"
      className="flex-1 border-none focus:outline-none"
    />
  </div>

  <p className="text-sm text-gray-500 mt-1">Press Enter or comma to add skill</p>

  {errors.skills && (
    <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>
  )}
</div>


          <div className="flex  flex-row gap-6">
      <div className="w-full">
        <label htmlFor="availability" className="block font-medium mb-1 text-gray-700 w-95">
       Availability <span className="text-red-500">*</span>
      </label>

<Controller 
name="availability"
control={control}
rules={ {required:'Avalibility is required'}}
render ={ ({field})=> (
  <select
  {...field}
  className={`w-full rounded-md border px-4 py-2 ${errors.availability ? 'border-red-500' : 'border-gray-300'}`}
>
 <option value=''>Select Avalibility</option>
      <option value='Immediately'>Immediately</option>
      <option value="In 1 or 2 weeks from now">In 1 or 2 weeks from now</option>
      <option value="In 1 or 2 months from now">In 1 or 2 months from now</option>
      <option value="I am not sure at this point">I am not sure at this point</option>
    </select>
)}
/>
{errors.availability && (
  <p className="text-red-500 text-sm mt-1">{errors.availability.message}</p>
)}
        </div>
<div className="w-full">
  <label htmlFor="workmode" className="block font-medium mb-1 text-gray-700">
    Work Mode <span className="text-red-500">*</span>
  </label>
  
  <Controller
    name="workmode"
    control={control}
    rules={{ required: 'Work mode is required' }}
    render={({ field }) => (
      <select
        {...field}
        className={`w-full rounded-md border px-4 py-2 ${
          errors.workmode ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <option value="">Select Work Mode</option>
        <option value="Remote">Remote</option>
        <option value="Hybrid">Hybrid</option>
        <option value="On-site">On-site</option>
        <option value="Service Provider Agency Location">
          Service Provider Agency Location
        </option>
      </select>
    )}
  />
  {errors.workmode && (
    <p className="text-red-500 text-sm mt-1">{errors.workmode.message}</p>
  )}
</div>
      </div>
      {/* Conditional Field with react-hook-form */}
<div className="">
{(watch('workmode') === 'Hybrid' || watch('workmode') === 'On-site') && (
  <div className="mt-4 w-full">
    <label
      htmlFor="joblocation"
      className="block font-medium mb-1 text-gray-700"
    >
      Job Location <span className="text-red-500">*</span>
    </label>
    <Controller
      name="joblocation"
      control={control}
      rules={{
        required: 'Job Location is required for this work mode',
      }}
      render={({ field }) => (
        <input
          {...field}
          placeholder="Enter Job Location"
          className={`w-full rounded-md border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
            errors.joblocation ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      )}
    />
    {errors.joblocation && (
      <p className="text-red-500 text-sm mt-1">
        {errors.joblocation.message}
      </p>
    )}
  </div>
)}
</div>

<div className="flex flex-row gap-6">
  {/* Min Years */}
  <div className="w-full">
    <label className="font-medium mb-1 text-gray-700">
      Experience (From)
    </label>
    <Controller
      name="experience.minyears"
      control={control}
      rules={{ required: 'Minimum years of experience is required' }}
      render={({ field }) => (
        <input
          {...field}
          type="number"
          className={`w-full rounded-md border px-4 py-2 ${
            errors.experience?.minyears ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g. 2"
        />
      )}
    />
    {errors.experience?.minyears && (
      <p className="text-red-500 text-sm mt-1">
        {errors.experience.minyears.message}
      </p>
    )}
  </div>

  {/* Max Years */}
  <div className="w-full">
    <label className="font-medium mb-1 text-gray-700">
      Experience (To)
    </label>
    <Controller
      name="experience.maxyears"
      control={control}
      rules={{ required: 'Maximum years of experience is required' }}
      render={({ field }) => (
        <input
          {...field}
          type="number"
          className={`w-full rounded-md border px-4 py-2 ${
            errors.experience?.maxyears ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g. 5"
        />
      )}
    />
    {errors.experience?.maxyears && (
      <p className="text-red-500 text-sm mt-1">
        {errors.experience.maxyears.message}
      </p>
    )}
  </div>
</div>
<div>
    <div>
<label htmlFor="title" className="block font-medium mb-1 text-gray-700">
  Number of people you wish to hire for this job <span className="text-red-500">*</span>
    </label>
<Controller
name="staff_count"
control={control}
rules ={ {required:'Number of resources is required'}}
render = { ({field})=> (
  <input
  {...field}
  placeholder="Enter number of resources"
  className={`w-full rounded-md border px-4 py-2 ${errors.staff_count ? 'border-red-500' : 'border-gray-300'}`}
  />
)}
/>

{errors.staff_count && (  
  <p className="text-red-500 text-sm mt-1">{errors.staff_count.message}</p>
)}
        </div>
        </div>
        <div>
          <label htmlFor="budget" className="block font-medium mb-1 text-gray-700">
            Budget <span className="text-red-500">*</span>
          </label>
<Controller
name="budget"
control={control}
rules={{ required:'Budget is required' }}
render = { ({field})=> (
  <input 
  {...field}
  className={`w-full rounded-md border px-4 py-2 ${errors.budget ? 'border-red-500' : 'border-gray-300'}`}
  />
)}
/>

{errors.budget && ( 
  <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
)}
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

  <div className="w-full">
  <label
    htmlFor="plannedStartDate"
    className="block font-medium mb-1 text-gray-700"
  >
    Planned Start Date
  </label>

  <Controller
    name="plannedStartDate"
    control={control}
    render={({ field }) => (
      <input
        type="date"
        id="plannedStartDate"
        {...field}
        value={
          field.value && !isNaN(new Date(field.value).getTime())
            ? new Date(field.value).toISOString().split('T')[0]
            : ''
        }
        onChange={(e) => field.onChange(e.target.value)}
        className={`w-full rounded-md border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
          errors.plannedStartDate ? 'border-red-500' : 'border-gray-300'
        }`}
      />
    )}
  />

  {errors.plannedStartDate && (
    <p className="text-red-500 text-sm mt-1">
      {errors.plannedStartDate.message}
    </p>
  )}
</div>

  </div>
)}
</div>
<div className="flex flex-row  mt-4">
  
    <div className="w-full">
  <label htmlFor="duration" className="block font-medium mb-1 text-gray-700 w-full">
    Contract Duration <span className="text-red-500">*</span>
  </label>

<Controller 
name="duration"
control={control}
rules= {{required:'Duration is required'}}
render = { ({field})=> (
  <select
  {...field}
    className={`w-full rounded-md border px-4 py-2 ${errors.duration ? 'border-red-500' : 'border-gray-300'}`}
  >
  <option value="">-- Select Duration --</option>
    <option value="1 to 3 months">1 to 3 months</option>
    <option value="3 to 6 months">3 to 6 months</option>
    <option value="more than 6 months">More than 6 months</option>
    <option value="not sure at this time">Not sure at this time</option>
  </select>
)}
/>
{errors.duration && (
  <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
)}
</div>
<div className="w-full">
      <label htmlFor="engagement_type" className="block font-medium mb-1 text-gray-700 w-full">
      Engagement type  <span className="text-red-500">*</span>
      </label>

<Controller 
name="engagement_type"
control={control}
rules={{ required: 'Engagement type is required' }}
render = { ({field})=> (
  <select
   {...field}
   className={`w-full rounded-md border px-4 py-2 ${errors.engagement_type ? 'border-red-500' : 'border-gray-300'}`}
   >
  <option>Select engagement type</option>
      <option>Full time</option>
      <option>Part time</option>
</select>

)}
/>
{errors.engagement_type && (  
  <p className="text-red-500 text-sm mt-1">{errors.engagement_type.message}</p>
)}
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
        <Controller 
        name="payment_schedule"
        control={control}
        rules={{ required: 'Payment schedule is required' }}
        render = { ({field})=> (
          <select
            {...field}
            className={`w-full rounded-md border px-4 py-2 ${errors.payment_schedule ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="Daily">Daily</option>
            <option value="Hourly">Hourly</option>
            <option value="Weekly">Weekly</option>
            <option value="Bi-Weekly">Bi-Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
          </select>
          )}
          />
          {errors.payment_schedule && (
                      <p className="text-red-500 text-sm mt-1">{errors.payment_schedule.message}</p>
                    )}
            </div>
      
          <div>
          <label htmlFor="currency_type" className="block font-medium mb-1 text-gray-700">
           Currency <span className="text-red-500">*</span>
          </label>
          <Controller
          name="currency_type"
          control={control}
          rules={{ required: 'Currency type is required' }}
          render = { ({field})=> (
                <select 
                {...field}
                className={`w-full rounded-md border px-4 py-2 ${errors.currency_type ? 'border-red-500' : 'border-gray-300'}`}
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
                    
          )}
                    
          />
            {errors.currency_type && (
                        <p className="text-red-500 text-sm mt-1">{errors.currency_type.message}</p>
                      )}
          </div>
            


<div>
  <label className="block font-medium text-gray-700">Rate <span className="text-red-500">*</span></label>
  <Controller
  name="rate"
  rules={{required:'Rate Required'}}
  control={control}
  render ={({field})=> (
  <input
    {...field}

  type="number"
   className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
    placeholder="Enter rate"
  />
  )
}
  />

  {errors.rate && <p className="text-red-500 text-sm">{errors.rate.message}</p>}
</div>   
        </div>
             <div>
          <label htmlFor="timezone" className="block font-medium  text-gray-700">
            Timezone <span className="text-red-500">*</span>
          </label>

        <Controller
        name="timezone"
        control={control}
        rules={{ required: "Timezone is required" }}
        render={({ field }) => 
        <select {...field} className={`w-full rounded-md border px-4 py-2 ${errors.timezone ? 'border-red-500' : 'border-gray-300'}`}>
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

        </select>}
      />
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
