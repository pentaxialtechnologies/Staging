'use client';

import React, {  useState } from 'react';
import banner from "../../../../public/forgot.webp";
import CompanyHeader from '@/components/CompanyHeader';
import Image from 'next/image';
import { useRouter } from 'next/navigation';



const Page = () => {
const [status,setStatus] = useState('')
const [email,setEmail] = useState('')
const router = useRouter()

const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
setEmail(e.target.value)
}


const handleSubmit= async(e:React.FormEvent)=>{
    e.preventDefault();
    try{
const res = await fetch('/api/auth/reset-password',{
    method:'POST',
    headers:{
        'content-Type':'application/json'
    },
    body:JSON.stringify({email})
})
if(res.status === 404){
    setStatus('if email account is not in our database')
}
if(res.ok){
setStatus('We have emailed your password reset link!')
}

    }
    catch(error){
        console.error(error);
        
    }
}


  return (
    <>
      <CompanyHeader />
      <p className='text-green-900 text-xl text-center font-bold'>{status}</p>
      <div className='min-h-screen px-4 py-2 sm:px-6 lg:px-10'>
        <div className='flex items-center justify-center py-10'>
            
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='bg-white shadow-md p-6 border border-gray-200'>
              <h1 className='mt-5 text-xl font-bold'>
                Forgot Password with TrueFirms Account
              </h1>
              <form className='py-20' onSubmit={handleSubmit}>
                <input
                  type='email'
                  value={email}
                  name='email' 
                  onChange={handleChange}
                  placeholder='Please enter your registered email'
                  className='w-full border focus:outline-none rounded border-gray-400 px-4 py-2'
                />
                <div className='flex items-center justify-between mt-8  '>
                  <button onClick={()=> router.push('/users/login')}
                    type='button'
                    className='bg-orange-600 text-white px-4 py-2 rounded-full'
                  >
                    Back
                  </button>
                  <button
                    type='submit'
                    className='bg-green-600 text-white px-4 py-2 rounded-full'
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
            <div className='flex items-center justify-center'>
              <Image src={banner} alt='Forgot Password Illustration' width={300} height={300} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
