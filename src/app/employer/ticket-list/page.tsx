'use client';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {useRouter} from 'next/navigation'

interface ITicket {
    _id:string
priority_status:string
ticketId:string
ticket_status:string
ticket_type:string
ticketname:string
ticket_description:string
createdAt:Date
}

const page = () => {
const {data:session,status} = useSession()
const [TicketData,setTicketData] = useState<ITicket[]>([])
const [Search,setSearch] = useState('')
const[Typefilter,setTypefilter] = useState('')
const [statusFilter,setstatusFilter] = useState('')
const [excludeClosed,setExcludeClosed] = useState(false)

const router = useRouter()

useEffect(()=>{
(async()=>{
    if(status !== 'authenticated' || !session?.user.id) return;
    const res = await fetch(`/api/auth/ticket/getemployer-ticket/${session?.user.id}`,{
        method:'GET'
    })
    if(!res.ok){
        throw new Error('Failed to Fetch')
    }
    const response = await res.json()
    setTicketData(response.data)
}) ()
},[session?.user.id])

const filteredData = useMemo(()=> {
return TicketData.filter(ticket => {
    const FindSearch = ticket.ticketname.toLowerCase().includes(Search.toLowerCase())
    const Typescheck = !Typefilter || ticket.ticket_type === Typefilter
    const statuscheck = !statusFilter || ticket.priority_status === statusFilter
    const TickCheck = !excludeClosed || ticket.ticket_status !== "Closed"
    return FindSearch && Typescheck && statuscheck && TickCheck
})
},[TicketData,Search,Typefilter,statusFilter,excludeClosed])   




  return (
    <div>
        <div>
            <h1 className='text-3xl font-bold text-center'>Ticket Listing</h1>
            <div>
            <h3 className='text-xl font-bold mb-6 mt-6'>Tickets</h3>
           <div className="flex flex-wrap gap-8 items-center mt-8">
        {/* Search */}
        <div>
          <label className="block mb-4 text-xl text-center">Search</label>
          <input
            type="text"
            value={Search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="search for ticket"
            className="px-4 py-2 border rounded"
          />
        </div>

        {/* Ticket Type */}
        <div>
          <label className="block mb-4 text-xl text-center">Ticket Type</label>
          <select
            className="px-4 py-2 border rounded"
            value={Typefilter}
            onChange={(e) => setTypefilter(e.target.value)}
          >
            <option value="">Select Type</option>
            <option value="Job Posting">Job Posting</option>
            <option value="Proposal">Proposal</option>
            <option value="Regulatory">Regulatory</option>
            <option value="Compliance">Compliance</option>
            <option value="Contractual">Contractual</option>
            <option value="NDA requirements">NDA requirements</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block mb-4 text-xl text-center">Priority</label>
          <select
            className="px-4 py-2 border rounded"
            value={statusFilter}
            onChange={(e) => setstatusFilter(e.target.value)}
          >
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className='flex items-center gap-3'>
          <input type='checkbox' className='h-5 w-5 accent-blue-600 cursor pointer rounded' onChange={(e)=> setExcludeClosed(e.target.checked)} checked={excludeClosed} />
          <label htmlFor='excludedResolved' className='gap-4 text-xl font-bold '>Exclude Resolved</label>
        </div>
      </div>
      <div className='mt-8'>
  {filteredData?.map((ticket)=>(
        <div key={ticket._id} className='bg-white p-8 border rounded shadow-md'>
            <div className='flex flex-wrap justify-between items-center '>
                <h1 className='text-xl font-bold mb-2 mt-4'>Ticket ID - <span className='text-xl font-normal'>{ticket.ticketId}</span></h1>
                <p  className='text-xl font-bold mb-2 mt-4'>Posted At : <span className='text-xl font-normal'>{new Date(ticket.createdAt).toLocaleDateString()}</span></p>
            </div>
            <div className='text-xl font-bold mt-4'>
                <p className='mt-4'>Ticket Name - <span className='text-xl font-normal '> {ticket.ticketname}</span></p>
                <p className='mt-4'>Type - <span className='text-xl font-normal mt-4'>{ticket.ticket_type}</span></p>
                <p className='mt-4'>Description:<span className='text-xl font-normal mt-4'>{ticket.ticket_description.replace(/<[^>]+>/g, '')}</span></p>
                <div className='flex items-center justify-between '>
                    <p className='mt-4'>Status: <span className='text-xl font-normal mt-4'>{ticket.ticket_status}</span></p>
                <button onClick={()=>router.push(`/employer/ticket-list/${ticket._id}`)} className='text-end text-blue-700 hover:text-blue-800 '>Open Ticket</button>
                    </div>
                
                </div>
            </div>
      ))}
      </div>
    
            </div>




        </div>
    </div>
  )
}

export default page

