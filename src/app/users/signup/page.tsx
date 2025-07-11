"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Signup() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-lg text-center"
      >
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
          Create Your Account
        </h1>
        <p className="text-gray-500 mb-8">Choose your role to continue</p>

        <div className="flex flex-col gap-5">
          <button
            onClick={() => router.push("/providers/register")}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-all duration-300"
          >
            👷 Signup as Provider
          </button>

          <button
            onClick={() => router.push("/employers/register")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300"
          >
            🏢 Signup as Employer
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/users/login")}
            className="text-indigo-600 hover:underline cursor-pointer"
          >
            Login here
          </span>
        </p>
      </motion.div>
    </div>
  );
}
