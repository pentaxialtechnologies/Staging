// app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
interface Proposal {
  JobId:{
    _id:string
  title: string;
  job_description: string;
  }
  id: string;
  description: string;
  provider: string;
  email: string;
}

export default function Dashboard() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [submittedProposals, setSubmittedProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  useEffect(() => {
    async function fetchProposals() {
      try {
        const res = await fetch("/api/auth/proposal/get"); 
        const datas = await res.json();
        setSubmittedProposals(datas.data || []);
        console.log(datas.data,'datas');
        
      } catch (error) {
        console.error("Error fetching proposals:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProposals();
  }, []);

  if (loading) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-4">
      {/* Only proposals section for now */}
      <div className="border rounded-lg shadow-sm">
        <button
          className="w-full flex justify-between items-center p-4 text-left font-medium hover:bg-gray-50 transition"
          onClick={() =>
            setOpenSection(openSection === "submitted" ? null : "submitted")
          }>
          <span>
            Submitted Proposals ({submittedProposals.length})
          </span>
          {openSection === "submitted" ? (
            <ChevronDown className="h-5 w-5 text-red-500" />
          ) : (
            <ChevronRight className="h-5 w-5 text-red-500" />
          )}
        </button>

        {openSection === "submitted" && submittedProposals.length > 0 && (
          <div className="p-4 border-t ">
            <div className="space-y-2 text-sm text-gray-700">
              {submittedProposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="p-2 bg-white rounded-md shadow-sm border"
                >
                  <p className="font-medium">{proposal.JobId.title}</p>
                  <p className="text-xs text-gray-500">
                    {proposal.JobId.job_description}
                  </p>

                  <Link className="text-blue-500" href={`/provider/offers/${proposal.JobId._id}`}>
                  {proposal.JobId.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {openSection === "submitted" && submittedProposals.length === 0 && (
          <div className="p-4 border-t text-gray-500 text-sm">
            No proposals found.
          </div>
        )}
      </div>
    </div>
  );
}
