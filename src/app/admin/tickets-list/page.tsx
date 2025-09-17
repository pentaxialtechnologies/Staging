'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Ticket {
  _id: string;
  ticketId: string;
  createdAt: Date;
  ticket_type: string;
  ticketname: string;
  priority_status: string;
  ticket_description: string;
  ticket_status:string
  userId: {
    fullname: string;
  };
}

const Page = () => {
  const [ticketsData, setTicketsData] = useState<Ticket[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');   
  const [typeFilter, setTypeFilter] = useState('');       
  const [excludeClosed, setExcludeClosed] = useState(false);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/auth/ticket/get`);
      if (!res.ok) throw new Error('Failed to fetch tickets');
      const response = await res.json();
      setTicketsData(response.Tickets);
    })();
  }, []);

  const filtered = useMemo(() => {
    return ticketsData.filter((ticket) => {
      const matchNameSearch = ticket.ticketname
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchStatus =
        !statusFilter || ticket.priority_status === statusFilter;

      const matchType =
        !typeFilter || ticket.ticket_type === typeFilter;
      const matchClosed = !excludeClosed || ticket.ticket_status !== "Closed"


      return matchNameSearch && matchStatus && matchType && matchClosed;
    });
  }, [ticketsData, search, statusFilter, typeFilter,excludeClosed]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-center">My Tickets</h1>

      <h3 className="text-2xl font-bold mb-4 mt-4">Tickets</h3>

      <div className="flex flex-wrap gap-8 items-center mt-8">
        {/* Search */}
        <div>
          <label className="block mb-4 text-xl text-center">Search</label>
          <input
            type="text"
            value={search}
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
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
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
            onChange={(e) => setStatusFilter(e.target.value)}
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

      {/* Tickets list */}
      <div>
        {filtered.map((ticket) => (
          <div key={ticket._id} className="mt-5 bg-white p-8 shadow-xl">
            <div className="flex justify-between items-center text-xl mb-2">
              <p>Ticket ID - {ticket.ticketId}</p>
              <p>Posted At : {new Date(ticket.createdAt).toLocaleString()}</p>
            </div>

            <div className="font-semibold text-xl mt-5 mb-5">
              <p className="mb-4">
                Ticket Name - <span className="text-lg font-normal">{ticket.ticketname}</span>
              </p>
              <p className="mb-4">
                Type: <span className="text-lg font-normal">{ticket.ticket_type}</span>
              </p>
              <p>
                Description:
                <span className="text-lg font-normal">
                  {ticket.ticket_description.replace(/<[^>]+>/g, '')}
                </span>
              </p>
              <p className='font-semibold text-xl mt-5'> Status:<span className="text-lg font-normal"> {ticket.ticket_status}</span></p>

            </div>

            <div className="flex items-center justify-between mt-5">
              <p className="font-semibold text-xl">
                User: <span className="text-lg font-normal">{ticket.userId.fullname}</span>
              </p>
              <button
                onClick={() => router.push(`/admin/tickets-list/${ticket._id}`)}
                className="text-blue-600 text-xl hover:text-blue-900"
              >
                Open Ticket
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
