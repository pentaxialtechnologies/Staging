"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

interface Staff {
  OrgId: string;
  primarySkills: string[];
  skills: string[];
  designation: string;
  numberBenchStaff: string;
  averageExperience: string;
  rate: string;
  rateType: string;
  availability: string;
  inDirectMessage: boolean;
  engagementType: string;
  workFrom: string;
  availableAtClientLocation: string;
}

const Staffpage = () => {
  const [Form, setForm] = useState<Staff>({
    OrgId: "",
    primarySkills: [],
    skills: [],
    designation: "",
    numberBenchStaff: "",
    averageExperience: "",
    rate: "",
    rateType: "",
    availability: "",
    inDirectMessage: false,
    engagementType: "",
    workFrom: "",
    availableAtClientLocation: "",
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm({ ...Form, [name]: value });
  };
  const router = useRouter();
  const { data: session } = useSession();
  // const Id = session?.user.id
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/organization/staff/create", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({ ...Form, OrgId: session?.user.id }),
      });

      if (!res.ok) {
        throw new Error("failed to create");
      }
      const data = await res.json();
      console.log(data, "data");
      alert("registered successful!");
      router.push("/provider/list-staffs");
    } catch (error) {
      console.error(error);
    }
  };

  const [skillInput, setSkillInput] = useState("");

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || (e.key === "," && skillInput.trim())) {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (!Form.skills.includes(newSkill)) {
        setForm({ ...Form, skills: [...Form.skills, newSkill] });
      }
      setSkillInput("");
    }
  };

  const RemoveSkill = (skill: string) => {
    setForm({
      ...Form,
      skills: Form.skills.filter((s: string) => s !== skill),
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex flex-row justify-between">
          <h1 className="text-xl sm:text-2xl font-bold ">
            Listing - Add Staff details
          </h1>
          <button className="border border-orange-500 px-4 py-2 rounded-full p-2">
            Back
          </button>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <label className="block mb-2">
                  Primary Skills <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Primary Skill"
                  className="px-4 py-2 border outline-none focus:outline-none rounded-lg"
                  name="primarySkills"
                  value={Form.primarySkills}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block mb-2">
                  Skills <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2  rounded-lg">
                  {Form.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-600 px-3 py-1 break-all rounded-full items-center  justify-between gap-4 text-sm"
                    >
                      {skill}
                      <button
                        onClick={() => RemoveSkill(skill)}
                        className="text-red-500 font-bold"
                      >
                        &times;{" "}
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Type Skill and press Enter"
                  className="flex-1 min-w-[150px] px-2 py-1 outline-none text-sm"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                />
              </div>
              <div>
                <label className="block mb-2">
                  Designation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex:Senior Software Developer"
                  className="px-4 py-2 border outline-none focus:outline-none rounded-lg"
                  name="designation"
                  value={Form.designation}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-2">
                  Number Bench Staff <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex:1,2,3,5,8"
                  className="px-4 py-2 border outline-none focus:outline-none rounded-lg"
                  name="numberBenchStaff"
                  value={Form.numberBenchStaff}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-2">
                  Average Experience(Year){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: 3 years"
                  className="px-4 py-2 border outline-none focus:outline-none rounded-lg"
                  name="averageExperience"
                  value={Form.averageExperience}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-2">
                  Rate <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: 15$"
                  className="px-4 py-2 border outline-none focus:outline-none rounded-lg"
                  name="rate"
                  value={Form.rate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate Type <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="rateType"
                  value={Form.rateType}
                  onChange={handleChange}
                  required
                >
                  <option value="" defaultChecked>
                    Select Rate Type
                  </option>
                  <option value="Hourly">Hourly</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={Form.availability}
                  name="availability"
                  onChange={handleChange}
                >
                  <option value="" defaultChecked>
                    Select Avalibility
                  </option>
                  <option value="Immeditely">Immeditely</option>
                  <option value="In 1 or 2 weeks from now">
                    In 1 or 2 weeks from now
                  </option>
                  <option value="In 1 or 2 months from now">
                    In 1 or 2 months from now
                  </option>
                  <option value="Im not sure at this Point">
                    I&apos;m not sure at this Point
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Engagement Type <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={Form.engagementType}
                  name="engagementType"
                  onChange={handleChange}
                >
                  <option value="" defaultChecked>
                    Select Type
                  </option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Full-time">Full-time</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work From <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={Form.workFrom}
                  name="workFrom"
                  onChange={handleChange}
                >
                  <option value="" defaultChecked>
                    Select Work Mode
                  </option>
                  <option value="Remote">Remote</option>
                  <option value="On-Site">On-Site</option>
                  <option value="Agency-Office">Agency-Office</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {" "}
                  Available at client&apos;s location{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={Form.availableAtClientLocation}
                  name="availableAtClientLocation"
                  onChange={handleChange}
                >
                  <option value="" defaultChecked>
                    Select Avalible
                  </option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="bg-green-800 hover:bg-green-900 text-white mt-5 px-4 py-2 "
            >
              Save Details
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Staffpage;
