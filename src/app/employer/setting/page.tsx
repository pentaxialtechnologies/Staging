'use client'

import {  ArrowRight, CircleCheckIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'


interface Profile {
   companylogo:string 
   firstname:string
   lastname:string
   email:string
}

interface User{
    userprofile:string
    firstname:string
}

const Page = () => {
    const [userdata,setuserdata] = useState<Profile | null>(null)
const [user,setUser] = useState<User | null>(null)
    const {data:session} = useSession()
    const userId = session?.user.id
    const router = useRouter()
useEffect(()=>{
    const fetchdata = async()=>{
        const res = await fetch('/api/auth/user/session')
        const data = await res.json()
        console.log(data.user,"datas");
        setuserdata(data.user) 
    console.log('user details',data.user);

    }

    // const fetchUser = async()=>{
    //  const res = await fetch(`/api/auth/employer/userprofile/update/${userId}`)   
    // const data = await res.json()
    // setUser(data.user)
    // }
    fetchdata()
    // fetchUser()
},[userId])

  return (
    <div className='bg-white max-w-5xl mx-auto '>
        <div className='bg-white shadow rounded border p-6 border-gray-100'>
           <div>
            <h1 className='text-2xl'>Account Info</h1>
            <div className='border border-gray-500 mt-1 w-40'></div>
{userdata && (
    <div>
        <div  className='flex flex-row mt-5 gap-6'>
<div>
  
</div>
<div>
    {userdata && (
    <h1 className='text-2xl font-bold'>{userdata.firstname} {userdata.lastname}</h1>
      )}
    <button onClick={()=> router.push('/employer/profile')} className='px-4 py-2 bg-[#f27264] text-white mt-3 rounded-full hover:cursor-pointer'> Edit Profile</button>
    </div>
</div>
<div className='flex items-center justify-between mt-8 bg-white shadow-md border p-4 border-gray-300'>
<div>
<h1 className='font-bold'>Change Email Address</h1>
<p className='text-xl'>{userdata.email}</p>
    </div>

    <div className='flex flex-row items-center justify-center gap-2'>    
 <CircleCheckIcon size={16} className='bg-green-600'/>
    <p>Verified</p>
    
    <button className='' onClick={()=> router.push('/employer/edit_company_email')}><ArrowRight size={16}/></button>
    </div>
    </div>
<div className='flex items-center justify-between mt-8 bg-white shadow-md border p-4 border-gray-300'>
<div>
<h1 className='font-bold'>Change Password</h1>
<p className='text-xl'>Changing your password regularly reduces your risk.</p>
    </div>

    <div className='flex flex-row items-center justify-center gap-2'>    

    <button onClick={()=> router.push('/employer/change_company_password')}><ArrowRight size={16}/></button>
    </div>
    </div>
        </div>

)}

           </div>
                   </div>
    </div>
  )
}

export default Page