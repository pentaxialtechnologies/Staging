'use client'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useState } from 'react'

interface PortFolioType {
  title: string
  thumbnail: string
  project_link: string[]
  project_category: string
  timeline: string
  project_cost: string
  screenshot: string
  description: string
}

const Page = () => {
  const [portfolioData, setPortfolioData] = useState<PortFolioType>({
    title: '',
    thumbnail: '',
    project_link: [''],
    project_category: '',
    timeline: '',
    project_cost: '',
    screenshot: '',
    description: ''
  })
const {data:session} = useSession()
const email = session?.user.email
console.log(email,"email");


  const AddProject = () => {
    if (portfolioData.project_link.length < 3) {
      setPortfolioData(prev => ({
        ...prev,
        project_link: [...prev.project_link, '']
      }))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setPortfolioData(prev => ({ ...prev, [name]: value }))
  }

  const handleProjectLinkChange = (index: number, value: string) => {
    const UpdatedLinks = [...portfolioData.project_link]
    UpdatedLinks[index] = value
    setPortfolioData(prev => ({ ...prev, project_link: UpdatedLinks }))
  }

  const removeProjectLink = (index: number) => {
    const UpdatedLinks = portfolioData.project_link.filter((_, i) => i !== index)
    setPortfolioData(prev => ({ ...prev, project_link: UpdatedLinks }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'thumbnail' | 'screenshot') => {
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

      const res = await fetch('https://api.cloudinary.com/v1_1/dfrfq0ch8/image/upload', {
        method: 'POST',
        body: formDataObj
      })

      const data = await res.json()
      if (data.secure_url) {
        setPortfolioData(prev => ({
          ...prev,
          [field]: data.secure_url
        }))
        alert('File uploaded successfully!')
      }
    } catch (error) {
      console.error(error)
      alert('Error uploading file.')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Form Submitted:', portfolioData)

    try {
      const res = await fetch('/api/auth/provider/portfolio/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        email: email, 
        portfolioItem: portfolioData 
        })
      })

      if (res.ok) {
        alert('Portfolio submitted successfully!')
        setPortfolioData({
          title: '',
          thumbnail: '',
          project_link: [''],
          project_category: '',
          timeline: '',
          project_cost: '',
          screenshot: '',
          description: ''
        })
      } else {
        alert('Failed to submit portfolio.')
      }
    } catch (error) {
      console.error(error)
      alert('Error submitting portfolio.')
    }
  }

  return (
    <div>
      <div>
        <h1 className='text-2xl'>Add Portfolio</h1>
        <div className='border w-40 mt-2'></div>

        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 mt-7'>
            {/* Title */}
            <div>
              <label className='block mb-2 text-xl'>Title</label>
              <input
                type='text'
                name='title'
                value={portfolioData.title}
                onChange={handleInputChange}
                className='px-4 py-2 w-full border border-gray-400'
              />
            </div>

            {/* Thumbnail */}
            <div>
              <label className='block mb-2 text-xl'>Thumbnail</label>
              <input
                type='file'
                onChange={(e) => handleFileUpload(e, 'thumbnail')}
                className='px-4 py-2 w-full border border-gray-400'
              />
              {portfolioData.thumbnail && (
                <Image src={portfolioData.thumbnail} alt="Thumbnail Preview" className="mt-2 w-32 h-32 object-cover" />
              )}
            </div>
          </div>

          {/* Project Links */}
          <div className='mt-6'>
            <label className='block mb-2 text-xl'>Project Links</label>
            {portfolioData.project_link.map((link, index) => (
              <div key={index} className='mb-2 flex items-center gap-2'>
                <input
                  type='text'
                  value={link}
                  onChange={(e) => handleProjectLinkChange(index, e.target.value)}
                  className='px-4 py-2 w-full border border-gray-400'
                />
                <button
                  type='button'
                  onClick={() => removeProjectLink(index)}
                  className='px-2 py-1 bg-red-500 text-white rounded'
                >
                  Remove
                </button>
              </div>
            ))}
            {portfolioData.project_link.length < 3 && (
              <button
                type='button'
                onClick={AddProject}
                className='px-4 py-2 bg-blue-500 text-white mt-2'
              >
                Add Project Link
              </button>
            )}
          </div>

          {/* Project Category */}
          <div className='flex flex-col mt-6'>
            <label className='block mb-2'>Project Category</label>
            <select name='project_category' className="w-full border rounded px-3 py-2" value={portfolioData.project_category} onChange={handleInputChange}>
              <option value="">Select a value</option>
              {/* Category Options */}
              {/* ... keep your existing options */}
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
          </div>

          {/* Timeline */}
          <div className='flex flex-col mt-6'>
            <label className='block mb-2'>Timeline (Weeks)</label>
            <select name='timeline' className="w-full border rounded px-3 py-2" value={portfolioData.timeline} onChange={handleInputChange}>
              <option disabled>Select weeks</option>
              {[...Array(12)].map((_, index) => (
                <option key={index} value={index + 1}>{index + 1}</option>
              ))}
            </select>
          </div>

          {/* Project Cost */}
          <div className='flex flex-col mt-6'>
            <label className='block mb-2'>Project Cost</label>
            <select name='project_cost' className="w-full border rounded px-3 py-2" value={portfolioData.project_cost} onChange={handleInputChange}>
              <option  disabled>Select Cost</option>
              <option value="Not Disclosed">Not Disclosed</option>
              <option value="$0 to $10000">$0 to $10000</option>
              <option value="$10001 to $50000">$10001 to $50000</option>
              <option value="$50001 to $100000">$50001 to $100000</option>
              <option value="$100001 to $500000">$100001 to $500000</option>
              <option value="$500000+">$500000+</option>
            </select>
          </div>

          {/* Screenshot Upload */}
          <div className='flex flex-col mt-6'>
            <label className='block mb-2 text-xl'>Screenshot</label>
            <input
              type='file'
              onChange={(e) => handleFileUpload(e, 'screenshot')}
              className='px-4 py-2 w-full border border-gray-400'
            />
            {portfolioData.screenshot && (
              <Image src={portfolioData.screenshot} alt="Screenshot Preview" className="mt-2 w-32 h-32 object-cover" />
            )}
          </div>

          {/* Description */}
          <div className='flex flex-col mt-6'>
            <label className='block mb-2 text-xl'>Description</label>
            <input
              type='text'
              name='description'
              value={portfolioData.description}
              onChange={handleInputChange}
              className='px-4 py-2 w-full border border-gray-400'
            />
          </div>

          {/* Submit Button */}
          <button type='submit' className='px-4 py-2 bg-green-500 text-white mt-6'>
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default Page
