'use client'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPortfolio(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/auth/provider/portfolio/edit`, {
        method: 'POST',
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
  }


  const handleFileUpload = async(e:ChangeEvent<HTMLInputElement>,field:'thumbnail'| 'screenshot')=>{
const file = e.target.files?.[0]
if(!file) return;

const fileAllowedType = ['image/png','image/jpeg']
if(!fileAllowedType){
   alert('Only Allowed PNG and JPEG Format')
   return;
}

const MaxMBSize = 2
if(file.size > MaxMBSize *1024 *1024 ){
alert('Maximum Upload below 2MB')
return;
}

const formData = new FormData()
formData.append('file',file)
formData.append('upload_preset','profile')
formData.append('foler','company/profiles')

const res = await fetch(`https://api.cloudinary.com/v1_1/dfrfq0ch8/image/upload`,{
  method:'POST',
  body:JSON.stringify(formData)
})
const data = await res.json()
if(data.secure_url){
  setPortfolio((prev)=> ({...prev,[field]:data.secure_url}))
}

}

  return (
    <div className='max-w-4xl mx-auto mt-10'>
      <h1 className='text-3xl font-bold mb-6'>Edit Portfolio</h1>
      <form onSubmit={handleSubmit} className='space-y-6'>

        {/* Title */}
        <div>
          <label className='block mb-2 text-lg font-bold'>Title</label>
          <input
            type='text'
            name='title'
            value={portfolio.title}
            onChange={handleChange}
            className='px-4 py-2 border rounded-lg border-gray-800 w-full'
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className='block mb-2 text-lg font-bold'>Thumbnail</label>
          <input
            type='file'
            name='thumbnail'
            onChange={(e)=> handleFileUpload(e,'thumbnail')}
            className='px-4 py-2 border rounded-lg border-gray-800 w-full'
          />
        </div>

        {/* Project Links */}
        <div>
          <label className='block mb-2 text-lg font-bold'>Project Links</label>
          {portfolio.project_link.map((link, idx) => (
            <div key={idx} className='flex gap-2 mb-2'>
              <input
                type='text'
                value={link}
                onChange={(e) => handleProjectLinkChange(idx, e.target.value)}
                className='flex-1 px-4 py-2 border border-gray-800 rounded-lg'
              />
              {portfolio.project_link.length > 1 && (
                <button
                  type='button'
                  onClick={() => removeProjectLink(idx)}
                  className='text-red-500 font-bold'
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          {portfolio.project_link.length < 3 && (
            <button
              type='button'
              onClick={addProjectLink}
              className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm mt-2'
            >
              + Add another
            </button>
          )}
        </div>

        {/* Description */}
        <div>
          <label className='block mb-2 text-lg font-bold'>Description</label>
          <textarea
            name='description'
            value={portfolio.description}
            onChange={handleChange}
            rows={4}
            className='w-full px-4 py-2 border rounded-lg border-gray-800'
          />
        </div>

        {/* Timeline */}
        <div>
          <label className='block mb-2 text-lg font-bold'>Timeline</label>
          <input
            type='text'
            name='timeline'
            value={portfolio.timeline}
            onChange={handleChange}
            className='px-4 py-2 border rounded-lg border-gray-800 w-full'
          />
        </div>

        {/* Project Cost */}
        <div>
          <label className='block mb-2 text-lg font-bold'>Project Cost</label>
          <input
            type='text'
            name='project_cost'
            value={portfolio.project_cost}
            onChange={handleChange}
            className='px-4 py-2 border rounded-lg border-gray-800 w-full'
          />
        </div>

  <div>
          <label className='block mb-2 text-lg font-bold'>Screenshot</label>
          <input
            type='file'
            name='screenshot'
            onChange={(e)=> handleFileUpload(e,'thumbnail')}
            className='px-4 py-2 border rounded-lg border-gray-800 w-full'
          />
        </div>

        <button
          type='submit'
          className='bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg'
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}

export default EditPortfolioPage
