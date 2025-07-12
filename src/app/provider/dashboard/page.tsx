'use client';

import { DollarSign, User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import {  useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState, Suspense } from 'react';

interface UserType {
  id: string;
  firstname: string;
  lastname: string;
  email?: string;
}


const CompanyDashboardPage = () => {
  const [ completion,setCompletion] = useState<number>(0);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [ showmodel,setShowModal] = useState(false);
  const searchparams = useSearchParams()

  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
const router = useRouter()
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/auth/user/session', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setUserData(data.user);
      }
    };

    if (session?.user?.id) {
      fetchUser();
    }
  }, [session]);

  useEffect(() => {      
    const shouldShow = searchParams.get('profileCompleted');
    if (shouldShow === 'true') {
      setShowModal(true);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams]);

  useEffect(() => {
    const stored = localStorage.getItem('profile');
    if (stored && !isNaN(parseInt(stored))) {
      setCompletion(parseInt(stored));
    }
  }, []);

  if (status === 'loading' || !userData) {
    return <p className="p-4">Loading...</p>;
  }

  const handleClose = () => {
    setShowModal(false);
  }; 


  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Provider Dashboard</h1>

      <p className="text-2xl font-semibold text-blue-600 mb-4">
        Welcome, {userData.firstname} {userData.lastname}
      </p>

            <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-4">Profile Completion</h2>

        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
          <div
            className={`h-4 rounded-full transition-all duration-500 ${
              completion < 50 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${completion}%` }}
          ></div>
        </div>

        <p className="mt-3 text-sm text-gray-700">{completion}% completed</p>

     
           <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {/* Pricing card  */}
            <div onClick={()=> router.push('/company/pricing')} className='flex items-center bg-gradient-to-r from-green-100 to-green-50 p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer'>
                <div className='bg-green-200 p-3 rounded-full mr-4'>
            <DollarSign className="w-6 h-6 text-green-700" />
                </div>
                <div>
         <h3 className="text-xl font-semibold text-green-800">Pricing</h3>
          <p className="text-sm text-gray-600">Check our flexible plans</p>
                </div>
            </div>

            {/* Deploy Bench  */}
            <div onClick={()=> router.push('/company/staff')} className='flex items-center bg-gradient-to-r from-blue-100 to-blue-50 p-6 rounded-xl shadow hover:shadow-md transition  cursor-pointer'>
        <div className='bg-blue-200 rounded-full mr-4'>
            <User className='w-6 h-6 text-gray-700' />
        </div>
        <div>
        <h3 className="text-xl font-semibold text-blue-800">Deploy Your Bench</h3>
          <p className="text-sm text-gray-600">List your talent pool</p>
        </div>
            </div>
        </div>
      </div>
       


{showmodel && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-lg text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Your application has been submitted successfully.
            </h2>
            <p className="text-gray-600 mt-2">
              Your organization is currently under review. Complete your profile to speed up the submission process.
              We will notify you of our decision via email within 48 hours.
            </p>
            <button
              onClick={handleClose}
              className="mt-6 bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardWrapper = () => (
  <Suspense fallback={<p className="p-4">Loading...</p>}>
    <CompanyDashboardPage />
  </Suspense>
);


export default DashboardWrapper;
