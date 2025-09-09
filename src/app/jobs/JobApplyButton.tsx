"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast,{Toaster} from 'react-hot-toast'
export default function JobApplyButton({jobId}: {jobId:string}) {
  const router = useRouter();
  const { data: session } = useSession();
console.log(jobId,'job ID from button');


    const checkUser = () => {
    if (session?.user) {
      router.push(`/apply-now/${jobId}`);
    } else {
        toast.error('Please Must be logged in for apply')
      router.push("/users/login");
    }
  };

  return (
    <>
    <Toaster/>
     <button
      onClick={checkUser}
      className="bg-[#F27264] text-white px-5 py-2 rounded-lg hover:bg-[#e05c50] transition duration-200"
    >
      Apply Now
    </button>
    </>
   
  );
}
