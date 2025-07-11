"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone_number: string;
  isProfileComplete: boolean;
}

const Organizationpage = () => {
  const [form, setForm] = useState<FormData>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phone_number: "",
    isProfileComplete: false,
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/organization/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Registration Failed");
      }

      router.push("/users/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-center font-bold text-3xl mb-6 text-blue-600">
          Organization Register Page
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              name="firstname"
              placeholder="Enter First Name"
              value={form.firstname}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              name="lastname"
              placeholder="Enter Last Name"
              value={form.lastname}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              placeholder="Enter Phone Number"
              value={form.phone_number}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-900 hover:bg-green-800 px-4 py-2 mt-2 text-white rounded-lg transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Organizationpage;
