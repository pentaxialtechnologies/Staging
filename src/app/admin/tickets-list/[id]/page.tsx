'use client'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Editor from '@/Components/Editor'
import { useSession } from 'next-auth/react'
import toast,{Toaster} from 'react-hot-toast'
interface Ticket{
  _id:string
  ticketname:string
  ticketId:string
  createdAt:Date
  ticket_type:string
  priority_status:string
  ticket_description:string
  ticket_status:string
  userId:{
      fullname:string
  }
}

interface Reply{
    _id:string
    messages:[
        {
    content:string
    authorRole:string
    createdAt:Date
        }
    ]
    ticketId:{
        priority_status:string
        }
    }

const TicketPage = () => {
  const {id} = useParams()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [Replies, setReplies] = useState<Reply[]>([])
  const [Drawer,setDrawer] = useState(false)
  const [reply,setReply] = useState('')
  // Fetch ticket details


  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`/api/auth/ticket/getbyId/${id}`)
        if (!res.ok) throw new Error('Failed to fetch details')
        const response = await res.json()
        setTicket(response.data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchTicket()
  }, [id])


const [Currentpage,setCurrentpage] = useState(1)
  
const ItemPerPage = 10

const flatReplies = useMemo(()=>{
if(!Replies) return []

return Replies.map((conv)=> 
conv.messages.map((messages)=>({...messages, ticketStatus: conv.ticketId.priority_status,}))
)
},[Replies])

const TotalPages = Math.ceil(flatReplies.length/ItemPerPage)

const PaginatedReplies = useMemo(()=> {
const start = (Currentpage -1) * ItemPerPage;
const end = start + ItemPerPage

return flatReplies.slice(start,end)
},[flatReplies,Currentpage])


const fetchReplies = useCallback(async () => {
  try {
    const res = await fetch(`/api/auth/ticket/reply/${id}`);
    if (!res.ok) throw new Error('Failed to fetch details');
    const response = await res.json();
    setReplies(response.data);
    
  } catch (err) {
    console.error(err);
  }
}, [id]);


  useEffect(()=>{
    fetchReplies()
  },[fetchReplies])
const {data:session} = useSession()

  // Memoize stripped description
  const plainDescription = useMemo(() => {
    return ticket?.ticket_description.replace(/<[^>]+>/g, '') || ''
  }, [ticket?.ticket_description])



  // Handlers
  const handleSubmit = useCallback(async () => {
    try {
      setDrawer(true);
      const res = await fetch(`/api/auth/ticket/reply/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages:[{
            author: session?.user.id,
            content: reply,
            authorRole: 'Admin'
            }]
      })

      });
      if (!res.ok) throw new Error('failed to respond');
      fetchReplies()
      const {data:newReply} = await res.json();
      setReplies(prev => [...prev, newReply]);

      setReply('')
    } catch (error) {
      console.error(error);
    } finally {
      setDrawer(false);
    }
  }, [ticket?.ticketId, reply, session?.user?.id, id]);



const handleReply = useCallback(()=>{
       setDrawer(true) 
    },[])
  
const handleStatusChange = useCallback(async(ticket_status:string) => {
  try{
const res = await fetch(`/api/auth/ticket/reply/${ticket?._id}`,{
  method:'PUT',
  headers:{
    'Content-Type': 'application/json'
  },
  body:JSON.stringify({ticket_status})
})

if(!res.ok){
  throw new Error('Failed to Fetch tickets')
}
const data = await res.json()
console.log(data.ticket,'data');
 setTicket(prev => prev ? { ...prev, ticket_status } : prev);
  toast.success('Status Updated Successfully!')
  }
  catch(error){ 
    console.error(error);
  }
  }, [ticket?._id])

  return (
    <div>
      <Toaster/>
      <h1 className='text-3xl text-center font-bold mb-6'>Ticket Detail Page</h1>
      <div className='bg-white p-8 shadow-xl'>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-xl font-bold'>
            Ticket Name - <span className='text-xl font-normal'>{ticket?.ticketname} </span>
          </h1>
          <p className={`${ticket?.ticket_status === "Open" ? "bg-green-600 text-white px-4 py-2 rounded-full" : "bg-red-600 text-white px-4 py-2 rounded-full"}`}>{ticket?.ticket_status}</p>
            <button 
              className='text-blue-700 hover:text-blue-800 text-xl underline'
              onClick={()=>handleStatusChange(ticket?.ticket_status === 'Open' ? "Closed" : "Open")}
            >
             {ticket?.ticket_status === "Open" ? "Marks as Resolved": "Click to Reopen"}
            </button>
            <button 
              className={`${ticket?.ticket_status === "Open" ? "bg-blue-500 px-4 py-2 rounded text-white font-bold" : "bg-blue-500 opacity-70 cursor-not-allowed px-4 py-2 rounded text-white font-bold"}`}
              onClick={handleReply}  disabled={ticket?.ticket_status !== 'Open'}
            >
              Reply
            </button>
          </div>

        {Drawer && (
            <div>
                <div>
                <Editor placeholder='Type your reply here..' description={reply} onChange={(html)=> setReply(html)} />
                </div>
                <div className='flex gap-8  items-end justify-end mt-15'>
                <button onClick={handleSubmit} className='bg-green-500 font-bold text-white px-4 py-2 rounded'>Submit</button>
                <button onClick={()=> setDrawer(false)} className='bg-red-500 font-bold  text-white px-4 py-2 rounded'>Cancel</button>
                    </div>
                
                </div>
        )}


        <div className='mb-4'>
          <h1 className='text-xl font-bold'>
            Type: <span className='text-xl font-normal'>  {ticket?.ticket_type}</span>
          </h1>
          <h3 className='text-xl font-bold'>
            Description: <span className='text-xl font-normal'> {plainDescription}</span>
          </h3>
        </div>
        <p className='text-xl font-bold'>Username: <span className='text-xl font-normal'>  {ticket?.userId.fullname}</span></p>
      </div>

      <div className="bg-white mt-8 p-8 shadow-lg">
  <h1 className="text-lg font-bold mb-4">Replies</h1>

  <div className="space-y-4">
  {Array.isArray(Replies) && PaginatedReplies?.map((replies,idx) => (
      replies.map((reply,idx)=> (
       <div
        key={idx}
        className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm"
      >
        <div className='flex justify-end items-end'>
           <p>Posted At:  {new Date(reply.createdAt).toLocaleDateString()}</p>
            </div>
        <p className="text-lg text-gray-800">
          {reply.content.replace(/<[^>]+>/g, '')}
        </p>
        <p>Status: {reply?.ticketStatus}</p>
        <p>Role:  {reply.authorRole}</p>
      </div>
    ))
    ))
  }
  </div>

  <div className='flex justify-center items-center gap-4 mt-4'>
  <button onClick={()=> setCurrentpage((p)=> Math.max(p-1,1))} disabled={Currentpage === 1} className='border px-3 py-2 rounded disabled:opacity-50'>
    Prev
  </button>
  <span>{Currentpage}/{TotalPages}</span>
  <button onClick={()=> setCurrentpage((p)=> Math.min(p+1,TotalPages))} disabled={Currentpage === TotalPages} className='border px-3 py-2 rounded disabled:opacity-50'>Next</button>
  </div>
</div>

    </div>
  )
}

export default TicketPage
