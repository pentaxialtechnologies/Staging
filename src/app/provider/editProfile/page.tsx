"use client";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";

interface FormType {
  userId?: string;
  userprofile: string;
  username: string;
  headline: string;
  industry: string;
  public_profile_url: string;
}

const Page = () => {
  const [Editmode, setEditmode] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const userId = session?.user.id;
  console.log();

  const [Formdata, setFormData] = useState<FormType>({
    userprofile: "",
    username: "",
    headline: "",
    industry: "",
    public_profile_url: "",
  });

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      const res = await fetch(
        `/api/auth/provider/userprofile/update/${userId}`,
      );
      if (res.ok) {
        const data = await res.json();
        setFormData(data.user);
        setEditmode(true);
      }
    };
    fetchData();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...Formdata, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "userprofile",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSizeMB = 2;

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG or PNG files are allowed!");
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File is too large. Max size: ${maxSizeMB}MB`);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "profile");
    formData.append("folder", "company/profiles");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dfrfq0ch8/image/upload",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();
    if (data.secure_url) {
      if (field === "userprofile") {
        setFormData((prev) => ({
          ...prev,
          [field]: data.secure_url,
        }));
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const method = Editmode ? "PUT" : "POST";
      const url = Editmode
        ? `/api/auth/provider/userprofile/update/${userId}`
        : `/api/auth/provider/userprofile/create`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...Formdata, userId }),
      });

      if (res.ok) {
        const result = await res.json();
        alert(Editmode ? "Profile Updated" : "Profile Created");
        console.log("Success", result);
      } else {
        console.error("Failed to submit form");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white shadow-lg border border-gray-200 p-6 w-full ">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {Editmode ? "Edit Profile" : "Create Profile"}
          </h2>
          <div className="flex items-center">
            <button
              onClick={() => router.push("/provider/setting")}
              className="bg-orange-600 text-white px-4 py-2 rounded-full flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </div>
        </div>
        <div className="border w-full border-gray-200"></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {Formdata.userprofile && (
              <Image
                src={Formdata.userprofile}
                alt="Preview"
                className="mt-2 w-30 h-30 rounded-full"
              />
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label
                htmlFor="userprofile"
                className="mb-1 font-medium text-gray-700"
              >
                User Profile
              </label>
              <input
                id="userprofile"
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => handleFileUpload(e, "userprofile")}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Username Input */}
            <div className="flex flex-col">
              <label
                htmlFor="username"
                className="mb-1 font-medium text-gray-700"
              >
                User Name
              </label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={Formdata.username}
                onChange={handleChange}
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="username"
                className="mb-1 font-medium text-gray-700"
              >
                Headline
              </label>
              <input
                type="text"
                name="headline"
                placeholder="Headline"
                value={Formdata.headline}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label
                htmlFor="username"
                className="mb-1 font-medium text-gray-700"
              >
                Industry
              </label>
              <input
                type="text"
                name="industry"
                placeholder="Industry"
                value={Formdata.industry}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          <div>
            <label>Public profile url</label>
            <input
              type="text"
              name="public_profile_url"
              placeholder="Public Profile URL"
              value={Formdata.public_profile_url}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* File upload for userprofile */}

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {Editmode ? "Update Profile" : "Create Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
