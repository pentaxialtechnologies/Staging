

'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
interface User {
oldpassword:string
newpassword:string
confirmpassword:string
}

const Page = () => {
    const router = useRouter()
const [formData,setformData] = useState<User>({
        oldpassword:"",
        newpassword:'',
        confirmpassword:''
    })
const {data:session} = useSession()
const userId = session?.user.id
console.log(userId,'userID');

const handleChange =(e:React.ChangeEvent<HTMLInputElement>)=>{
const {name,value} = e.target;
setformData((prev)=> ({...prev,[name]: value}))
}

const handleChangePassword = async(e:React.FormEvent)=>{
    e.preventDefault()
    if(formData.newpassword !== formData.confirmpassword){
    alert('New password and confirm password do not match.');
    return;
    }
    try{
const res = await fetch('/api/auth/employer/change-password',{
    method:'POST',
    headers:{
        'content-Type': 'application/json'
    },
    body:JSON.stringify({userId:userId,oldpassword: formData.oldpassword,newpassword:formData.newpassword})
})
    const data = await res.json()
if(res.ok){
    alert('password changed Successfully!')
    router.push('/employer/dashboard');
}
else {
        alert(data.message);
      }
    }
    catch(error){
        console.error(error);
    }
}

return (
    <div>
   <div>
    <h1 className='text-2xl'>Listing - Change Password</h1>
  <button onClick={()=> router.push('/employer/setting')} className='bg-orange-600 text-white px-4 py-2 mt-4 w-20 rounded-full mb-5'>Back</button>
   <div>
   <form onSubmit={handleChangePassword} className=''>
  <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
    <div>
    <label className='block mb-2 text-xl'>Enter your old Password::</label>
    <input type='text' name='oldpassword' value={formData.oldpassword} onChange={handleChange} placeholder='Enter your old E-mail:' className='w-full px-4 py-2 border border-gray-800' />
   </div>
   <div>
   <label className='block mb-2 text-xl'>Enter your new Password::</label>       <input type='text' name='newpassword' value={formData.newpassword} onChange={handleChange} placeholder='New E-mail:' className='w-full px-4 py-2 border border-gray-800' />
</div>
     </div>
<div>
    <label className='block mb-2 text-xl mt-5'>Enter your new Password again to confirm:</label>
           <input type='text' name='confirmpassword' value={formData.confirmpassword} onChange={handleChange} placeholder='Confirm New E-mail:' className='w-90 px-4 py-2 border border-gray-800' />
 </div>
  <button type='submit' className='bg-orange-700 px-4 py-2 text-white rounded-lg mt-5'>Change Password</button>
   </form>
   </div>
 </div>
    </div>
  )
}

export default Page