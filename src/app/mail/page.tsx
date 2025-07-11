"use client";
import React, { useState } from "react";

interface mailer {
  to: string;
  subject: string;
  message: string;
}

const Page = () => {
  const [form, setForm] = useState<mailer>({
    to: "",
    subject: "",
    message: "",
  });

  const handlechange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      const res = await fetch("/api/auth/send-email", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({
          to: form.to,
          subject: form.subject,
          message: form.message,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send mail");
      }
      alert("Send Mail Successfully");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="min-h-screen max-w-md mx-auto ">
      <div>
        <h1 className="text-3xl mb-10">Email to others from Gmail. </h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 mt-5">To</label>
            <input
              type="text"
              name="to"
              value={form.to}
              onChange={handlechange}
              className="px-4 py-2 border border-gray-600 rounded-2xl focus:outline-none"
              placeholder="Enter To mail"
            />
          </div>
          <div>
            <label className="block mb-2 mt-2">Subject</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handlechange}
              className="px-4 py-2 border border-gray-600 rounded-2xl focus:outline-none"
              placeholder="Enter Subject"
            />
          </div>
          <div>
            <label className="block mb-2">Message</label>
            <textarea
              value={form.message}
              name="message"
              onChange={handlechange}
              className="px-4 py-2 border border-gray-600 rounded-2xl focus:outline-none"
              placeholder="Enter Message"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 px-4 py-2 rounded-md  mt-2"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
