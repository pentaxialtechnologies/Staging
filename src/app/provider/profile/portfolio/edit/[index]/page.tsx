// 'use client'
// import { useSession } from 'next-auth/react'
// import { useParams, useRouter } from 'next/navigation'
// import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'

// interface PortfolioType {
//   title: string
//   thumbnail: string
//   project_link: string[]
//   project_category: string
//   timeline: string
//   project_cost: string
//   screenshot: string
//   description: string
// }

// const EditPortfolioPage = () => {
//   const { index } = useParams<{ index: string }>()
//   const router = useRouter()
//   const { data: session } = useSession()
//   const id = session?.user.id

//   const [portfolio, setPortfolio] = useState<PortfolioType>({
//     title: '',
//     description: '',
//     project_category: '',
//     project_cost: '',
//     project_link: [''],
//     screenshot: '',
//     thumbnail: '',
//     timeline: '',
//   })

//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await fetch(`/api/auth/provider/portfolio/${id}`)
//       if (res.ok) {
//         const data = await res.json()
//         const item = data.portfolio[parseInt(index)]
//         setPortfolio(item)
//       }
//     }
//     if (id && index) fetchData()
//   }, [id, index])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setPortfolio(prev => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault()
//     try {
//       const res = await fetch(`/api/auth/provider/portfolio/edit`, {
//         method: 'POST',
//         body: JSON.stringify({ id, index: parseInt(index), portfolio })
//       })
//       if (res.ok) {
//         alert('Portfolio updated successfully.')
//         router.push('/provider/profile/portfolio')
//       } else {
//         alert('Update failed.')
//       }
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   const addProjectLink = () => {
//     setPortfolio(prev => ({
//       ...prev,
//       project_link: [...prev.project_link, '']
//     }))
//   }

//   const removeProjectLink = (linkIndex: number) => {
//     setPortfolio(prev => ({
//       ...prev,
//       project_link: prev.project_link.filter((_, idx) => idx !== linkIndex)
//     }))
//   }

//   const handleProjectLinkChange = (linkIndex: number, value: string) => {
//     setPortfolio(prev => {
//       const updatedLinks = [...prev.project_link]
//       updatedLinks[linkIndex] = value
//       return { ...prev, project_link: updatedLinks }
//     })
//   }


//   const handleFileUpload = async(e:ChangeEvent<HTMLInputElement>,field:'thumbnail'| 'screenshot')=>{
// const file = e.target.files?.[0]
// if(!file) return;

// const fileAllowedType = ['image/png','image/jpeg']
// if(!fileAllowedType){
//    alert('Only Allowed PNG and JPEG Format')
//    return;
// }

// const MaxMBSize = 2
// if(file.size > MaxMBSize *1024 *1024 ){
// alert('Maximum Upload below 2MB')
// return;
// }

// const formData = new FormData()
// formData.append('file',file)
// formData.append('upload_preset','profile')
// formData.append('foler','company/profiles')

// const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUNDINARY_CLOUD_NAME}/image/upload`,{
//   method:'POST',
//   body:JSON.stringify(formData)
// })
// const data = await res.json()
// if(data.secure_url){
//   setPortfolio((prev)=> ({...prev,[field]:data.secure_url}))
// }

// }

//   return (
//     <div className='max-w-4xl mx-auto mt-10'>
//       <h1 className='text-3xl font-bold mb-6'>Edit Portfolio</h1>
//       <form onSubmit={handleSubmit} className='space-y-6'>

//         {/* Title */}
//         <div>
//           <label className='block mb-2 text-lg font-bold'>Title</label>
//           <input
//             type='text'
//             name='title'
//             value={portfolio.title}
//             onChange={handleChange}
//             className='px-4 py-2 border rounded-lg border-gray-800 w-full'
//           />
//         </div>

//         {/* Thumbnail */}
//         <div>
//           <label className='block mb-2 text-lg font-bold'>Thumbnail</label>
//           <input
//             type='file'
//             name='thumbnail'
//             onChange={(e)=> handleFileUpload(e,'thumbnail')}
//             className='px-4 py-2 border rounded-lg border-gray-800 w-full'
//           />
//         </div>

//         {/* Project Links */}
//         <div>
//           <label className='block mb-2 text-lg font-bold'>Project Links</label>
//           {portfolio.project_link.map((link, idx) => (
//             <div key={idx} className='flex gap-2 mb-2'>
//               <input
//                 type='text'
//                 value={link}
//                 onChange={(e) => handleProjectLinkChange(idx, e.target.value)}
//                 className='flex-1 px-4 py-2 border border-gray-800 rounded-lg'
//               />
//               {portfolio.project_link.length > 1 && (
//                 <button
//                   type='button'
//                   onClick={() => removeProjectLink(idx)}
//                   className='text-red-500 font-bold'
//                 >
//                   ✕
//                 </button>
//               )}
//             </div>
//           ))}

//           {portfolio.project_link.length < 3 && (
//             <button
//               type='button'
//               onClick={addProjectLink}
//               className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm mt-2'
//             >
//               + Add another
//             </button>
//           )}
//         </div>

//         {/* Description */}
//         <div>
//           <label className='block mb-2 text-lg font-bold'>Description</label>
//           <textarea
//             name='description'
//             value={portfolio.description}
//             onChange={handleChange}
//             rows={4}
//             className='w-full px-4 py-2 border rounded-lg border-gray-800'
//           />
//         </div>

//         {/* Timeline */}
//         <div>
//           <label className='block mb-2 text-lg font-bold'>Timeline</label>
//           <input
//             type='text'
//             name='timeline'
//             value={portfolio.timeline}
//             onChange={handleChange}
//             className='px-4 py-2 border rounded-lg border-gray-800 w-full'
//           />
//         </div>

//         {/* Project Cost */}
//         <div>
//           <label className='block mb-2 text-lg font-bold'>Project Cost</label>
//           <input
//             type='text'
//             name='project_cost'
//             value={portfolio.project_cost}
//             onChange={handleChange}
//             className='px-4 py-2 border rounded-lg border-gray-800 w-full'
//           />
//         </div>

//   <div>
//           <label className='block mb-2 text-lg font-bold'>Screenshot</label>
//           <input
//             type='file'
//             name='screenshot'
//             onChange={(e)=> handleFileUpload(e,'thumbnail')}
//             className='px-4 py-2 border rounded-lg border-gray-800 w-full'
//           />
//         </div>

//         <button
//           type='submit'
//           className='bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg'
//         >
//           Save Changes
//         </button>
//       </form>
//     </div>
//   )
// }

// export default EditPortfolioPage


'use client'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import Image from 'next/image'

interface PortfolioType {
  title: string
  thumbnail: string
  project_link: string[]
  project_category: string
  timeline: string
  project_cost: string
  screenshot: string
  description: string
}

const EditPortfolioPage = () => {
  const { index } = useParams<{ index: string }>()
  const router = useRouter()
  const { data: session } = useSession()
  const id = session?.user.id

  const [portfolio, setPortfolio] = useState<PortfolioType>({
    title: '',
    description: '',
    project_category: '',
    project_cost: '',
    project_link: [''],
    screenshot: '',
    thumbnail: '',
    timeline: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/auth/provider/portfolio/${id}`)
      if (res.ok) {
        const data = await res.json()
        const item = data.portfolio[parseInt(index)]
        setPortfolio(item)
      }
    }
    if (id && index) fetchData()
  }, [id, index])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!portfolio.title.trim()) newErrors.title = 'Title is required'
    if (!portfolio.project_category) newErrors.project_category = 'Project category is required'
    if (!portfolio.timeline) newErrors.timeline = 'Timeline is required'
    if (!portfolio.project_cost) newErrors.project_cost = 'Project cost is required'
    if (!portfolio.description.trim()) newErrors.description = 'Description is required'
    
    // Check if any project link is filled
    if (portfolio.project_link.every(link => !link.trim())) {
      newErrors.project_link = 'At least one project link is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setPortfolio(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      const res = await fetch(`/api/auth/provider/portfolio/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, index: parseInt(index), portfolio })
      })
      if (res.ok) {
        alert('Portfolio updated successfully.')
        router.push('/provider/profile/portfolio')
      } else {
        alert('Update failed.')
      }
    } catch (error) {
      console.error(error)
      alert('Error updating portfolio.')
    }
  }

  const addProjectLink = () => {
    setPortfolio(prev => ({
      ...prev,
      project_link: [...prev.project_link, '']
    }))
  }

  const removeProjectLink = (linkIndex: number) => {
    setPortfolio(prev => ({
      ...prev,
      project_link: prev.project_link.filter((_, idx) => idx !== linkIndex)
    }))
  }

  const handleProjectLinkChange = (linkIndex: number, value: string) => {
    setPortfolio(prev => {
      const updatedLinks = [...prev.project_link]
      updatedLinks[linkIndex] = value
      return { ...prev, project_link: updatedLinks }
    })
    
    // Clear project link error when user starts typing
    if (errors.project_link) {
      setErrors(prev => ({ ...prev, project_link: '' }))
    }
  }

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, field: 'thumbnail' | 'screenshot') => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileAllowedType = ['image/png', 'image/jpeg']
    if (!fileAllowedType.includes(file.type)) {
      alert('Only PNG and JPEG formats are allowed')
      return
    }

    const MaxMBSize = 2
    if (file.size > MaxMBSize * 1024 * 1024) {
      alert('Maximum upload size is 2MB')
      return
    }

    try {
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
        setPortfolio((prev) => ({ ...prev, [field]: data.secure_url }))
        alert('File uploaded successfully!')
      }
    } catch (error) {
      console.error(error)
      alert('Error uploading file.')
    }
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">Edit Portfolio</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title and Thumbnail Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={portfolio.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter portfolio title"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
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
                <span className="text-xs text-gray-500 mt-1">No file chosen</span>
              </div>
              {portfolio.thumbnail && (
                <Image
                  src={portfolio.thumbnail}
                  width={200}
                  height={100}
                  alt="Thumbnail Preview"
                  className="mt-2 w-20 h-20 object-cover rounded border"
                />
              )}
            </div>
          </div>

          {/* Project Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Links</label>
            {portfolio.project_link.map((link, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={link}
                  onChange={(e) => handleProjectLinkChange(idx, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project link"
                />
                {portfolio.project_link.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProjectLink(idx)}
                    className="px-3 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            {errors.project_link && <p className="text-red-500 text-xs mt-1">{errors.project_link}</p>}
            {portfolio.project_link.length < 3 && (
              <button
                type="button"
                onClick={addProjectLink}
                className="mt-2 px-4 py-2 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 transition-colors"
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
              <select
                name="project_category"
                value={portfolio.project_category}
                onChange={handleChange}
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
              {errors.project_category && <p className="text-red-500 text-xs mt-1">{errors.project_category}</p>}
            </div>

            {/* Timeline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
              <select
                name="timeline"
                value={portfolio.timeline}
                onChange={handleChange}
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
              {errors.timeline && <p className="text-red-500 text-xs mt-1">{errors.timeline}</p>}
            </div>

            {/* Project Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Cost</label>
              <select
                name="project_cost"
                value={portfolio.project_cost}
                onChange={handleChange}
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
              {errors.project_cost && <p className="text-red-500 text-xs mt-1">{errors.project_cost}</p>}
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
            {portfolio.screenshot && (
              <Image
                src={portfolio.screenshot}
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
            <textarea
              name="description"
              value={portfolio.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter project description"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPortfolioPage