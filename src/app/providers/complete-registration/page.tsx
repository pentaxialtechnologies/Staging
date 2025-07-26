'use client';
import { useSession } from 'next-auth/react';

import React, { useEffect, useState, Key, FormEvent } from 'react';
import {  useRouter } from "next/navigation";
import {Controller,useForm} from 'react-hook-form'
interface IndustryFocus {
  category: string;
  percentage?: string;
}

interface ServiceLines {
  category: string;
  serviceline: string;
}

interface SubCategory {
  id: string;
  name: string;
}

interface Category {
  _id: Key | null | undefined;
  id: string;
  name: string;
  subcategory: SubCategory[];
}

interface Profile {
  companylogo: string;
  company_name: string;
  company_website: string;
  phone_number: string;
  company_location: string;
  location: {
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  service_lines: ServiceLines[];
  industry_focus: IndustryFocus[];

}

const Page = () => {
  const [steps, setSteps] = useState(1);
  const totalSteps = 2;

    const router = useRouter()
  const [formdata, setFormdata] = useState<Profile>({
    companylogo: '',
    company_name: '',
    company_website: '',
    phone_number: '',
    company_location: '',
    location: {
      city: '',
      state: '',
      country: '',
      postal_code: '',
    },
    service_lines: [{ category: '', serviceline: '' }],
    industry_focus: [{ category: '' }],
  });

const {control,handleSubmit,trigger,formState:{errors}} = useForm<Profile>({defaultValues: formdata})



const onSubmit = async(formdata : any) => {
  try {
    const res = await fetch(`/api/auth/provider/${Id}`, {
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formdata,hasCompletedPlanSelection:true }),
    });

    if (res.ok) {
      alert('Profile updated successfully!');
      router.push('/provider/dashboard?profileCompleted=true');
    } else {
      alert('Something went wrong.');
    }
  } catch (error) {
    console.error(error);
  }
};

  const [categories, setcategories] = useState<Category[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [, setSelectedCity] = useState('');


  const {data:session} = useSession()
  const Id = session?.user?.id
  console.log(Id,'ID');
  useEffect(() => {
  const fetchUser = async () => {
    if (!Id) return;
    try {
      const res = await fetch(`/api/auth/provider/${Id}`); // You need to create this API route
      const data = await res.json();
      setFormdata((prev) => ({
        ...prev,
        ...data 
      }));
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  };
  fetchUser();
}, [Id]);


  useEffect(() => {
    const fetchCountries = async () => {
      const res = await fetch('https://countriesnow.space/api/v0.1/countries/positions');
      const data = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setCountries(data.data.map((item: any) => item.name));
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (!selectedCountry) return;
    const fetchStates = async () => {
      const res = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: selectedCountry }),
      });
      const data = await res.json();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
      setStates(data.data.states.map((s: any) => s.name));
      setSelectedState('');
      setCities([]);
      setSelectedCity('');
    };
    fetchStates();
  }, [selectedCountry]);

  useEffect(() => {
    if ( !selectedState) return;
    const fetchCities = async () => {
      const res = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: selectedCountry, state: selectedState }),
      });
      const data = await res.json();
      setCities(data.data);
      setSelectedCity('');
    };
    fetchCities();
  }, [selectedState,selectedCountry]);

  useEffect(() => {
    const fetchData = async () => { 
      try {
        const res = await fetch('/api/auth/categories/get');
        if (res.ok) {
          const data = await res.json();
          setcategories(data.category);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);


const handleNext = async() =>{
  const isLastStep = steps === totalSteps;
  if (isLastStep) {
    handleSubmit(onSubmit)();
  } else {
    const isValid = true; 
    if (!isValid) {
      alert('Please fill all required fields.');
      return;
    }
    const StepValid = await trigger(steps === 1 ? ['company_name','company_website','phone_number','company_location','location.city','location.country','location.state','location.postal_code']:['service_lines'])
    if(!StepValid) {
      alert('Please fill all required fields.');
      return;
    }
      if(StepValid) 
      setSteps(steps + 1);
}
}


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'profile');
    formData.append('folder', 'company/profiles');

    const res = await fetch('https://api.cloudinary.com/v1_1/dfrfq0ch8/image/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (data.secure_url) {
      setFormdata((prev) => ({ ...prev, companylogo: data.secure_url }));
    }
  };

  return (
    <div className="w-full">
      <div className="w-full max-w-8xl bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Let&apos;s get some basic information
          <span className="text-base float-right">
            Step {steps}/{totalSteps}
          </span>
        </h1>




        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" >
          {steps === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* <input type="file" className="w-full px-4 py-2 border rounded-lg col-span-1" onChange={handleImageUpload} /> */}
              <div>
   <Controller
  name="companylogo"
  control={control}
  rules={{ required: 'Company logo is required' }}
  render={({ field }) => (
    <input
      type="file"
      onChange={handleImageUpload} 
      accept="image/*"
      className="w-full px-4 py-2 border rounded-lg col-span-2"
    />
  )}
/>
{errors.companylogo && (
  <p className="text-red-500 text-sm">{errors.companylogo.message}</p>
)}

              </div>  
<div>
  <Controller
  name='company_name'
  control={control}
  rules={{ required: 'Company name is required' }}
  render = { ({field}) =>(
    <input
      type="text"
      {...field}
      placeholder="Company Name"
      className="w-full px-4 py-2 border rounded-lg"
    />
  )}
  />
  <p className="text-red-500 text-sm">
    {errors.company_name && errors.company_name.message}  
  </p>
</div>

<div>
  <Controller
    name="company_website"
    control={control}
    rules={{ required: 'Company website is required' }}
    render={({ field }) => (
      <input
        type="text"
        {...field}
        placeholder="Company Website"
        className="w-full px-4 py-2 border rounded-lg"
      />
    )}
  />
  {errors.company_website && <p className="text-red-500 text-sm">{errors.company_website.message}</p>}
</div>
          
<div>
  <Controller
    name="phone_number"
    control={control}
    rules={{ required: 'Phone number is required' }}
    render={({ field }) => (
      <input
        type="text"
        {...field}
        placeholder="Phone Number"
        className="w-full px-4 py-2 border rounded-lg"
      />
    )}
  />
  {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number.message}</p>}
</div>

<div>
  <Controller
    name="company_location"
    control={control}
    rules={{ required: 'Company location is required' }}
    render={({ field }) => (
      <input
        type="text"
        {...field}
        placeholder="Company Location"
        className="w-full px-4 py-2 border rounded-lg"
      />
    )}
  />
  {errors.company_location && <p className="text-red-500 text-sm">{errors.company_location.message}</p>}
</div>

<div>
  <Controller
    name="location.country"
    control={control}
    rules={{ required: 'Country is required' }}
    render={({ field }) => (
      <select
        {...field}
        className="w-full px-4 py-2 border rounded-lg"
        onChange={(e) => {
          field.onChange(e.target.value);
          setSelectedCountry(e.target.value);
        }}
      >
        <option value="">Select Country</option>
        {countries.map((country) => (
          <option key={country} value={country}>{country}</option>
        ))}
      </select>
    )}
  />
  {errors.location?.country && <p className="text-red-500 text-sm">{errors.location.country.message}</p>}
</div>


<div>
<Controller 
name='location.state'
control = {control}
rules = { {required: 'State is required'  }}
render = {({field})=> (
  <select
  {...field}
  className="w-full px-4 py-2 border rounded-lg"
  onChange={(e) => {
    field.onChange(e.target.value);
    setSelectedState(e.target.value);
    setCities([]); 
  }}
>
    <option value="">Select State</option>
    {states.map((state) => (
      <option key={state} value={state}>{state}</option>
    ))}
  </select>
)}
/>
  {errors.location?.state && <p className="text-red-500 text-sm">{errors.location.state.message}</p>}
</div>

<div>
  <Controller 
  name = 'location.city'
  control = {control}
  rules = {{ required: 'City is required' }}
  render = {({field}) => (
    <select
      {...field}
      className="w-full px-4 py-2 border rounded-lg"
      onChange={(e) => {
        field.onChange(e.target.value);
        setSelectedCity(e.target.value);
      }}
    >
      <option value="">Select City</option>
      {cities.map((city) => (
        <option key={city} value={city}>{city}</option>
      ))}
    </select>
  )}
  />
  {errors.location?.city && <p className="text-red-500 text-sm">{errors.location.city.message}</p>}
</div>

  <div>
  <Controller
    name="location.postal_code"
    control={control}
    rules={{ required: 'Postal code is required' }}
    render={({ field }) => (
      <input
        type="text"
        {...field}
        placeholder="Postal Code"
        className="w-full px-4 py-2 border rounded-lg"
      />
    )}
  />
  {errors.location?.postal_code && <p className="text-red-500 text-sm">{errors.location.postal_code.message}</p>}

    </div>           
            </div>
          )}

          {steps === 2 && (
            <div className="space-y-8">
              {formdata.service_lines.map((line, index) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select value={line.category} onChange={(e) => {
                    const updated = [...formdata.service_lines];
                    updated[index].category = e.target.value;
                    setFormdata({ ...formdata, service_lines: updated });
                  }} className="w-full border rounded px-3 py-2">
                    <option value="">Select Service Category</option>
                    {categories.map((cat) => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                  </select>

                  <select value={line.serviceline} onChange={(e) => {
                    const updated = [...formdata.service_lines];
                    updated[index].serviceline = e.target.value;
                    setFormdata({ ...formdata, service_lines: updated });
                  }} disabled={!line.category} className="w-full border rounded px-3 py-2">
                    <option value="">Select Subcategory</option>
                    {categories.find((cat) => cat.name === line.category)?.subcategory.map((sub) => (
                      <option key={sub.id} value={sub.name}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              ))}

              <div className="flex gap-4">
                <button type="button" onClick={() =>
                  setFormdata((prev) => ({
                    ...prev,
                    service_lines: [...prev.service_lines, { category: '', serviceline: '' }]
                  }))
                } className="bg-blue-600 text-white px-4 py-2 rounded">+ Add Service</button>

                {formdata.service_lines.length > 1 && (
                  <button type="button" onClick={() =>
                    setFormdata((prev) => ({
                      ...prev,
                      service_lines: prev.service_lines.slice(0, -1)
                    }))
                  } className="bg-red-600 text-white px-4 py-2 rounded">- Delete</button>
                )}
              </div>

              {formdata.industry_focus.map((focus, index) => (
                <div key={index}>
                  <select value={focus.category} onChange={(e) => {
                    const updated = [...formdata.industry_focus];
                    updated[index].category = e.target.value;
                    setFormdata({ ...formdata, industry_focus: updated });
                  }} className="w-full border rounded px-3 py-2">
                    <option value="">Select Industry</option>
                    {["Advertising & marketing", "Education", "Finance", "Health Care", "Technology", "Transportation", "Legal", "Other industries"]
                      .map((industry) => <option key={industry} value={industry}>{industry}</option>)}
                  </select>
                </div>
              ))}

              <div className="flex gap-4">
                <button type="button" onClick={() =>
                  setFormdata((prev) => ({
                    ...prev,
                    industry_focus: [...prev.industry_focus, { category: '' }]
                  }))
                } className="bg-blue-600 text-white px-4 py-2 rounded">+ Add Industry</button>

                {formdata.industry_focus.length > 1 && (
                  <button type="button" onClick={() =>
                    setFormdata((prev) => ({
                      ...prev,
                      industry_focus: prev.industry_focus.slice(0, -1)
                    }))
                  } className="bg-red-600 text-white px-4 py-2 rounded"> -Delete </button>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            {steps > 1 && (
              <button
                type="button"
                onClick={() => setSteps(steps - 1)}
                className="w-full sm:w-auto bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                Prev
              </button>
            )}

            {steps !== totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
