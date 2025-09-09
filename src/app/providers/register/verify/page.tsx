"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import logo from '../../../../../public/email-logo.jpg';
import toast, { Toaster } from 'react-hot-toast';

const Page = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [Role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('usermail');
    console.log('email',email);
    
    const role = localStorage.getItem('userrole');
    setUserEmail(email);
    console.log('role',role);

    setRole(role);
  }, []);

  const ResendMail = async () => {
    if (!userEmail || !Role) {
      toast.error("Missing email or role in localStorage");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, role: Role }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("✅ Verification email resent successfully!");
      } else {
        toast.error(`❌ ${data.message || "Failed to resend"}`);
      }
    } catch (err) {
      console.error("Resend error:", err);
      toast.error("❌ Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <Toaster />
      <div className="border border-gray-300 shadow-md rounded-md">
        <div className="flex flex-col items-center justify-center p-8">
          <Image src={logo} alt="Email Logo" width={150} height={100} />

          <h1 className="text-2xl font-bold mt-4">Please Verify Your Email</h1>

          <p className="text-center mt-2">
            You’re almost there! We’ve sent a verification email to:
          </p>

          <p className="text-blue-600 font-semibold mt-1">
            {userEmail || 'Loading...'}
          </p>

          <p className="text-gray-500 mt-3 text-sm">
            Please check your inbox and click the verification link.
          </p>

          <p className="mt-4 text-sm">Didn&apos;t receive the email?</p>

          <button
            onClick={ResendMail}
            disabled={loading}
            className={`px-4 py-2 mt-2 rounded-lg text-white ${
              loading ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {loading ? 'Resending...' : 'Resend Email'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
