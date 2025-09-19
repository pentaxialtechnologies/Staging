'use client'
import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Editor from '../../../../Components/Editor'
import toast,{Toaster} from 'react-hot-toast'
interface ITicket {
    ticketname:string
    priority_status:string
    ticket_type:string
    ticket_description:string
}

const page = () => {
    const {id} = useParams()
    const [FormData,setFormData] = useState<ITicket>({
        ticketname:'',
        priority_status:'',
        ticket_type:'',
        ticket_description:'',
    })  
    

const handleSubmit = async(e:React.FormEvent)=>{
e.preventDefault()
try{
const res = await fetch("/api/auth/ticket/create",{
    method:'POST',
    headers:{
        'Content-Type':'application/json'
    },
    body:JSON.stringify({...FormData,userId:id})
})

if(!res.ok){
    throw new Error('Failed to Create Ticket')
}
const data = await res.json()
console.log(data,'data');
toast.success('Ticket Created Successfully!')
}
catch(error){
    console.error(error);
}
finally{
    setFormData({
        ticketname:'',
        priority_status:'',
        ticket_type:'',
        ticket_description:'',
    })
}
}


const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>{
const {name,value} = e.target;
setFormData((prev)=> ({...prev,[name]: value}))
}

  return (
    <div>
        <Toaster/>
        <div>
            <h1 className='text-2xl font-bold mb-4'>Create Support Ticket</h1>
            <div className='flex items-center'>
                <form onSubmit={handleSubmit} className='mt-6 w-full'>
            <div>
             <label className='block mb-4 text-xl font-semibold'>Ticket Name</label>
             <input type='text' name='ticketname' placeholder='Ticket name' value={FormData.ticketname}  onChange={handleChange} className='px-4 py-2 border rounded w-full'/>
                    </div>
            <div>
             <label className='block mb-4 mt-4'>Priority</label>
                  <select  value={FormData.priority_status} onChange={(e)=> setFormData((prev)=> ({...prev,priority_status:e.target.value}))} className='px-4 py-2 border rounded w-full'>
                   <option value=''>Select Priority</option>

                  <option value='Low'>Low</option>
                 <option value='Medium'>Medium</option>
                <option value='High'>High</option>
                        </select>
                  </div>
                     <div>
                   <label className='block mb-4 mt-4'>Ticket Type</label>
                   <select name='ticket_type' value={FormData.ticket_type} onChange={(e)=> setFormData((prev)=> ({...prev,ticket_type:e.target.value}))} className='px-4 py-2 border rounded w-full'>
                   <option value=''>Select Type</option>
                   <option value='Job Posting'>Job Posting</option>
                       <option value='Proposal'>Proposal</option>
                     <option value='Regulatory'>Regulatory</option>
                     <option value='Compliance'>Compliance</option>
                    <option value='Contractual'>Contractual</option>
                  <option value='NDA requirements'>NDA requirements</option>
                        </select>
                    </div>
                <div >
                    <label className='block mb-4 mt-4'>Description</label>
                <Editor placeholder='Enter Your queries here'  onChange={(html)=>setFormData((prev)=> ({...prev,ticket_description:html}))}  description={FormData.ticket_description}/>
                </div>

                <div>
                    <button type='submit' className='bg-green-700 text-white text-xl  w-full px-4 py-2 border rounded mt-15'>Submit</button>
                </div>
                </form>
            </div>
        </div>  
    </div>
  )
}

export default page