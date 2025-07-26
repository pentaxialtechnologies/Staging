"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import plan from "../../../public/Plan.png";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const role = searchParams.get("role");

  const [status, setStatus] = useState("🔄 Verifying your email...");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token || !role) {
        setStatus("❌ Invalid or missing verification link.");
        return;
      }

      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, role }),
        });

        const data = await res.json();
        console.log("Verification response:", data);

        if (res.status === 200) {
          setStatus("Email verified successfully.");
          setUserData(data); // Contains _id, email, role
          router.push('/users/login')
        } else if (res.status === 409) {
          setStatus("Email already verified. you can now login");
          setUserData(data);
        } else {
          setStatus(`❌ Verification failed: ${data.message}`);
        }
      } catch (err) {
        console.error("Error verifying email:", err);
        setStatus("❌ Network error. Please try again.");
      }
    };

    verifyEmail();
  }, [token, role,router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">{status}</h1>

      {userData?._id && (
        <>
          <div className="mb-8">
            <Image src={plan} alt="Verification" className="w-full h-auto" priority />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl">
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
                  disabled={!userData?._id}
                  onClick={() =>
                    router.push(`/providers/complete-registration/${userData._id}`)
                  }
                  className={`w-full px-4 py-2 rounded-full mb-4 text-white ${
                    userData?._id
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
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
        </>
      )}
    </div>
  );
}


// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import plan from "../../../public/Plan.png";

// export default function VerifyEmailPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const token = searchParams.get("token");
//   const role = searchParams.get("role");

//   const [status, setStatus] = useState("🔄 Verifying your email...");
// const [userData, setUserData] = useState<any>(null);

//   useEffect(() => {
//     const verifyEmail = async () => {
//       if (!token || !role) {
//         setStatus("❌ Invalid or missing verification link.");
//         return;
//       }

//       try {
//         const res = await fetch("/api/auth/verify-email", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ token, role }),
//         });

//         const data = await res.json();
//       setUserData(data);
//         console.log(data,'response');
        
        
//         if (res.status === 200) {
//           setStatus("✅ Email verified successfully.");
//           console.log();
          
//           // setTimeout(() => router.push("/user/login"), 3000);
//         } else if (res.status === 409) {
//           setStatus("⚠️ Email already verified");
//           // setTimeout(() => router.push("/user/login"), 3000);
//         } else {
//           setStatus(`❌ Verification failed: ${data.message}`);
//         }
//       } catch (err) {
//         console.error("Error verifying email:", err);
//         setStatus("❌ Network error. Please try again.");
//       }
//     };

//     verifyEmail();
//   }, [token, role, router]);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
//       <h1 className="text-2xl font-semibold text-gray-800 mb-4">{status}</h1>
//    {userData && (
//     <>
   

//    <div className="">
//         <Image src={plan} alt="Verification" className="w-full h-auto" priority />
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
// <div className="bg-white p-6 border border-gray-200 shadow-md rounded">
//   <h1 className="text-xl font-bold">Free</h1>
//   <p className="text-lg">₹0</p>
//   <p className="text-lg mb-2">Monthly</p>
//   <button onClick={()=> router.push(`/providers/complete-registration/${userData._id}`)} className="bg-blue-600 text-white px-4 py-2 rounded-full mb-2">Start My Plan</button>
//  <p className="text-xl font-bold mb-2">Free Features included</p>
//  <p>Apply to 2 Jobs per Month</p>
//  <p>Create your free agency profile</p>
//  <p>Deploy your bench up to 1 skills</p>
//  <p>Get listed in 2 services & 1 location</p>
//  <p>Listing as per the research & review score</p>
//  <p>Unlimited review submission</p>
// </div>
// <div className="bg-white p-6 border border-gray-200 shadow-md rounded">
//   <h1 className="text-xl font-bold">Growth</h1>
//   <p className="text-lg">₹4999</p>
//   <p className="text-lg mb-2">Monthly</p>
//   <button className="bg-blue-600 text-white px-4 py-2 rounded-full mb-2">Start My Plan</button>
//  <p className="text-xl font-bold mb-2">Free Features included</p>
//  <p>Apply to 2 Jobs per Month</p>
//  <p>Create your free agency profile</p>
//  <p>Deploy your bench up to 1 skills</p>
//  <p>Get listed in 2 services & 1 location</p>
//  <p>Listing as per the research & review score</p>
//  <p>Unlimited review submission</p>
// </div>

// <div className="bg-white p-6 border border-gray-200 shadow-md rounded">
//   <h1 className="text-xl font-bold">Business</h1>
//   <p className="text-lg">₹19999</p>
//   <p className="text-lg mb-2">Monthly</p>
//   <button className="bg-blue-600 text-white px-4 py-2 rounded-full mb-2">Start My Plan</button>
//  <p className="text-xl font-bold mb-2">Free Features included</p>
//  <p>Apply to 2 Jobs per Month</p>
//  <p>Create your free agency profile</p>
//  <p>Deploy your bench up to 1 skills</p>
//  <p>Get listed in 2 services & 1 location</p>
//  <p>Listing as per the research & review score</p>
//  <p>Unlimited review submission</p>
// </div>
// <div className="bg-white p-6 border border-gray-200 shadow-md rounded">
//   <h1 className="text-xl font-bold">Enterprise</h1>
//   <p className="text-lg">₹49999</p>
//   <p className="text-lg mb-2">Monthly</p>
//   <button className="bg-blue-600 text-white px-4 py-2 rounded-full mb-2">Start My Plan</button>
//  <p className="text-xl font-bold mb-2">Free Features included</p>
//  <p>Apply to 2 Jobs per Month</p>
//  <p>Create your free agency profile</p>
//  <p>Deploy your bench up to 1 skills</p>
//  <p>Get listed in 2 services & 1 location</p>
//  <p>Listing as per the research & review score</p>
//  <p>Unlimited review submission</p>
// </div>
//   </div>
//    </>
//   )}
     
//     </div>
//   );
// }
