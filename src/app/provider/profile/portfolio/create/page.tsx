  // 'use client'
  // import { useSession } from 'next-auth/react'
  // import Image from 'next/image'
  // import { useRouter } from 'next/navigation'
  // import React, { useEffect } from 'react'
  // import { Controller, useForm, useFieldArray } from 'react-hook-form'

  // interface PortFolioType {
  //   title: string;
  //   thumbnail: string;
  //   project_link: { value: string }[]; // ✅ changed
  //   project_category: string;
  //   timeline: string;
  //   project_cost: string;
  //   screenshot: string;
  //   description: string;
  // }


  // const Page = () => {
  //   const { data: session } = useSession()
  //   const email = session?.user?.email || ''
  //   const router = useRouter()

  //   const {
  //     control,
  //     handleSubmit,
  //     register,
  //     formState: { errors },
  //     setValue,
  //     watch,
  //     reset,
  //   } = 
  // useForm<PortFolioType>({
  //   defaultValues: {
  //     title: '',
  //     thumbnail: '',
  //     project_link: [{ value: '' }], // ✅ changed
  //     project_category: '',
  //     timeline: '',
  //     project_cost: '',
  //     screenshot: '',
  //     description: '',
  //   },
  // });


  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: 'project_link', // ✅ now TypeScript knows it's string[]
  // });

  //   const watchThumbnail = watch('thumbnail')
  //   const watchScreenshot = watch('screenshot')

  //   const handleFileUpload = async (
  //     e: React.ChangeEvent<HTMLInputElement>,
  //     field: 'thumbnail' | 'screenshot'
  //   ) => {
  //     const file = e.target.files?.[0]
  //     if (!file) return

  //     const allowedTypes = ['image/jpeg', 'image/png']
  //     const MaxSize = 2

  //     if (!allowedTypes.includes(file.type)) {
  //       alert('Only JPG or PNG files are allowed!')
  //       return
  //     }

  //     if (file.size > MaxSize * 1024 * 1024) {
  //       alert(`File is too large. Max size: ${MaxSize}MB`)
  //       return
  //     }

  //     try {
  //       const formDataObj = new FormData()
  //       formDataObj.append('file', file)
  //       formDataObj.append('upload_preset', 'profile')
  //       formDataObj.append('folder', 'company/profiles')

  //       const res = await fetch(
  //         `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUNDINARY_CLOUD_NAME}/image/upload`,
  //         {
  //           method: 'POST',
  //           body: formDataObj,
  //         }
  //       )

  //       const data = await res.json()
  //       if (data.secure_url) {
  //         setValue(field, data.secure_url)
  //         alert('File uploaded successfully!')
  //       }
  //     } catch (error) {
  //       console.error(error)
  //       alert('Error uploading file.')
  //     }
  //   }

  // const onSubmit = async (data: PortFolioType) => {
  //   const cleanedData = {
  //     ...data,
  //     project_link: data.project_link.map((item) => item.value),
  //   };

  //   try {
  //     const res = await fetch('/api/auth/provider/portfolio/create', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         email,
  //         portfolioItem: cleanedData,
  //       }),
  //     });

  //     if (res.ok) {
  //       alert('Portfolio submitted successfully!');
  //       reset();
  //     } else {
  //       alert('Failed to submit portfolio.');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     alert('Error submitting portfolio.');
  //   }
  // };


  //   return (
  //     <div>
  //       <h1 className='text-2xl'>Add Portfolio</h1>
  //       <div className='border w-40 mt-2'></div>

  //       <form onSubmit={handleSubmit(onSubmit)} className='mt-6'>
  //         <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
  //           <div>
  //             <label className='block mb-2 text-xl'>Title</label>
  //             <Controller
  //               name='title'
  //               control={control}
  //               rules={{ required: 'Title is required' }}
  //               render={({ field }) => (
  //                 <input
  //                   {...field}
  //                   className={`px-4 py-2 w-full border ${
  //                     errors.title ? 'border-red-500' : 'border-gray-400'
  //                   }`}
  //                   placeholder='Enter portfolio title'
  //                 />
  //               )}
  //             />
  //             {errors.title && <p className='text-red-500 text-sm'>{errors.title.message}</p>}
  //           </div>

  //           <div>
  //             <label className='block mb-2 text-xl'>Thumbnail</label>
  //             <input
  //               type='file'
  //               onChange={(e) => handleFileUpload(e, 'thumbnail')}
  //               className='px-4 py-2 w-full border border-gray-400'
  //             />
  //             {watchThumbnail && (
  //               <Image
  //                 src={watchThumbnail}
  //                 width={200}
  //                 height={100}
  //                 alt='Thumbnail Preview'
  //                 className='mt-2 w-32 h-32 object-cover'
  //               />
  //             )}
  //           </div>
  //         </div>

  //       <div className='mt-6'>
  //   <label className='block mb-2 text-xl'>Project Links</label>
  // {fields.map((field, index) => (
  //   <div key={field.id} className='flex items-center gap-2 mb-2'>
  //     <input
  //       {...register(`project_link.${index}.value` as const, {
  //         required: 'Project link is required',
  //       })}
  //       className='px-4 py-2 w-full border border-gray-400'
  //     />
  //     <button
  //       type='button'
  //       onClick={() => remove(index)}
  //       className='px-2 py-1 bg-red-500 text-white rounded'
  //     >
  //       Remove
  //     </button>
  //   </div>
  // ))}




  // {fields.length < 3 && (
  //   <button
  //     type='button'
  //     onClick={() => append({ value: '' })} // ✅ correct structure

  //     className='px-4 py-2 bg-blue-500 text-white mt-2'
  //   >
  //     Add Project Link
  //   </button>
  // )}

  // </div>


  //         <div className='flex flex-col mt-6'>
  //           <label className='block mb-2'>Project Category</label>
  //           <Controller
  //             name='project_category'
  //             control={control}
  //             rules={{ required: 'Project category is required' }}
  //             render={({ field }) => (
  //               <select
  //                 {...field}
  //                 className={`w-full border rounded px-3 py-2 ${
  //                   errors.project_category ? 'border-red-500' : 'border-gray-400'
  //                 }`}
  //               >
  //                 <option value=''>Select Category</option>
  //                 <option value='Web Development'>Web Development</option>
  //                 <option value='Mobile App Development'>Mobile App Development</option>
  //                 <option value='UI/UX Design'>UI/UX Design</option>
  //                 <option value='Digital Marketing'>Digital Marketing</option>
  //                 <option value='SEO & PPC'>SEO & PPC</option>
  //                 <option value='Social Media Marketing'>Social Media Marketing</option>
  //                 <option value='Game Development'>Game Development</option>
  //                 <option value='Branding'>Branding</option>
  //                 <option value='Content Marketing'>Content Marketing</option>
  //                 <option value='IoT Development'>IoT Development</option>
  //                 <option value='Cybersecurity'>Cybersecurity</option>
  //               </select>
  //             )}
  //           />
  //           {errors.project_category && (
  //             <p className='text-red-500 text-sm'>{errors.project_category.message}</p>
  //           )}
  //         </div>

  //         <div className='flex flex-col mt-6'>
  //           <label className='block mb-2'>Timeline (Weeks)</label>
  //           <Controller
  //             name='timeline'
  //             control={control}
  //             rules={{ required: 'Timeline is required' }}
  //             render={({ field }) => (
  //               <select
  //                 {...field}
  //                 className={`w-full border rounded px-3 py-2 ${
  //                   errors.timeline ? 'border-red-500' : 'border-gray-400'
  //                 }`}
  //               >
  //                 <option value=''>Select weeks</option>
  //                 {[...Array(12)].map((_, index) => (
  //                   <option key={index} value={index + 1}>{index + 1}</option>
  //                 ))}
  //               </select>
  //             )}
  //           />
  //           {errors.timeline && <p className='text-red-500 text-sm'>{errors.timeline.message}</p>}
  //         </div>

  //         <div className='flex flex-col mt-6'>
  //           <label className='block mb-2'>Project Cost</label>
  //           <Controller
  //             name='project_cost'
  //             control={control}
  //             rules={{ required: 'Project cost is required' }}
  //             render={({ field }) => (
  //               <select
  //                 {...field}
  //                 className={`w-full border rounded px-3 py-2 ${
  //                   errors.project_cost ? 'border-red-500' : 'border-gray-400'
  //                 }`}
  //               >
  //                 <option value=''>Select Cost</option>
  //                 <option value='Not Disclosed'>Not Disclosed</option>
  //                 <option value='$0 to $10000'>$0 to $10000</option>
  //                 <option value='$10001 to $50000'>$10001 to $50000</option>
  //                 <option value='$50001 to $100000'>$50001 to $100000</option>
  //                 <option value='$100001 to $500000'>$100001 to $500000</option>
  //                 <option value='$500000+'>$500000+</option>
  //               </select>
  //             )}
  //           />
  //           {errors.project_cost && <p className='text-red-500 text-sm'>{errors.project_cost.message}</p>}
  //         </div>

  //         <div className='flex flex-col mt-6'>
  //           <label className='block mb-2 text-xl'>Screenshot</label>
  //           <input
  //             type='file'
  //             onChange={(e) => handleFileUpload(e, 'screenshot')}
  //             className='px-4 py-2 w-full border border-gray-400'
  //           />
  //           {watchScreenshot && (
  //             <Image
  //               src={watchScreenshot}
  //               width={200}
  //               height={100}
  //               alt='Screenshot Preview'
  //               className='mt-2 w-32 h-32 object-cover'
  //             />
  //           )}
  //         </div>

  //         <div className='flex flex-col mt-6'>
  //           <label className='block mb-2 text-xl'>Description</label>
  //           <Controller
  //             name='description'
  //             control={control}
  //             rules={{ required: 'Description is required' }}
  //             render={({ field }) => (
  //               <textarea
  //                 {...field}
  //                 className='px-4 py-2 w-full border border-gray-400'
  //                 placeholder='Enter project description'
  //               />
  //             )}
  //           />
  //           {errors.description && <p className='text-red-500 text-sm'>{errors.description.message}</p>}
  //         </div>

  //         <button type='submit' className='px-4 py-2 bg-green-500 text-white mt-6'>
  //           Submit
  //         </button>
  //       </form>
  //     </div>
  //   )
  // }

  // export default Page

  'use client'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { Controller, useForm, useFieldArray } from 'react-hook-form'

interface PortFolioType {
  title: string;
  thumbnail: string;
  project_link: { value: string }[];
  project_category: string;
  timeline: string;
  project_cost: string;
  screenshot: string;
  description: string;
}

const Page = () => {
  const { data: session } = useSession()
  const email = session?.user?.email || ''
  const router = useRouter()

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PortFolioType>({
    defaultValues: {
      title: '',
      thumbnail: '',
      project_link: [{ value: '' }],
      project_category: '',
      timeline: '',
      project_cost: '',
      screenshot: '',
      description: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'project_link',
  });

  const watchThumbnail = watch('thumbnail')
  const watchScreenshot = watch('screenshot')

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'thumbnail' | 'screenshot'
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png']
    const MaxSize = 2

    if (!allowedTypes.includes(file.type)) {
      alert('Only JPG or PNG files are allowed!')
      return
    }

    if (file.size > MaxSize * 1024 * 1024) {
      alert(`File is too large. Max size: ${MaxSize}MB`)
      return
    }

    try {
      const formDataObj = new FormData()
      formDataObj.append('file', file)
      formDataObj.append('upload_preset', 'profile')
      formDataObj.append('folder', 'company/profiles')

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUNDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formDataObj,
        }
      )

      const data = await res.json()
      if (data.secure_url) {
        setValue(field, data.secure_url)
        alert('File uploaded successfully!')
      }
    } catch (error) {
      console.error(error)
      alert('Error uploading file.')
    }
  }

  const onSubmit = async (data: PortFolioType) => {
    const cleanedData = {
      ...data,
      project_link: data.project_link.map((item) => item.value),
    };

    try {
      const res = await fetch('/api/auth/provider/portfolio/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          portfolioItem: cleanedData,
        }),
      });

      if (res.ok) {
        alert('Portfolio submitted successfully!');
        reset();
      } else {
        alert('Failed to submit portfolio.');
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting portfolio.');
    }
  };

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="">
      <div className="max-w-8xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">Add portfolio</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title and Thumbnail Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <Controller
                name="title"
                control={control}
                rules={{ required: 'Title is required' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter portfolio title"
                  />
                )}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
              <div className="relative">
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, 'thumbnail')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                  accept="image/*"
                />
                {/* <span className="text-xs text-gray-500 mt-1">No file chosen</span> */}
              </div>
              {watchThumbnail && (
                <Image
                  src={watchThumbnail}
                  width={200}
                  height={100}
                  alt="Thumbnail Preview"
                  className="mt-2 w-20 h-20 object-cover rounded border"
                />
              )}
            </div>
          </div>

          {/* Project Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project link</label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2 mb-2">
                <input
                  {...register(`project_link.${index}.value` as const, {
                    required: 'Project link is required',
                  })}
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project link"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="px-3 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            {fields.length < 3 && (
              <button
                type="button"
                onClick={() => append({ value: '' })}
                className="mt-2 px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
              >
                Add more links
              </button>
            )}
          </div>

          {/* Three Column Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Project Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Category</label>
              <Controller
                name="project_category"
                control={control}
                rules={{ required: 'Project category is required' }}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.project_category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a value</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="SEO & PPC">SEO & PPC</option>
                    <option value="Social Media Marketing">Social Media Marketing</option>
                    <option value="Game Development">Game Development</option>
                    <option value="Branding">Branding</option>
                    <option value="Content Marketing">Content Marketing</option>
                    <option value="IoT Development">IoT Development</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                  </select>
                )}
              />
              {errors.project_category && (
                <p className="text-red-500 text-xs mt-1">{errors.project_category.message}</p>
              )}
            </div>

            {/* Timeline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
              <Controller
                name="timeline"
                control={control}
                rules={{ required: 'Timeline is required' }}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.timeline ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select weeks</option>
                    {[...Array(12)].map((_, index) => (
                      <option key={index} value={index + 1}>
                        {index + 1} week{index > 0 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.timeline && <p className="text-red-500 text-xs mt-1">{errors.timeline.message}</p>}
            </div>

            {/* Project Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Cost</label>
              <Controller
                name="project_cost"
                control={control}
                rules={{ required: 'Project cost is required' }}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.project_cost ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Cost</option>
                    <option value="Not Disclosed">Not Disclosed</option>
                    <option value="$0 to $10000">$0 to $10,000</option>
                    <option value="$10001 to $50000">$10,001 to $50,000</option>
                    <option value="$50001 to $100000">$50,001 to $100,000</option>
                    <option value="$100001 to $500000">$100,001 to $500,000</option>
                    <option value="$500000+">$500,000+</option>
                  </select>
                )}
              />
              {errors.project_cost && <p className="text-red-500 text-xs mt-1">{errors.project_cost.message}</p>}
            </div>
          </div>

          {/* Screenshot */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Screenshot</label>
            <div className="relative">
              <input
                type="file"
                onChange={(e) => handleFileUpload(e, 'screenshot')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                accept="image/*"
              />
              <span className="text-xs text-gray-500 mt-1">No file chosen</span>
            </div>
            {watchScreenshot && (
              <Image
                src={watchScreenshot}
                width={200}
                height={100}
                alt="Screenshot Preview"
                className="mt-2 w-32 h-32 object-cover rounded border"
              />
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <Controller
              name="description"
              control={control}
              rules={{ required: 'Description is required' }}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter project description"
                />
              )}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-start gap-4 pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Page
