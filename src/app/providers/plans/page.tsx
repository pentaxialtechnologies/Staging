'use client'
import React from 'react'
import Image from "next/image";
import plan from "../../../../public/Plan.png";
import { useRouter } from 'next/navigation';
const Page = () => {
const router = useRouter()

  
  return (
    <div className="max-w-8xl mx-auto flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4"></h1>

   
          <div className="mb-8">
            <Image src={plan} alt="Verification" className="w-full h-auto" priority />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl">
            {/* Plan Card Component */}
            {[
              { title: "Free", price: "₹0" },
              { title: "Growth", price: "₹4999" },
              { title: "Business", price: "₹19999" },
              { title: "Enterprise", price: "₹49999" },
            ].map((plan, index) => (
              <div
                key={index}
                className="bg-white p-6 border border-gray-200 shadow-md rounded"
              >
                <h1 className="text-xl font-bold">{plan.title}</h1>
                <p className="text-lg">{plan.price}</p>
                <p className="text-lg mb-2">Monthly</p>

                <button
                  onClick={() =>
                    router.push(`/providers/complete-registration/`)
                  }
                  className={`w-full px-4 py-2 rounded-full mb-4 text-white bg-blue-600`}
                >
                  Start My Plan
                </button>

                <p className="text-xl font-bold mb-2">Free Features included</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✅ Apply to 2 Jobs per Month</li>
                  <li>✅ Create your free agency profile</li>
                  <li>✅ Deploy your bench up to 1 skills</li>
                  <li>✅ Get listed in 2 services & 1 location</li>
                  <li>✅ Listing as per the research & review score</li>
                  <li>✅ Unlimited review submission</li>
                </ul>
              </div>
            ))}
          </div>
    </div>
  )
}

export default Page