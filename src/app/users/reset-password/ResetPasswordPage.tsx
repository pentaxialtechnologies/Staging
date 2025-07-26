'use client'
import CompanyHeader from '@/Components/CompanyHeader'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { FormEvent, useState } from 'react'

const ResetPasswordPageForm = () => {
    const [form,setForm] = useState({
        email:'',
        password:'',
       

    })
    const [Confirm,setConfirm] = useState('')

    const [error,setError] = useState('')
    const [Status,setStatus] = useState('')

const searchParams = useSearchParams()
const token = searchParams.get('token')
const router = useRouter()

const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const {name,value} = e.target;
    setForm({...form,[name]: value})
}

const handleSubmit =async(e:FormEvent)=>{
    e.preventDefault();
 setError('')
 setStatus('')
   if (!form.email || !form.password || !Confirm) {
    setError('All fields are required');
      return;
    }

    if(form.password !== Confirm){
        setError('Password does not match')
        return;
    }
    try{
const res = await fetch('/api/auth/reset-password/confirm',{
    method:'POST',
    headers:{
        'content-type':'application/json'
    },
    body:JSON.stringify({...form,token,})
})

if(!res.ok){
    const data = await res.json()
    throw new Error(data.message || 'something went Wrong')
}
setStatus('Password has been Reset successfully')
setTimeout(()=> router.push('/users/login'),2000)
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch(error:any){
       setError(error.message)
        
    }
}

  return (
   <>
   <CompanyHeader/>
<div className='max-w-6xl mx-auto px-4 sm:px-6 lg-10 flex justify-center mt-5 mb-5'>
    <div className='bg-white shadow-md border rounded-lg p-8 max-w-xl  '>
        <h1 className='text-2xl font-bold text-center mb-6'>Reset Password with TrueFirms Account</h1>
        
        {Status && <p className='text-green-600 text-xl'>{Status}</p>}
        {error && <p className='text-red-500 text-xl'>{error}</p>}
        <form className='flex flex-col' onSubmit={handleSubmit}>
            <div className=''>
                <label className='block text-sm font-medium mb-1'>E-Mail Address</label>
                <input type='email' name='email' value={form.email} onChange={handleChange}  className='px-4 py-2 border border-gray-400 w-full  focus:outline-none rounded'/>
            </div>
              <div className=''>
                <label className='text-sm'>New Password</label>
                <input type='text' name='password' value={form.password} onChange={handleChange} className='px-4 py-2 border border-gray-400 w-full  focus:outline-none rounded'/>
            </div>
              <div className=''>
                <label className='text-sm'>Confirm Password</label>
                <input type='text' name='Confirm' value={Confirm} onChange={(e)=> setConfirm(e.target.value)} className='px-4 py-2 border border-gray-400 w-full  focus:outline-none rounded'/>
            </div>
            <button type='submit' className='text-white bg-blue-500 px-4 py-2 mt-4'>Reset Password</button>
        </form>
    </div>
</div>
   </>
  )
}

export default ResetPasswordPageForm