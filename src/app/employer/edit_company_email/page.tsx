'use client'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

interface EmailChange {
    email:string
    newEmail:string
    verificationCode:string
    }

const Page = () => {
    const router = useRouter()
const {data:session} = useSession()

const userId = session?.user.id
console.log(userId,'User Id');

const [FormData,setFormData] = useState<EmailChange>({
    email:'',
    newEmail:'',
    verificationCode:''
})

const [loading,setloading] = useState(false)
const [Resendloading,setResendloading] = useState(false)
const [codesent,setcodesent] = useState(false)


const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
const {name,value} = e.target
setFormData({...FormData,[name]: value})
}


const handleEmailChange = async()=>{    
    if(!FormData.email || !FormData.newEmail){
        alert('Please fill both old and new Email')
        return;
    }
    try{
const send = await fetch('/api/auth/employer/change-email',{
    method:'POST',
    body:JSON.stringify({userId:userId,email:FormData.email,newEmail:FormData.newEmail})
})
    const data = await send.json()

if(send.ok){
alert('Email verification code sent to your new email!')
setcodesent(true)
}else 
{
alert(data.message || 'Failed to send verification code')
}
}
catch(error){
        console.error(error);
        alert('Server error, please try again later.')
}
finally{
setloading(false)
}
}


const handleSubmit =async(e:React.FormEvent)=>{
    e.preventDefault()
    if(!FormData.verificationCode){
        alert('Please enter verifcation Code')
        return;
    }
    setloading(true)
    try{
const verify = await fetch('/api/auth/employer/change-email/verify-code',{
    method:'POST',
    body:JSON.stringify({userId:userId,verificationCode:FormData.verificationCode})
})

    const data = await verify.json()
    if(data.message === 'Email updated successfully'){
    alert('Email updated successfully!');
await signOut({callbackUrl:'/users/login'})
    } else 
    {
    alert(data.message);
    }
    }
    catch(error){
        console.error(error);   
        alert('Server error, please try again later.')
    }
    finally {
      setloading(false)
    }
}
 const handleResendCode = async () => {
    if (!FormData.email || !FormData.newEmail) {
      alert('Please enter both old and new email to resend.')
      return
    }

    setResendloading(true)
    try {
      const resend = await fetch('/api/auth/employer/change-email', {
        method: 'POST',
        body: JSON.stringify({
          userId: userId,
          email: FormData.email,
          newEmail: FormData.newEmail
        })
      })

      const data = await resend.json()

      if (resend.ok) {
        alert('Verification code resent successfully!')
      } else {
        alert(data.message || 'Failed to resend verification code.')
      }
    } catch (error) {
      console.error(error)
      alert('Server error while resending code.')
    } finally {
      setResendloading(false)
    }
  }


  return (
    <div>
        <div>
            <h1 className='text-2xl'>Listing - Change Email</h1>
            <button onClick={()=> router.push('/employer/setting')} className='bg-orange-600 text-white px-4 py-2 mt-4 w-20 rounded-full mb-5'>Back</button>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
                        <div>
                        <label className='block mb-2 text-xl'>Enter your old E-mail:</label>
                        <input type='text' name='email' value={FormData.email} placeholder='Enter your old E-mail:' onChange={handleChange} className='w-full px-4 py-2 border border-gray-800' />
                        </div>
                        <div>
                        <label className='block mb-2 text-xl'>Enter your new E-mail:</label>
                        <input type='text' name='newEmail'  value={FormData.newEmail} placeholder='New E-mail:' onChange={handleChange} className='w-full px-4 py-2 border border-gray-800' />
                        <div className='flex items-center justify-end mt-2'>
                        <button disabled={loading} onClick={handleEmailChange} className='bg-orange-600 text-white px-4 py-2 rounded-full'>{loading ?'sending': 'Send Verification Code'}</button>
                        </div>
                        </div>
                    </div>
                    {codesent && (
                        <div>
                        <label className='block mb-2 text-xl mt-5'>Enter Verification Code:</label>
                        <input type='text' name='verificationCode'  value={FormData.verificationCode} placeholder='Confirm New E-mail:' onChange={handleChange} className='w-90 px-4 py-2 border border-gray-800' />
                       <div className='flex items-center justify-between mt-2'>
                        <button disabled={Resendloading} onClick={handleResendCode} className='bg-blue-600 text-white px-4 py-2 rounded-full'>
                            {Resendloading ? 'Resending...': 'Resend Code'}
                        </button>
                       </div>
                        </div>
                    )}
                    {codesent && (
                        <button type='submit' disabled={loading} className='bg-orange-700 px-4 py-2 text-white rounded-full mt-5'>{loading ? 'Updating': 'Change Email'}</button>

                    )}

                </form>
            </div>
        </div>
    </div>
  )
}

export default Page
